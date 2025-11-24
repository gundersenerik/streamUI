/**
 * SVP Content Builder - Main Application
 * Initialization and event binding
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 Initializing SVP Content Builder...');
        
        // Initialize UI references
        UI.init();
        
        // Populate providers
        UI.populateProviders();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial state
        UI.renderContentType();
        
        console.log('✅ App initialized');
    },
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Provider selection
        UI.elements.providerSelect.addEventListener('change', (e) => {
            AppState.setProvider(e.target.value);
            UI.updateVariableName();
            Generator.generateOutput();
            
            // Load podcasts if on podcast view
            if (AppState.contentType === 'podcasts' && AppState.provider) {
                UI.loadPodcasts();
            }
        });
        
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                AppState.setContentType(item.dataset.type);
                UI.renderContentType();
            });
        });
        
        // Output tabs
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.output-section').forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
            });
        });
        
        // Variable name input
        UI.elements.variableName.addEventListener('input', Utils.debounce(() => {
            Generator.generateOutput();
        }, 300));
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.copy;
                let text = '';
                
                switch (type) {
                    case 'connected':
                        text = UI.elements.connectedOutput.textContent;
                        break;
                    case 'url':
                        text = UI.elements.urlOutput.textContent;
                        break;
                    case 'liquid':
                        text = UI.elements.liquidOutput.textContent;
                        break;
                }
                
                Utils.copyToClipboard(text, btn);
            });
        });
        
        // Filter reset
        document.getElementById('filterReset').addEventListener('click', () => {
            AppState.resetFilters();
            UI.renderContentType();
        });
        
        // Clear podcast selection
        document.getElementById('clearPodcast').addEventListener('click', () => {
            AppState.setFilter('category', null);
            document.querySelectorAll('.podcast-card').forEach(c => c.classList.remove('active'));
            Generator.generateOutput();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + C on code blocks
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                const selection = window.getSelection().toString();
                if (!selection) {
                    // If no selection, copy connected content
                    e.preventDefault();
                    Utils.copyToClipboard(
                        UI.elements.connectedOutput.textContent,
                        document.querySelector('[data-copy="connected"]')
                    );
                }
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
