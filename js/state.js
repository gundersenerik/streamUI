/**
 * SVP Content Builder - State Management
 * Centralized application state
 */

const AppState = {
    // Selected provider configuration
    provider: null,
    
    // Current content type (live, sports, podcasts, vod, all)
    contentType: 'live',
    
    // Selected discovery preset
    discovery: null,
    
    // User-selected filter values
    filters: {},
    
    // Currently selected liquid template
    selectedTemplate: 'single-simple',
    
    // Cached API data
    cache: {
        categories: [],
        sportTypes: [],
        tags: []
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
        return CONTENT_TYPES[this.contentType] || CONTENT_TYPES.live;
    },
    
    /**
     * Set provider by ID
     */
    setProvider(providerId) {
        this.provider = PROVIDERS[providerId] || null;
        // Clear cache when provider changes
        this.cache = {
            categories: [],
            sportTypes: [],
            tags: []
        };
    },
    
    /**
     * Set content type and reset related state
     */
    setContentType(typeId) {
        this.contentType = typeId;
        this.discovery = null;
        this.filters = {};
    },
    
    /**
     * Update a single filter value
     */
    setFilter(filterId, value) {
        if (value === '' || value === null || value === undefined) {
            delete this.filters[filterId];
        } else {
            this.filters[filterId] = value;
        }
    },
    
    /**
     * Get filter value with fallback to default
     */
    getFilter(filterId, defaultValue = null) {
        return this.filters[filterId] ?? defaultValue;
    }
};
