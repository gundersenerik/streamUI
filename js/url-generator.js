// URL Generator - Builds the Connected Content API call

class URLGenerator {
    constructor(provider, contentType, filterValues) {
        this.provider = provider;
        this.contentType = contentType;
        this.filterValues = filterValues;
        this.providerConfig = getProvider(provider);
        this.contentTypeConfig = getContentType(contentType);
    }
    
    /**
     * Generate the complete Connected Content code
     */
    generateConnectedContent(variableName) {
        const url = this.buildAPIUrl();
        return `{% connected_content ${url} :save ${variableName} %}`;
    }
    
    /**
     * Build the complete API URL with all parameters
     */
    buildAPIUrl() {
        const baseUrl = this.providerConfig.baseUrl + this.contentTypeConfig.endpoint;
        const params = this.buildQueryParams();
        
        return `${baseUrl}?${params}`;
    }
    
    /**
     * Build query parameters string
     */
    buildQueryParams() {
        const params = [];
        
        // Always add appName
        params.push(`appName=${this.providerConfig.appName}`);
        
        // Add filters
        const filterString = this.buildFilterString();
        if (filterString) {
            params.push(`filter=${encodeURIComponent(filterString)}`);
        }
        
        // Add additional parameters (limit, sort, etc.)
        const additionalParams = this.buildAdditionalParams();
        params.push(...additionalParams);
        
        // Add additional fields if needed for live sports
        if (this.contentType === 'liveSports' || this.contentType === 'vodSports') {
            params.push('additional=tags|metadata');
        }
        
        return params.join('&');
    }
    
    /**
     * Build filter string for API
     */
    buildFilterString() {
        const filters = [];
        const contentTypeConfig = this.contentTypeConfig;
        
        // Add locked default filters first
        if (contentTypeConfig.defaultFilters) {
            Object.entries(contentTypeConfig.defaultFilters).forEach(([key, config]) => {
                if (config.locked) {
                    filters.push(`${key}::${config.value}`);
                }
            });
        }
        
        // Build filters from user input
        contentTypeConfig.filters.forEach(filterConfig => {
            const value = this.filterValues[filterConfig.id];
            
            // Skip if no value
            if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
                return;
            }
            
            // Handle different filter types
            if (filterConfig.apiPath) {
                const filterStr = this.buildFilterForAPI(filterConfig, value);
                if (filterStr) {
                    // Check if it's already a combined filter (contains |)
                    if (filterStr.includes('|')) {
                        // Split and add individually
                        filterStr.split('|').forEach(f => filters.push(f));
                    } else {
                        filters.push(filterStr);
                    }
                }
            }
        });
        
        // Join filters with pipe |
        return filters.join('|');
    }
    
    /**
     * Build a single filter string for API
     */
    buildFilterForAPI(filterConfig, value) {
        const path = filterConfig.apiPath;
        const operator = filterConfig.operator;
        
        // Handle different value types
        if (Array.isArray(value)) {
            // Multi-select: join with comma
            return `${path}${operator}${value.join(',')}`;
        } else if (filterConfig.isRelativeDate) {
            // Handle relative dates (next7days, today, etc.)
            const timestamps = this.calculateRelativeDateRange(value);
            if (timestamps) {
                const filters = [];
                if (timestamps.start) {
                    filters.push(`${path}>=${timestamps.start}`);
                }
                if (timestamps.end) {
                    filters.push(`${path}<=${timestamps.end}`);
                }
                return filters.length > 0 ? filters.join('|') : null;
            }
            return null;
        } else if (filterConfig.type === 'date' || filterConfig.type === 'datetime') {
            // Convert date to timestamp
            const timestamp = dateToTimestamp(value);
            return `${path}${operator}${timestamp}`;
        } else {
            // Simple value
            return `${path}${operator}${value}`;
        }
    }
    
    /**
     * Calculate timestamp range for relative dates
     */
    calculateRelativeDateRange(relativeValue) {
        if (!relativeValue) return null;
        
        const now = Math.floor(Date.now() / 1000); // Current timestamp
        const oneDaySeconds = 86400; // 24 * 60 * 60
        
        switch(relativeValue) {
            case 'today':
                const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
                const todayEnd = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);
                return { start: todayStart, end: todayEnd };
                
            case 'tomorrow':
                const tomorrowStart = Math.floor(new Date(Date.now() + oneDaySeconds * 1000).setHours(0, 0, 0, 0) / 1000);
                const tomorrowEnd = Math.floor(new Date(Date.now() + oneDaySeconds * 1000).setHours(23, 59, 59, 999) / 1000);
                return { start: tomorrowStart, end: tomorrowEnd };
                
            case 'next7days':
                return { start: now, end: now + (oneDaySeconds * 7) };
                
            case 'next14days':
                return { start: now, end: now + (oneDaySeconds * 14) };
                
            case 'next30days':
                return { start: now, end: now + (oneDaySeconds * 30) };
                
            default:
                return null;
        }
    }
    
    /**
     * Build additional query parameters (non-filter)
     */
    buildAdditionalParams() {
        const params = [];
        const contentTypeConfig = this.contentTypeConfig;
        
        contentTypeConfig.filters.forEach(filterConfig => {
            // These are direct query params, not filters
            if (filterConfig.paramName) {
                const value = this.filterValues[filterConfig.id];
                
                if (value && value !== '') {
                    params.push(`${filterConfig.paramName}=${encodeURIComponent(value)}`);
                } else if (filterConfig.default) {
                    params.push(`${filterConfig.paramName}=${encodeURIComponent(filterConfig.default)}`);
                }
            }
        });
        
        return params;
    }
    
    /**
     * Get a clean, readable version of the API URL for display
     */
    getReadableURL() {
        return this.buildAPIUrl();
    }
    
    /**
     * Generate example response structure
     */
    generateExampleResponse(variableName) {
        return `
// The API returns data in this structure:

${variableName} = {
  "_embedded": {
    "assets": [
      {
        "id": 123456,
        "title": "Match Title",
        "description": "Match description...",
        "images": {
          "main": "https://images.stream.schibsted.media/..."
        },
        "flightTimes": {
          "start": 1234567890,
          "end": 1234567890
        },
        "additional": {
          "access": "sport",
          "tags": [...],
          "metadata": {...}
        }
      }
    ]
  },
  "total": 10
}
        `.trim();
    }
}

/**
 * Helper function to create URL generator
 */
function createURLGenerator(provider, contentType, filterValues) {
    return new URLGenerator(provider, contentType, filterValues);
}
