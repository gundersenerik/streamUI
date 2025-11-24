/**
 * SVP Content Builder - API Module
 * Handles all API calls to SVP endpoints
 */

const API = {
    /**
     * Fetch categories from the API
     */
    async fetchCategories() {
        if (!AppState.provider) {
            console.warn('No provider selected');
            return [];
        }
        
        // Return cached if available
        if (AppState.cache.categories.length > 0) {
            return AppState.cache.categories;
        }
        
        try {
            const url = `${AppState.provider.baseUrl}/categories?appName=${AppState.provider.appName}`;
            console.log('📁 Fetching categories:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data._embedded && data._embedded.categories) {
                const categories = data._embedded.categories
                    .filter(cat => cat.showCategory)
                    .map(cat => ({
                        id: cat.id,
                        value: cat.id,
                        label: cat.title || `Category ${cat.id}`,
                        isSeries: cat.isSeries || false
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                
                AppState.cache.categories = categories;
                console.log(`✅ Loaded ${categories.length} categories`);
                return categories;
            }
            
            return [];
        } catch (error) {
            console.error('❌ Error fetching categories:', error);
            return [];
        }
    },
    
    /**
     * Fetch tags/teams from the API
     */
    async fetchTags() {
        if (!AppState.provider) {
            return [];
        }
        
        if (AppState.cache.tags.length > 0) {
            return AppState.cache.tags;
        }
        
        try {
            const url = `${AppState.provider.baseUrl}/tags?appName=${AppState.provider.appName}`;
            console.log('🏷️ Fetching tags:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data._embedded && data._embedded.tags) {
                const tags = data._embedded.tags.map(tag => ({
                    value: tag.id,
                    label: tag.tag || tag.id
                })).sort((a, b) => a.label.localeCompare(b.label));
                
                AppState.cache.tags = tags;
                console.log(`✅ Loaded ${tags.length} tags`);
                return tags;
            }
            
            return [];
        } catch (error) {
            console.error('❌ Error fetching tags:', error);
            return [];
        }
    },
    
    /**
     * Fetch sport types (uses fallback as API doesn't have dedicated endpoint)
     */
    async fetchSportTypes() {
        if (AppState.cache.sportTypes.length > 0) {
            return AppState.cache.sportTypes;
        }
        
        // Use default sport types as there's no dedicated endpoint
        AppState.cache.sportTypes = DEFAULT_SPORT_TYPES;
        return DEFAULT_SPORT_TYPES;
    },
    
    /**
     * Fetch podcasts (categories that are series)
     */
    async fetchPodcasts() {
        const categories = await this.fetchCategories();
        // Filter to only series-type categories, or return all if none marked as series
        const podcasts = categories.filter(cat => cat.isSeries);
        return podcasts.length > 0 ? podcasts : categories;
    },
    
    /**
     * Load dynamic options for a filter
     */
    async loadDynamicOptions(filterId) {
        switch (filterId) {
            case 'category':
                return await this.fetchCategories();
            case 'sportType':
                return await this.fetchSportTypes();
            case 'teams':
                return await this.fetchTags();
            default:
                return [];
        }
    },
    
    /**
     * Test API connectivity
     */
    async testConnection() {
        if (!AppState.provider) {
            return { success: false, error: 'No provider selected' };
        }

        try {
            const url = `${AppState.provider.baseUrl}/search?appName=${AppState.provider.appName}&limit=1`;
            const response = await fetch(url);

            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetch preview data using current filters
     */
    async fetchPreview() {
        if (!AppState.provider) {
            return { _embedded: { assets: [] } };
        }

        try {
            // Build URL using the same logic as Generator
            const config = AppState.getContentTypeConfig();
            const { fullUrl } = Generator.buildUrl(config);

            console.log('🔍 Fetching preview:', fullUrl);

            const response = await fetch(fullUrl);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ Preview loaded: ${data._embedded?.assets?.length || 0} items`);
            return data;
        } catch (error) {
            console.error('❌ Error fetching preview:', error);
            throw error;
        }
    }
};
