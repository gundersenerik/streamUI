/**
 * SVP Content Builder - URL Generator
 * Builds API URLs and Connected Content code
 */

/**
 * Generate API URL based on current state
 * @returns {Object} Object with encoded and readable URL versions
 */
function generateUrl() {
    const provider = AppState.getProviderConfig();
    if (!provider) {
        return { encoded: '', readable: '' };
    }

    const config = AppState.getContentTypeConfig();
    const filters = AppState.filters;

    // Build filter parts array
    const filterParts = [];

    // Base filter from content type (e.g., streamType::live or assetType::audio)
    if (config.baseFilter) {
        filterParts.push(config.baseFilter);
    }

    // Handle assetType filter (from presets like "Audio" in All Content)
    if (filters.assetType) {
        // Remove any existing assetType filter
        const idx = filterParts.findIndex(f => f.startsWith('assetType'));
        if (idx > -1) filterParts.splice(idx, 1);
        filterParts.push(`assetType::${filters.assetType}`);
    }

    // Override streamType if explicitly set
    if (filters.streamType) {
        // Remove existing streamType filter
        const idx = filterParts.findIndex(f => f.startsWith('streamType'));
        if (idx > -1) filterParts.splice(idx, 1);
        filterParts.push(`streamType::${filters.streamType}`);
    }

    // Handle contentType filter (unified filter for All Content section)
    // Maps: live -> streamType::live, vod -> streamType::vod, audio -> assetType::audio
    if (filters.contentType) {
        if (filters.contentType === 'audio') {
            // Audio content uses assetType filter (has streamType=vod internally)
            const idx = filterParts.findIndex(f => f.startsWith('assetType'));
            if (idx > -1) filterParts.splice(idx, 1);
            filterParts.push('assetType::audio');
        } else {
            // Live and VOD use streamType filter
            const idx = filterParts.findIndex(f => f.startsWith('streamType'));
            if (idx > -1) filterParts.splice(idx, 1);
            filterParts.push(`streamType::${filters.contentType}`);
        }
    }

    // Category filter
    if (filters.category) {
        filterParts.push(`category.id::${filters.category}`);
    }

    // Sport type filter
    if (filters.sportType) {
        filterParts.push(`additional.metadata.sportType::${filters.sportType}`);
    }

    // Access level filter
    if (filters.access) {
        filterParts.push(`access.${filters.access}::true`);
    }

    // Time-based filters
    addTimeFilters(filterParts, filters.timeFilter);

    // Build URL parameters
    const params = new URLSearchParams();
    params.set('appName', provider.appName);

    if (filterParts.length > 0) {
        params.set('filter', filterParts.join('|'));
    }

    params.set('limit', filters.limit || '10');

    if (filters.sort) {
        params.set('sort', filters.sort);
    }

    // Always request additional data for richer content
    params.set('additional', 'tags|metadata');

    // Build URLs
    const readable = `${provider.baseUrl}/search?${params.toString()}`;

    // Encode for Braze connected content
    const encoded = readable
        .replace(/&/g, '%26')
        .replace(/\|/g, '%7C');

    return { encoded, readable };
}

/**
 * Add time-based filters to filter array
 * @param {Array} filterParts - Array of filter strings
 * @param {string} timeFilter - Time filter preset name
 */
function addTimeFilters(filterParts, timeFilter) {
    if (!timeFilter) return;
    
    const now = getTimestamp('now');
    
    switch (timeFilter) {
        case 'next3h':
            filterParts.push(`flightTimes.start>=${now}`);
            filterParts.push(`flightTimes.start<=${getTimestamp('3h')}`);
            break;
            
        case 'today':
            filterParts.push(`flightTimes.start>=${now}`);
            filterParts.push(`flightTimes.start<=${getTimestamp('endOfDay')}`);
            break;
            
        case 'week':
            filterParts.push(`flightTimes.start>=${now}`);
            filterParts.push(`flightTimes.start<=${getTimestamp('week')}`);
            break;
            
        case 'month':
            filterParts.push(`flightTimes.start>=${now}`);
            filterParts.push(`flightTimes.start<=${getTimestamp('month')}`);
            break;
            
        case 'ended24h':
            filterParts.push(`flightTimes.end>=${getTimestamp('-24h')}`);
            break;
            
        case 'last24h':
            filterParts.push(`published>=${getTimestamp('-24h')}`);
            break;
            
        case 'lastWeek':
            filterParts.push(`published>=${getTimestamp('-week')}`);
            break;
            
        case 'lastMonth':
            filterParts.push(`published>=${getTimestamp('-month')}`);
            break;
    }
}

/**
 * Generate the full Connected Content code
 * @returns {string} Braze connected content code
 */
function generateConnectedContent() {
    const urls = generateUrl();
    const varName = $('variableName').value || 'content';
    
    if (!urls.encoded) {
        return 'Select a provider to begin...';
    }
    
    return `{% connected_content ${urls.encoded} :save ${varName} %}`;
}

/**
 * Generate Liquid template code for selected template
 * @returns {string} Liquid template code
 */
function generateLiquidCode() {
    if (!AppState.selectedTemplate) {
        return 'Select a template above...';
    }
    
    const template = TEMPLATES.find(t => t.id === AppState.selectedTemplate);
    if (!template) {
        return 'Template not found';
    }
    
    const varName = $('variableName').value || 'content';
    return template.code(varName);
}

/**
 * Update all output displays
 */
function updateOutputs() {
    const urls = generateUrl();
    
    $('connectedOutput').textContent = generateConnectedContent();
    $('urlOutput').textContent = urls.readable || 'https://svp.vg.no/...';
    
    updateLiquidOutput();
}

/**
 * Update just the Liquid output
 */
function updateLiquidOutput() {
    $('liquidOutput').textContent = generateLiquidCode();
}

/**
 * Generate suggested variable name based on provider and content type
 * @returns {string} Suggested variable name
 */
function generateVariableName() {
    const provider = AppState.getProviderConfig();
    const contentType = AppState.contentType;
    
    if (!provider) return 'content';
    
    const prefix = provider.shortName || provider.id.toUpperCase();
    return `${prefix}${contentType}`;
}
