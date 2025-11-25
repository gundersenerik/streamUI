/**
 * SVP Content Builder - API Module
 * Handles all API calls to SVP
 */

// AbortController for cancelling in-flight requests
let currentLoadController = null;

/**
 * Cancel any in-flight dynamic options loading
 */
function cancelPendingLoads() {
    if (currentLoadController) {
        currentLoadController.abort();
        currentLoadController = null;
    }
}

/**
 * Fetch categories from the API
 * @param {AbortSignal} signal - Optional abort signal
 * @returns {Promise<Array>} Array of category objects
 */
async function fetchCategories(signal) {
    const provider = AppState.getProviderConfig();
    if (!provider) return [];
    
    // Check cache first
    const cached = AppState.getCachedCategories();
    if (cached.length > 0) {
        return cached;
    }
    
    try {
        const url = `${provider.baseUrl}/categories?appName=${provider.appName}`;
        const response = await fetch(url, { signal });
        const data = await response.json();

        const categories = data._embedded?.categories || data.categories || [];
        AppState.setCachedCategories(categories);

        console.log(`✅ Loaded ${categories.length} categories for ${provider.id}`);
        return categories;

    } catch (error) {
        // Don't log aborted requests as errors
        if (error.name === 'AbortError') {
            console.log('⏹️ Categories fetch cancelled');
            return [];
        }
        console.error('❌ Failed to fetch categories:', error);
        return [];
    }
}

/**
 * Fetch podcast series from the API
 * We derive podcast categories by fetching audio content and extracting unique categories
 * This is more reliable than filtering the categories/series endpoint which doesn't filter properly
 * @param {AbortSignal} signal - Optional abort signal
 * @returns {Promise<Array>} Array of series objects
 */
async function fetchSeries(signal) {
    const provider = AppState.getProviderConfig();
    if (!provider) return [];

    // Check cache first
    const cached = AppState.getCachedSeries();
    if (cached.length > 0) {
        return cached;
    }

    try {
        // Fetch audio content and extract unique categories from it
        // This is the only reliable way to get actual podcast categories
        const url = `${provider.baseUrl}/search?appName=${provider.appName}&filter=assetType::audio&limit=200&additional=tags|metadata`;
        const response = await fetch(url, { signal });
        const data = await response.json();

        const assets = data._embedded?.assets || [];

        // Extract unique categories from audio content
        const categoryMap = new Map();
        for (const asset of assets) {
            if (asset.category && asset.category.id && asset.category.title) {
                categoryMap.set(asset.category.id, {
                    id: asset.category.id,
                    title: asset.category.title
                });
            }
        }

        // Convert to array and sort by title
        const series = Array.from(categoryMap.values())
            .sort((a, b) => a.title.localeCompare(b.title));

        AppState.setCachedSeries(series);

        console.log(`✅ Loaded ${series.length} podcast series for ${provider.id} (derived from audio content)`);
        return series;

    } catch (error) {
        // Don't log aborted requests as errors
        if (error.name === 'AbortError') {
            console.log('⏹️ Series fetch cancelled');
            return [];
        }
        console.error('❌ Failed to fetch podcast series:', error);
        return [];
    }
}

/**
 * Load dynamic options for filter dropdowns
 * Uses AbortController to cancel any pending requests when called again
 */
async function loadDynamicOptions() {
    // Cancel any in-flight requests to prevent race conditions
    cancelPendingLoads();

    const provider = AppState.getProviderConfig();
    if (!provider) return;

    const config = AppState.getContentTypeConfig();

    // Create new AbortController for this load operation
    currentLoadController = new AbortController();
    const signal = currentLoadController.signal;

    for (const filter of config.filters) {
        if (!filter.dynamic) continue;

        const select = document.querySelector(`[data-filter="${filter.id}"]`);
        if (!select) continue;

        // Show loading state
        select.innerHTML = '<option value="">Loading...</option>';

        let options = [];

        try {
            if (filter.dynamic === 'categories') {
                const categories = await fetchCategories(signal);
                options = categories.map(c => ({
                    value: c.id,
                    label: c.title
                }));
            } else if (filter.dynamic === 'series') {
                const series = await fetchSeries(signal);
                options = series.map(s => ({
                    value: s.id,
                    label: s.title
                }));
            }

            // Check if request was aborted before updating DOM
            if (signal.aborted) return;

            // Populate dropdown
            const placeholder = filter.dynamic === 'series'
                ? 'All Podcast Series'
                : 'All Categories';

            select.innerHTML = `<option value="">${placeholder}</option>` +
                options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('⏹️ Dynamic options load cancelled');
                return;
            }
            console.error('❌ Failed to load dynamic options:', error);
            select.innerHTML = '<option value="">Failed to load</option>';
        }
    }

    // Clear the controller reference when done
    currentLoadController = null;
}

/**
 * Fetch content preview from API
 * @returns {Promise<Object>} API response with assets
 */
async function fetchPreview() {
    const urls = generateUrl();
    
    if (!urls.readable) {
        throw new Error('No provider selected');
    }
    
    const response = await fetch(urls.readable);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Search content with custom query
 * @param {string} query - Search query
 * @returns {Promise<Object>} API response with assets
 */
async function searchContent(query) {
    const provider = AppState.getProviderConfig();
    if (!provider) {
        throw new Error('No provider selected');
    }
    
    const url = `${provider.baseUrl}/search?appName=${provider.appName}&q=${encodeURIComponent(query)}&limit=20`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
}
