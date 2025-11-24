/**
 * SVP Content Builder - State Management
 * Centralized application state
 */

const AppState = {
    // Current selections
    provider: '',
    contentType: 'live',
    discovery: null,
    filters: {},
    selectedTemplate: null,
    
    // Cached API data
    cache: {
        categories: {},  // Keyed by provider
        series: {}       // Keyed by provider
    },
    
    /**
     * Reset filters to defaults
     */
    resetFilters() {
        this.filters = {};
        this.discovery = null;
    },
    
    /**
     * Get current content type configuration
     */
    getContentTypeConfig() {
        return CONTENT_TYPES[this.contentType];
    },
    
    /**
     * Get current provider configuration
     */
    getProviderConfig() {
        return this.provider ? PROVIDERS[this.provider] : null;
    },
    
    /**
     * Set provider and clear cache
     */
    setProvider(providerId) {
        this.provider = providerId;
        // Don't clear cache - we want to keep it across provider switches
    },
    
    /**
     * Set content type and reset filters
     */
    setContentType(typeId) {
        this.contentType = typeId;
        this.resetFilters();
    },
    
    /**
     * Set a filter value
     */
    setFilter(key, value) {
        if (value) {
            this.filters[key] = value;
        } else {
            delete this.filters[key];
        }
    },
    
    /**
     * Apply discovery preset
     */
    applyDiscoveryPreset(discoveryId) {
        const config = this.getContentTypeConfig();
        const discovery = config.discovery.find(d => d.id === discoveryId);
        
        if (this.discovery === discoveryId) {
            // Toggle off
            this.discovery = null;
        } else {
            this.discovery = discoveryId;
            if (discovery && discovery.preset) {
                Object.assign(this.filters, discovery.preset);
            }
        }
    },
    
    /**
     * Get cached categories for current provider
     */
    getCachedCategories() {
        return this.cache.categories[this.provider] || [];
    },
    
    /**
     * Get cached series for current provider
     */
    getCachedSeries() {
        return this.cache.series[this.provider] || [];
    },
    
    /**
     * Set cached categories for current provider
     */
    setCachedCategories(categories) {
        this.cache.categories[this.provider] = categories;
    },
    
    /**
     * Set cached series for current provider
     */
    setCachedSeries(series) {
        this.cache.series[this.provider] = series;
    }
};
