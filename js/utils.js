/**
 * SVP Content Builder - Utilities
 * Helper functions for common operations
 */

/**
 * Shorthand for getElementById
 */
const $ = (id) => document.getElementById(id);

/**
 * Shorthand for querySelectorAll
 */
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type: '' | 'success' | 'error'
 */
function showToast(message, type = '') {
    const toast = $('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Copy text to clipboard and update button state
 * @param {string} type - Type of content to copy: 'connected' | 'url' | 'liquid'
 * @param {HTMLElement} btn - The button element to update
 */
function copyToClipboard(type, btn) {
    let text = '';
    
    switch (type) {
        case 'connected':
            text = $('connectedOutput').textContent;
            break;
        case 'url':
            text = $('urlOutput').textContent;
            break;
        case 'liquid':
            text = $('liquidOutput').textContent;
            break;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('success');
        btn.textContent = '✓ Copied!';
        
        setTimeout(() => {
            btn.classList.remove('success');
            btn.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy to clipboard', 'error');
    });
}

/**
 * Get Unix timestamp for various time references
 * @param {string} timeRef - Time reference: 'now', 'endOfDay', etc.
 * @returns {number} Unix timestamp in seconds
 */
function getTimestamp(timeRef) {
    const now = Math.floor(Date.now() / 1000);
    const day = 86400; // seconds in a day
    
    switch (timeRef) {
        case 'now':
            return now;
        case 'endOfDay': {
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            return Math.floor(endOfDay.getTime() / 1000);
        }
        case '3h':
            return now + 3 * 3600;
        case '24h':
            return now + day;
        case '-24h':
            return now - day;
        case 'week':
            return now + 7 * day;
        case '-week':
            return now - 7 * day;
        case 'month':
            return now + 30 * day;
        case '-month':
            return now - 30 * day;
        default:
            return now;
    }
}

/**
 * Format a Unix timestamp for display
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Debounce function to limit rate of execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
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
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
function truncate(text, length = 100) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
}
