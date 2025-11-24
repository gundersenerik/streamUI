/**
 * SVP Content Builder - Utilities
 * Helper functions used across the application
 */

const Utils = {
    /**
     * Debounce function to limit rapid calls
     */
    debounce(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    },
    
    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Update button state
            const originalContent = button.innerHTML;
            button.classList.add('success');
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
            `;
            
            UI.showToast('Copied to clipboard!');
            
            // Reset button after delay
            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = originalContent;
            }, 2000);
            
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            UI.showToast('Failed to copy', 'error');
            return false;
        }
    },
    
    /**
     * Get date string with offset
     */
    getDateString(daysOffset = 0) {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split('T')[0];
    },
    
    /**
     * Convert date to Unix timestamp
     */
    dateToTimestamp(dateString) {
        return Math.floor(new Date(dateString).getTime() / 1000);
    },
    
    /**
     * Format timestamp to readable date
     */
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Escape HTML entities
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Generate a simple unique ID
     */
    generateId() {
        return Math.random().toString(36).substring(2, 9);
    },
    
    /**
     * Check if value is empty
     */
    isEmpty(value) {
        return value === null || value === undefined || value === '';
    },
    
    /**
     * Truncate text with ellipsis
     */
    truncate(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
};
