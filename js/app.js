// Main App Controller

class BrazeContentBuilder {
    constructor() {
        this.state = {
            provider: null,
            contentType: null,
            variableName: '',
            filterBuilder: null,
            urlGenerator: null
        };
        
        this.init();
    }
    
    /**
     * Initialize the app
     */
    async init() {
        console.log('Initializing Braze Content Builder...');
        
        // Populate providers
        await populateProviderDropdown();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render content type cards (hidden until provider selected)
        renderContentTypeCards();
        
        console.log('App initialized');
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Provider selection
        document.getElementById('provider-select').addEventListener('change', (e) => {
            this.selectProvider(e.target.value);
        });
        
        // Variable name input
        document.getElementById('variable-name').addEventListener('input', debounce((e) => {
            this.state.variableName = e.target.value;
            this.generateOutput();
        }, 300));
        
        // Copy buttons
        document.getElementById('copy-cc-btn').addEventListener('click', (e) => {
            const code = document.getElementById('connected-content-output').textContent;
            copyToClipboard(code, e.target);
        });

        document.getElementById('copy-liquid-btn').addEventListener('click', (e) => {
            const code = document.getElementById('liquid-output').textContent;
            copyToClipboard(code, e.target);
        });
        
        // Template tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTemplateTab(e.target.dataset.tab);
            });
        });
    }
    
    /**
     * Select provider
     */
    selectProvider(providerId) {
        if (!providerId) return;
        
        this.state.provider = providerId;
        console.log('Provider selected:', providerId);
        
        // Show content type section
        toggleSection('step-content-type', true);
        
        // Scroll to content type section
        document.getElementById('step-content-type').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * Select content type
     */
    async selectContentType(contentTypeId) {
        this.state.contentType = contentTypeId;
        console.log('Content type selected:', contentTypeId);
        
        // Auto-generate variable name
        const autoVarName = generateVariableName(this.state.provider, contentTypeId);
        this.state.variableName = autoVarName;
        document.getElementById('variable-name').value = autoVarName;
        
        // Show filter section
        toggleSection('step-filters', true);
        
        // Create and render filter builder
        this.state.filterBuilder = new FilterBuilder(this.state.provider, contentTypeId);
        await this.state.filterBuilder.render();
        
        // Show connected content section
        toggleSection('step-connected-content', true);
        
        // Show liquid template section
        toggleSection('step-liquid-templates', true);
        
        // Render template lists
        this.renderTemplateLists();
        
        // Generate initial output
        this.generateOutput();
        
        // Scroll to filters
        document.getElementById('step-filters').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * Generate all outputs
     */
    generateOutput() {
        if (!this.state.provider || !this.state.contentType || !this.state.filterBuilder) {
            return;
        }
        
        // Get filter values
        const filterValues = this.state.filterBuilder.getFilterValues();
        
        // Create URL generator
        this.state.urlGenerator = new URLGenerator(
            this.state.provider,
            this.state.contentType,
            filterValues
        );
        
        // Generate connected content code
        const variableName = this.state.variableName || 'myContent';
        const connectedContent = this.state.urlGenerator.generateConnectedContent(variableName);
        
        // Update display
        document.getElementById('connected-content-output').textContent = connectedContent;
        
        // Update API URL display
        document.getElementById('api-url-display').textContent = this.state.urlGenerator.getReadableURL();
        
        // Update liquid templates with new variable name
        this.updateTemplateLists();
    }
    
    /**
     * Render template lists
     */
    renderTemplateLists() {
        const varName = this.state.variableName || 'myContent';
        
        renderTemplateList('single', 'single-templates-list', varName);
        renderTemplateList('loop', 'loop-templates-list', varName);
        renderTemplateList('conditional', 'conditional-templates-list', varName);
        
        // Setup custom fields
        this.setupCustomFields();
    }
    
    /**
     * Update template lists with new variable name
     */
    updateTemplateLists() {
        this.renderTemplateLists();
    }
    
    /**
     * Switch template tab
     */
    switchTemplateTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.template-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `template-${tabName}`);
        });
        
        // Clear liquid output
        document.getElementById('liquid-output').textContent = '<!-- Select a template to see the code -->';
    }
    
    /**
     * Setup custom fields builder
     */
    setupCustomFields() {
        const container = document.getElementById('custom-fields-list');
        container.innerHTML = '';
        
        const fields = [
            { path: 'title', label: 'Title' },
            { path: 'description', label: 'Description' },
            { path: 'images.main', label: 'Main Image' },
            { path: 'flightTimes.start', label: 'Start Time' },
            { path: 'flightTimes.end', label: 'End Time' },
            { path: 'additional.access', label: 'Access Level' },
            { path: 'additional.metadata.sportType.value', label: 'Sport Type' },
            { path: 'streamType', label: 'Stream Type' },
            { path: 'published', label: 'Published Date' }
        ];
        
        fields.forEach(field => {
            const item = document.createElement('div');
            item.className = 'field-checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `field-${field.path}`;
            checkbox.dataset.path = field.path;
            checkbox.dataset.label = field.label;
            
            const label = document.createElement('label');
            label.setAttribute('for', `field-${field.path}`);
            label.textContent = field.label;
            
            item.appendChild(checkbox);
            item.appendChild(label);
            container.appendChild(item);
            
            checkbox.addEventListener('change', () => {
                this.updateCustomFieldsTemplate();
            });
        });
    }
    
    /**
     * Update custom fields template
     */
    updateCustomFieldsTemplate() {
        const selectedFields = [];
        document.querySelectorAll('#custom-fields-list input[type="checkbox"]:checked').forEach(checkbox => {
            selectedFields.push({
                path: checkbox.dataset.path,
                label: checkbox.dataset.label
            });
        });
        
        const varName = this.state.variableName || 'myContent';
        const template = generateCustomFieldsTemplate(varName, selectedFields);
        document.getElementById('liquid-output').textContent = template;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BrazeContentBuilder();
});
