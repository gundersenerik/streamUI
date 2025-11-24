/**
 * SVP Content Builder - UI Module
 * Handles all DOM rendering and updates
 */

const UI = {
    // DOM element references
    elements: null,

    // Debounced preview loader
    _debouncedPreviewLoader: null,
    
    /**
     * Initialize DOM element references
     */
    init() {
        this.elements = {
            providerSelect: document.getElementById('providerSelect'),
            providerSelector: document.querySelector('.provider-selector-prominent'),
            providerHint: document.getElementById('providerHint'),
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
            toast: document.getElementById('toast'),
            // Preview elements
            previewSection: document.getElementById('previewSection'),
            previewList: document.getElementById('previewList'),
            previewCount: document.getElementById('previewCount'),
            previewProvider: document.getElementById('previewProvider'),
            refreshPreview: document.getElementById('refreshPreview')
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
                this.queuePreviewRefresh();
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
            this.queuePreviewRefresh();
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
            this.queuePreviewRefresh();
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
            this.queuePreviewRefresh();
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
        this.queuePreviewRefresh();
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
                this.queuePreviewRefresh();
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
    },

    /**
     * Update provider selector visual state
     */
    updateProviderState() {
        if (!this.elements.providerSelector) return;

        if (AppState.provider) {
            this.elements.providerSelector.classList.add('has-value');
            this.elements.providerHint.textContent = `Connected to ${AppState.provider.name}`;
        } else {
            this.elements.providerSelector.classList.remove('has-value');
            this.elements.providerHint.textContent = 'Required to generate API calls';
        }
    },

    /**
     * Update preview info bar
     */
    updatePreviewInfo(count = 0) {
        if (!this.elements.previewCount) return;

        this.elements.previewCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
        this.elements.previewProvider.textContent = AppState.provider
            ? `Provider: ${AppState.provider.name}`
            : 'No provider selected';
    },

    /**
     * Queue a debounced preview refresh (500ms delay)
     */
    queuePreviewRefresh() {
        if (this._debouncedPreviewLoader) {
            clearTimeout(this._debouncedPreviewLoader);
        }
        this._debouncedPreviewLoader = setTimeout(() => {
            this.loadPreview();
        }, 500);
    },

    /**
     * Load and render content preview
     */
    async loadPreview() {
        if (!AppState.provider) {
            this.renderEmptyPreview('Select a provider to preview content');
            this.updatePreviewInfo(0);
            return;
        }

        // Show loading state
        this.elements.previewList.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Loading preview...
            </div>
        `;
        this.elements.refreshPreview.classList.add('loading');
        this.elements.refreshPreview.disabled = true;

        try {
            const data = await API.fetchPreview();
            this.renderPreviewList(data);
        } catch (error) {
            console.error('Error loading preview:', error);
            this.renderEmptyPreview('Error loading preview');
        } finally {
            this.elements.refreshPreview.classList.remove('loading');
            this.elements.refreshPreview.disabled = false;
        }
    },

    /**
     * Render empty preview state
     */
    renderEmptyPreview(message) {
        this.elements.previewList.innerHTML = `
            <div class="preview-empty">
                <div class="preview-empty-icon">📋</div>
                <div class="preview-empty-text">${message}</div>
            </div>
        `;
    },

    /**
     * Render preview list with assets
     */
    renderPreviewList(data) {
        const assets = data?._embedded?.assets || [];

        if (assets.length === 0) {
            this.renderEmptyPreview('No content found with current filters');
            this.updatePreviewInfo(0);
            return;
        }

        this.updatePreviewInfo(assets.length);
        this.elements.previewList.innerHTML = '';

        assets.forEach((asset, index) => {
            const item = document.createElement('div');
            item.className = 'preview-item';

            // Determine badges
            const badges = [];
            if (asset.streamType === 'live') {
                badges.push('<span class="preview-item-badge live">Live</span>');
            } else if (asset.streamType === 'vod') {
                badges.push('<span class="preview-item-badge vod">VOD</span>');
            }
            if (asset.additional?.access === 'free') {
                badges.push('<span class="preview-item-badge free">Free</span>');
            }

            // Format date/time
            let timeInfo = '';
            if (asset.flightTimes?.start) {
                const date = new Date(asset.flightTimes.start * 1000);
                timeInfo = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else if (asset.published) {
                const date = new Date(asset.published * 1000);
                timeInfo = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }

            // Get thumbnail
            const thumbUrl = asset.images?.main
                ? `${asset.images.main}?t[]=160q60`
                : '';

            item.innerHTML = `
                <div class="preview-item-thumb">
                    ${thumbUrl ? `<img src="${thumbUrl}" alt="" loading="lazy">` : '📺'}
                </div>
                <div class="preview-item-content">
                    <div class="preview-item-title" title="${Utils.escapeHtml(asset.title)}">${index + 1}. ${Utils.escapeHtml(asset.title)}</div>
                    <div class="preview-item-meta">
                        ${badges.join('')}
                        <span>${asset.category?.title || 'No category'}</span>
                        ${timeInfo ? `<span>${timeInfo}</span>` : ''}
                    </div>
                </div>
            `;

            this.elements.previewList.appendChild(item);
        });
    }
};
