/**
 * SVP Content Builder - Preview Module
 * Handles content preview loading and display
 */

/**
 * Load and display content preview
 */
async function loadPreview() {
    if (!AppState.provider) {
        showToast('Please select a provider first', 'error');
        return;
    }
    
    const btn = $('previewBtn');
    const btnText = btn.querySelector('.btn-text');
    const results = $('previewResults');
    
    // Show loading state
    btn.disabled = true;
    btnText.innerHTML = '<span class="spinner"></span> Loading...';
    
    try {
        const data = await fetchPreview();
        const assets = data._embedded?.assets || [];
        
        if (assets.length === 0) {
            results.innerHTML = `
                <div class="preview-empty">
                    <div class="preview-empty-icon">📭</div>
                    <div>No content found with current filters</div>
                    <small style="color:#999; display:block; margin-top:8px;">
                        Try adjusting your filters or selecting a different discovery preset
                    </small>
                </div>
            `;
        } else {
            renderPreviewResults(assets, data.total);
        }
        
    } catch (error) {
        console.error('Preview error:', error);
        results.innerHTML = `
            <div class="preview-empty">
                <div class="preview-empty-icon">⚠️</div>
                <div>Could not load preview</div>
                <small style="color:#999; display:block; margin-top:8px;">
                    ${error.message}<br>
                    Try opening the readable URL in a new tab to test the API directly
                </small>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Load Preview';
    }
}

/**
 * Render preview results
 * @param {Array} assets - Array of asset objects
 * @param {number} total - Total count from API
 */
function renderPreviewResults(assets, total) {
    const results = $('previewResults');
    
    const itemsHtml = assets.map(item => `
        <div class="preview-item">
            <div class="preview-thumb">
                ${item.images?.main 
                    ? `<img src="${item.images.main}?t[]=160q80" alt="" loading="lazy">` 
                    : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999;font-size:20px;">📷</div>'}
            </div>
            <div class="preview-info">
                <div class="preview-item-title">${escapeHtml(item.title)}</div>
                <div class="preview-item-meta">
                    ${renderStreamBadge(item.streamType)}
                    ${item.category?.title ? `<span>📁 ${escapeHtml(item.category.title)}</span>` : ''}
                    ${item.provider ? `<span>📡 ${item.provider}</span>` : ''}
                    ${item.flightTimes?.start ? `<span>🕐 ${formatTimestamp(item.flightTimes.start)}</span>` : ''}
                    ${item.duration ? `<span>⏱️ ${formatDuration(item.duration)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    const countHtml = `
        <div class="preview-count">
            Showing ${assets.length} of ${total || assets.length} items
        </div>
    `;
    
    results.innerHTML = itemsHtml + countHtml;
}

/**
 * Render stream type badge
 * @param {string} streamType - Stream type (live, vod, audio)
 * @returns {string} HTML for badge
 */
function renderStreamBadge(streamType) {
    const type = streamType || 'vod';
    const labels = {
        live: 'LIVE',
        vod: 'VIDEO',
        audio: 'AUDIO'
    };
    return `<span class="preview-badge ${type}">${labels[type] || type.toUpperCase()}</span>`;
}

/**
 * Format duration in milliseconds to readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
function formatDuration(ms) {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Clear the preview panel
 */
function clearPreview() {
    $('previewResults').innerHTML = `
        <div class="preview-empty">
            <div class="preview-empty-icon">🔍</div>
            <div>Click "Load Preview" to see what content your query will return</div>
        </div>
    `;
}

/**
 * Set up preview button handler
 */
function setupPreviewButton() {
    $('previewBtn').addEventListener('click', loadPreview);
}
