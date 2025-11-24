/**
 * SVP Content Builder - API Module
 * Handles all API calls to SVP
 */

/**
 * Fetch categories from the API
 * @returns {Promise<Array>} Array of category objects
 */
async function fetchCategories() {
    const provider = AppState.getProviderConfig();
    if (!provider) return [];
    
    // Check cache first
    const cached = AppState.getCachedCategories();
    if (cached.length > 0) {
        return cached;
    }
    
    try {
        const url = `${provider.baseUrl}/categories?appName=${provider.appName}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const categories = data._embedded?.categories || data.categories || [];
        AppState.setCachedCategories(categories);
        
        console.log(`✅ Loaded ${categories.length} categories for ${provider.id}`);
        return categories;
        
    } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
        return [];
    }
}

/**
 * Fetch podcast series from the API
 * @returns {Promise<Array>} Array of series objects
 */
async function fetchSeries() {
    const provider = AppState.getProviderConfig();
    if (!provider) return [];
    
    // Check cache first
    const cached = AppState.getCachedSeries();
    if (cached.length > 0) {
        return cached;
    }
    
    try {
        const url = `${provider.baseUrl}/series?appName=${provider.appName}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const series = data._embedded?.categories || data.categories || [];
        AppState.setCachedSeries(series);
        
        console.log(`✅ Loaded ${series.length} series for ${provider.id}`);
        return series;
        
    } catch (error) {
        console.error('❌ Failed to fetch series:', error);
        return [];
    }
}

/**
 * Load dynamic options for filter dropdowns
 */
async function loadDynamicOptions() {
    const provider = AppState.getProviderConfig();
    if (!provider) return;
    
    const config = AppState.getContentTypeConfig();
    
    for (const filter of config.filters) {
        if (!filter.dynamic) continue;
        
        const select = document.querySelector(`[data-filter="${filter.id}"]`);
        if (!select) continue;
        
        // Show loading state
        select.innerHTML = '<option value="">Loading...</option>';
        
        let options = [];
        
        if (filter.dynamic === 'categories') {
            const categories = await fetchCategories();
            options = categories.map(c => ({
                value: c.id,
                label: c.title
            }));
        } else if (filter.dynamic === 'series') {
            const series = await fetchSeries();
            options = series.map(s => ({
                value: s.id,
                label: s.title
            }));
        }
        
        // Populate dropdown
        const placeholder = filter.dynamic === 'series' 
            ? 'All Podcast Series' 
            : 'All Categories';
            
        select.innerHTML = `<option value="">${placeholder}</option>` +
            options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    }
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
