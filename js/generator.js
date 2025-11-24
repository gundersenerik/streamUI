/**
 * SVP Content Builder - Generator Module
 * Handles URL building and code generation
 */

const Generator = {
    /**
     * Generate all outputs (connected content, URL, liquid template)
     */
    generateOutput() {
        if (!AppState.provider) {
            UI.updateOutputs(
                '{% connected_content [Select a provider first] :save content %}',
                'Select a provider to generate URL',
                'Select a template to generate code'
            );
            return;
        }
        
        const config = AppState.getContentTypeConfig();
        const varName = UI.elements.variableName.value || 'content';
        
        // Build the API URL
        const { fullUrl, encodedUrl } = this.buildUrl(config);
        
        // Generate connected content
        const connectedContent = `{% connected_content ${encodedUrl} :save ${varName} %}`;
        
        // Generate liquid template
        const liquidCode = this.generateLiquid(varName);
        
        // Update UI
        UI.updateOutputs(connectedContent, fullUrl, liquidCode);
    },
    
    /**
     * Build the API URL with all filters
     */
    buildUrl(config) {
        const filters = [];
        
        // Add base filter for content type
        if (config.filter) {
            filters.push(config.filter);
        }
        
        // Add discovery-based filters
        this.addDiscoveryFilters(config, filters);
        
        // Add user-selected filters
        this.addUserFilters(filters);
        
        // Build query params
        const params = new URLSearchParams();
        params.set('appName', AppState.provider.appName);
        
        if (filters.length > 0) {
            params.set('filter', filters.join('|'));
        }
        
        params.set('limit', AppState.getFilter('limit', 10));
        params.set('additional', 'tags|metadata');
        
        // Add sort
        const sort = AppState.getFilter('sort') || this.getDefaultSort(config);
        if (sort) {
            params.set('sort', sort);
        }
        
        const baseUrl = `${AppState.provider.baseUrl}/search`;
        const fullUrl = `${baseUrl}?${params.toString()}`;
        const encodedUrl = fullUrl.replace(/&/g, '%26').replace(/\|/g, '%7C');
        
        return { fullUrl, encodedUrl };
    },
    
    /**
     * Add discovery preset filters
     */
    addDiscoveryFilters(config, filters) {
        if (!AppState.discovery) return;
        
        const discoveryConfig = config.discovery.find(d => d.id === AppState.discovery);
        if (!discoveryConfig || !discoveryConfig.filter) return;
        
        const now = Math.floor(Date.now() / 1000);
        
        // Handle time-based discovery filters
        if (discoveryConfig.filter.includes('flightTimes.start>=')) {
            filters.push(`flightTimes.start>=${now}`);
            
            // Add end time bounds
            if (AppState.discovery === 'upcoming') {
                filters.push(`flightTimes.start<=${now + (3 * 60 * 60)}`);
            } else if (AppState.discovery === 'today') {
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                filters.push(`flightTimes.start<=${Math.floor(endOfDay.getTime() / 1000)}`);
            } else if (AppState.discovery === 'week') {
                filters.push(`flightTimes.start<=${now + (7 * 24 * 60 * 60)}`);
            } else if (AppState.discovery === 'month') {
                filters.push(`flightTimes.start<=${now + (30 * 24 * 60 * 60)}`);
            }
        } else if (discoveryConfig.filter.includes('flightTimes.end>=')) {
            // Recently ended (last 24 hours)
            filters.push(`flightTimes.end>=${now - (24 * 60 * 60)}`);
        } else if (discoveryConfig.filter.includes('streamType::')) {
            // Direct stream type filter
            filters.push(discoveryConfig.filter);
        }
    },
    
    /**
     * Add user-selected filters
     */
    addUserFilters(filters) {
        const userFilters = AppState.filters;
        
        if (userFilters.category) {
            filters.push(`categories.id::${userFilters.category}`);
        }
        
        if (userFilters.sportType) {
            filters.push(`additional.metadata.sportType::${userFilters.sportType}`);
        }
        
        if (userFilters.access) {
            filters.push(`additional.access::${userFilters.access}`);
        }
        
        if (userFilters.streamType) {
            filters.push(`streamType::${userFilters.streamType}`);
        }
        
        if (userFilters.dateStart) {
            const timestamp = Math.floor(new Date(userFilters.dateStart).getTime() / 1000);
            filters.push(`published>=${timestamp}`);
        }
    },
    
    /**
     * Get default sort for content type
     */
    getDefaultSort(config) {
        const sortFilter = config.filters.find(f => f.id === 'sort');
        return sortFilter?.default || '-published';
    },
    
    /**
     * Generate liquid template code
     */
    generateLiquid(varName) {
        const template = TEMPLATES.find(t => t.id === AppState.selectedTemplate);
        
        if (template) {
            return template.code(varName);
        }
        
        return 'Select a template above...';
    },
    
    /**
     * Generate a simple test URL (for debugging)
     */
    generateTestUrl() {
        if (!AppState.provider) return null;
        
        return `${AppState.provider.baseUrl}/search?appName=${AppState.provider.appName}&limit=5`;
    }
};
