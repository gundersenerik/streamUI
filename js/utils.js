// Utility Functions

/**
 * Copy text to clipboard with button visual feedback
 */
function copyToClipboard(text, buttonElement = null) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✨ Copied to clipboard!');

        // Add success state to button if provided
        if (buttonElement) {
            const originalText = buttonElement.textContent;
            buttonElement.classList.add('success');
            buttonElement.textContent = '✓ COPIED!';

            setTimeout(() => {
                buttonElement.classList.remove('success');
                buttonElement.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('❌ Failed to copy', 'error');
    });
}

/**
 * Show notification toast with modern gradient styling
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;

    // Apply gradient based on type
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        notification.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.4)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        notification.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
    }

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
