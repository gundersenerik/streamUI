/**
 * SVP Content Builder - UI Module
 * Handles all DOM rendering and updates
 */

const UI = {
    // DOM element references
    elements: null,
    
    /**
     * Initialize DOM element references
     */
    init() {
        this.elements = {
            providerSelect: document.getElementById('providerSelect'),
            mainTitle: document.getElementById('mainTitle'),
            mainSubtitle: document.getElementById('mainSubtitle'),
            discoveryGrid: document.getElementById('discoveryGrid'),
            filterGrid: document.getElementById('filterGrid'),
            filterSection: document.getElementById('filterSection'),
            quickActions: document.getElementById('quickActions'),
            podcastBrowser: document.getElementById('podcastBrowser'),
            podcastGrid: document.getElementById('podcastGrid'),
            variableName: document.getElementById('variableName'),
            connectedOutput: document.getElementById('connectedOutput'),
            urlOutput: document.getElementById('urlOutput'),
            liquidOutput: document.getElementById('liquidOutput'),
            templateList: document.getElementById('templateList'),
            toast: document.getElementById('toast')
        };
    },
    
    /**
     * Populate provider dropdown
     */
    populateProviders() {
        Object.values(PROVIDERS).forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.id;
            option.textContent = provider.name;
            this.elements.providerSelect.appendChild(option);
        });
    },
    
    /**
     * Render the current content type view
     */
    renderContentType() {
        const config = AppState.getContentTypeConfig();
        
        // Update header
        this.elements.mainTitle.textContent = config.title;
        this.elements.mainSubtitle.textContent = config.subtitle;
        
        // Render sections
        this.renderDiscovery(config);
        this.renderFilters(config);
        this.renderQuickActions(config);
        this.renderTemplates();
        
        // Handle podcast browser visibility
        if (AppState.contentType === 'podcasts') {
            this.elements.podcastBrowser.classList.remove('hidden');
            if (AppState.provider) {
                this.loadPodcasts();
            }
        } else {
            this.elements.podcastBrowser.classList.add('hidden');
        }
        
        // Update variable name
        this.updateVariableName();
        
        // Generate output
        Generator.generateOutput();
    },
    
    /**
     * Render discovery cards
     */
    renderDiscovery(config) {
        this.elements.discoveryGrid.innerHTML = '';
        
        config.discovery.forEach(item => {
            const card = document.createElement('div');
            card.className = 'discovery-card' + (AppState.discovery === item.id ? ' active' : '');
            card.innerHTML = `
                <div class="discovery-icon">${config.icon}</div>
                <div class="discovery-title">${item.title}</div>
                <div class="discovery-desc">${item.desc}</div>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('.discovery-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                AppState.discovery = item.id;
                Generator.generateOutput();
            });
            
            this.elements.discoveryGrid.appendChild(card);
        });
    },
    
    /**
     * Render filter controls
     */
    renderFilters(config) {
        this.elements.filterGrid.innerHTML = '';
        
        config.filters.forEach(filter => {
            const group = document.createElement('div');
            group.className = 'filter-group';
            
            const label = document.createElement('label');
            label.className = 'filter-label';
            label.textContent = filter.label;
            group.appendChild(label);
            
            let input;
            
            if (filter.type === 'select') {
                input = this.createSelect(filter);
            } else if (filter.type === 'number') {
                input = this.createNumberInput(filter);
            } else if (filter.type === 'date') {
                input = this.createDateInput(filter);
            }
            
            if (input) {
                group.appendChild(input);
                this.elements.filterGrid.appendChild(group);
            }
        });
    },
    
    /**
     * Create a select dropdown
     */
    createSelect(filter) {
        const select = document.createElement('select');
        select.className = 'filter-select';
        select.id = `filter-${filter.id}`;
        
        if (filter.dynamic) {
            select.innerHTML = '<option value="">Loading...</option>';
            this.loadDynamicOptions(filter, select);
        } else {
            filter.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                if (opt.value === filter.default) option.selected = true;
                select.appendChild(option);
            });
        }
        
        select.addEventListener('change', (e) => {
            AppState.setFilter(filter.id, e.target.value);
            Generator.generateOutput();
        });
        
        return select;
    },
    
    /**
     * Create a number input
     */
    createNumberInput(filter) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'filter-input';
        input.id = `filter-${filter.id}`;
        input.value = filter.default || 10;
        input.min = filter.min || 1;
        input.max = filter.max || 100;
        
        // Set initial state
        AppState.setFilter(filter.id, input.value);
        
        input.addEventListener('input', Utils.debounce((e) => {
            AppState.setFilter(filter.id, e.target.value);
            Generator.generateOutput();
        }, 300));
        
        return input;
    },
    
    /**
     * Create a date input
     */
    createDateInput(filter) {
        const input = document.createElement('input');
        input.type = 'date';
        input.className = 'filter-input';
        input.id = `filter-${filter.id}`;
        
        input.addEventListener('change', (e) => {
            AppState.setFilter(filter.id, e.target.value);
            Generator.generateOutput();
        });
        
        return input;
    },
    
    /**
     * Load dynamic options for a select
     */
    async loadDynamicOptions(filter, selectEl) {
        if (!AppState.provider) {
            selectEl.innerHTML = '<option value="">Select provider first</option>';
            return;
        }
        
        try {
            const options = await API.loadDynamicOptions(filter.id);
            
            selectEl.innerHTML = '<option value="">All</option>';
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                selectEl.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading options:', error);
            selectEl.innerHTML = '<option value="">Error loading</option>';
        }
    },
    
    /**
     * Render quick action buttons
     */
    renderQuickActions(config) {
        this.elements.quickActions.innerHTML = '';
        
        if (!config.quickFilters) return;
        
        config.quickFilters.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'quick-btn';
            btn.textContent = label;
            
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.handleQuickFilter(label, btn.classList.contains('active'));
            });
            
            this.elements.quickActions.appendChild(btn);
        });
    },
    
    /**
     * Handle quick filter toggle
     */
    handleQuickFilter(label, active) {
        if (label === 'Free Only') {
            AppState.setFilter('access', active ? 'free' : null);
        } else if (['Football', 'Hockey', 'Handball', 'Basketball'].includes(label)) {
            AppState.setFilter('sportType', active ? label.toLowerCase() : null);
        } else if (label === 'Last 24 Hours') {
            AppState.setFilter('dateStart', active ? Utils.getDateString(-1) : null);
        } else if (label === 'Last Week') {
            AppState.setFilter('dateStart', active ? Utils.getDateString(-7) : null);
        } else if (label === 'Last Month') {
            AppState.setFilter('dateStart', active ? Utils.getDateString(-30) : null);
        }
        
        Generator.generateOutput();
    },
    
    /**
     * Render template list
     */
    renderTemplates() {
        this.elements.templateList.innerHTML = '';
        
        TEMPLATES.forEach(template => {
            const item = document.createElement('div');
            item.className = 'template-item' + (AppState.selectedTemplate === template.id ? ' active' : '');
            item.innerHTML = `
                <div class="template-name">${template.name}</div>
                <div class="template-desc">${template.desc}</div>
            `;
            
            item.addEventListener('click', () => {
                document.querySelectorAll('.template-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                AppState.selectedTemplate = template.id;
                Generator.generateOutput();
            });
            
            this.elements.templateList.appendChild(item);
        });
    },
    
    /**
     * Load and render podcasts
     */
    async loadPodcasts() {
        this.elements.podcastGrid.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Loading podcasts...
            </div>
        `;
        
        try {
            const podcasts = await API.fetchCategories();
            this.renderPodcastGrid(podcasts);
        } catch (error) {
            this.elements.podcastGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <div class="empty-title">Unable to load podcasts</div>
                </div>
            `;
        }
    },
    
    /**
     * Render podcast grid
     */
    renderPodcastGrid(podcasts) {
        if (!podcasts || podcasts.length === 0) {
            this.elements.podcastGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎧</div>
                    <div class="empty-title">No podcasts found</div>
                </div>
            `;
            return;
        }
        
        this.elements.podcastGrid.innerHTML = '';
        
        podcasts.forEach(podcast => {
            const card = document.createElement('div');
            card.className = 'podcast-card' + (AppState.filters.category === podcast.id ? ' active' : '');
            card.innerHTML = `
                <div class="podcast-thumb">🎙️</div>
                <div class="podcast-name">${podcast.label}</div>
                <div class="podcast-count">ID: ${podcast.id}</div>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('.podcast-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                AppState.setFilter('category', podcast.id);
                Generator.generateOutput();
            });
            
            this.elements.podcastGrid.appendChild(card);
        });
    },
    
    /**
     * Update variable name based on selections
     */
    updateVariableName() {
        if (!AppState.provider) return;
        
        const prefix = AppState.provider.id.replace('tv', '').toUpperCase();
        const suffix = AppState.contentType.charAt(0).toUpperCase() + AppState.contentType.slice(1);
        this.elements.variableName.value = prefix + suffix;
    },
    
    /**
     * Update output displays
     */
    updateOutputs(connected, url, liquid) {
        this.elements.connectedOutput.textContent = connected;
        this.elements.urlOutput.textContent = url;
        this.elements.liquidOutput.textContent = liquid;
    },
    
    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        this.elements.toast.textContent = message;
        this.elements.toast.className = 'toast show ' + type;
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 2000);
    }
};
