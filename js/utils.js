// Utility Functions

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy', 'error');
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#ef4444' : '#10b981';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Encode filter value for URL
 */
function encodeFilterValue(value) {
    return encodeURIComponent(value);
}

/**
 * Format date to Unix timestamp
 */
function dateToTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

/**
 * Format date to readable string
 */
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Debounce function for input handlers
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generate auto variable name based on provider and content type
 */
function generateVariableName(provider, contentType) {
    const providerMap = {
        'vgtv': 'VG',
        'ab': 'AB',
        'aftonbladet': 'AB',
        'aftenbladet': 'AFT',
        'bt': 'BT'
    };
    
    const contentTypeMap = {
        'allLive': 'live',
        'liveSports': 'sports',
        'podcasts': 'podcasts',
        'vodSports': 'sportsvod',
        'general': 'content'
    };
    
    const providerPrefix = providerMap[provider] || provider.toUpperCase();
    const contentSuffix = contentTypeMap[contentType] || contentType;
    
    return `${providerPrefix}${contentSuffix}`;
}

/**
 * Show/hide section
 */
function toggleSection(sectionId, show = true) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = show ? 'block' : 'none';
    }
}

/**
 * Clear element content
 */
function clearElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}
