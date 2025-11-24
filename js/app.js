/**
 * SVP Content Builder - Main Application
 * Initialization and event binding
 */

/**
 * Initialize the application
 */
function init() {
    console.log('🚀 SVP Content Builder initializing...');
    
    // Render initial UI
    renderProviderDropdown();
    renderNavigation();
    renderContentType();
    renderTemplates();
    
    // Set up event handlers
    setupEventListeners();
    
    // Initial output update
    updateOutputs();
    
    console.log('✅ SVP Content Builder ready!');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Provider selection
    $('providerSelect').addEventListener('change', handleProviderChange);
    
    // Filter reset button
    $('filterReset').addEventListener('click', handleFilterReset);
    
    // Variable name input
    $('variableName').addEventListener('input', debounce(handleVariableNameChange, 300));
    
    // Output tabs
    setupOutputTabs();
    
    // Copy buttons
    setupCopyButtons();
    
    // Preview button
    setupPreviewButton();
}

/**
 * Handle provider selection change
 * @param {Event} e - Change event
 */
function handleProviderChange(e) {
    const providerId = e.target.value;
    
    AppState.setProvider(providerId);
    
    // Load dynamic options for current content type
    loadDynamicOptions();
    
    // Update suggested variable name
    if (providerId) {
        $('variableName').value = generateVariableName();
    }
    
    // Update outputs
    updateOutputs();
    
    // Clear preview since data will be different
    clearPreview();
    
    console.log(`📡 Provider changed to: ${providerId || 'none'}`);
}

/**
 * Handle filter reset click
 */
function handleFilterReset() {
    AppState.resetFilters();
    renderContentType();
    updateOutputs();
    clearPreview();
    
    console.log('🔄 Filters reset');
}

/**
 * Handle variable name change
 */
function handleVariableNameChange() {
    updateOutputs();
}

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + C when no text is selected - copy connected content
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selection = window.getSelection().toString();
        if (!selection) {
            const connectedContent = $('connectedOutput').textContent;
            if (connectedContent && !connectedContent.startsWith('Select')) {
                navigator.clipboard.writeText(connectedContent);
                showToast('Connected content copied!', 'success');
                e.preventDefault();
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Set up keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);
