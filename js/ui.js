/**
 * SVP Content Builder - UI Module
 * Handles all DOM rendering and updates
 */

/**
 * Render the navigation sidebar
 */
function renderNavigation() {
    const navSection = $('navSection');
    
    navSection.innerHTML = Object.values(CONTENT_TYPES).map(type => `
        <div class="nav-item ${type.id === AppState.contentType ? 'active' : ''}" data-type="${type.id}">
            <span class="nav-icon">${type.icon}</span>
            ${type.title}
        </div>
    `).join('');
    
    // Add click handlers
    navSection.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navSection.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            AppState.setContentType(item.dataset.type);
            renderContentType();
            loadDynamicOptions();
            updateOutputs();
            clearPreview();
        });
    });
}

/**
 * Render the provider dropdown options
 */
function renderProviderDropdown() {
    const select = $('providerSelect');
    
    select.innerHTML = '<option value="">— Select Provider First —</option>' +
        Object.values(PROVIDERS).map(p => 
            `<option value="${p.id}">${p.name}</option>`
        ).join('');
}

/**
 * Render the content type section (title, discovery, filters)
 */
function renderContentType() {
    const config = AppState.getContentTypeConfig();
    
    // Update header
    $('mainTitle').textContent = config.title;
    $('mainSubtitle').textContent = config.subtitle;
    
    // Render discovery cards
    renderDiscoveryCards(config);
    
    // Render filters
    renderFilters(config);
    
    // Render quick filters
    renderQuickFilters(config);
}

/**
 * Render discovery cards
 * @param {Object} config - Content type configuration
 */
function renderDiscoveryCards(config) {
    const grid = $('discoveryGrid');
    
    grid.innerHTML = config.discovery.map(d => `
        <div class="discovery-card ${AppState.discovery === d.id ? 'active' : ''}" data-discovery="${d.id}">
            <div class="discovery-icon">${d.icon}</div>
            <div class="discovery-title">${d.title}</div>
            <div class="discovery-desc">${d.desc}</div>
        </div>
    `).join('');
    
    // Add click handlers
    grid.querySelectorAll('.discovery-card').forEach(card => {
        card.addEventListener('click', () => {
            AppState.applyDiscoveryPreset(card.dataset.discovery);
            renderContentType();
            updateOutputs();
        });
    });
}

/**
 * Render filter inputs
 * @param {Object} config - Content type configuration
 */
function renderFilters(config) {
    const grid = $('filterGrid');
    
    grid.innerHTML = config.filters.map(filter => {
        let input = '';
        
        if (filter.type === 'select') {
            const options = filter.options || [{ value: '', label: 'Loading...' }];
            const selectedValue = AppState.filters[filter.id] || '';
            
            input = `
                <select class="filter-select" data-filter="${filter.id}">
                    ${options.map(o => `
                        <option value="${o.value}" ${selectedValue === o.value ? 'selected' : ''}>
                            ${o.label}
                        </option>
                    `).join('')}
                </select>
            `;
        } else if (filter.type === 'number') {
            const value = AppState.filters[filter.id] || filter.default || '';
            input = `
                <input type="number" 
                    class="filter-input" 
                    data-filter="${filter.id}"
                    value="${value}"
                    min="${filter.min || 1}"
                    max="${filter.max || 100}">
            `;
        } else if (filter.type === 'date') {
            const value = AppState.filters[filter.id] || '';
            input = `
                <input type="date" 
                    class="filter-input" 
                    data-filter="${filter.id}"
                    value="${value}">
            `;
        }
        
        return `
            <div class="filter-group">
                <label class="filter-label">${filter.label}</label>
                ${input}
            </div>
        `;
    }).join('');
    
    // Add change handlers
    grid.querySelectorAll('.filter-select, .filter-input').forEach(el => {
        el.addEventListener('change', (e) => {
            AppState.setFilter(e.target.dataset.filter, e.target.value);
            updateOutputs();
        });
    });
}

/**
 * Render quick filter buttons
 * @param {Object} config - Content type configuration
 */
function renderQuickFilters(config) {
    const container = $('quickFilters');
    
    if (!config.quickFilters || config.quickFilters.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = config.quickFilters.map(q => 
        `<button class="quick-btn" data-quick="${q}">${q}</button>`
    ).join('');
    
    // Add click handlers
    container.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            
            const preset = QUICK_FILTER_MAP[btn.dataset.quick];
            if (!preset) return;
            
            if (btn.classList.contains('active')) {
                Object.assign(AppState.filters, preset);
            } else {
                Object.keys(preset).forEach(k => delete AppState.filters[k]);
            }
            
            updateOutputs();
        });
    });
}

/**
 * Render the template list
 */
function renderTemplates() {
    const list = $('templateList');
    
    list.innerHTML = TEMPLATES.map(t => `
        <div class="template-item ${AppState.selectedTemplate === t.id ? 'active' : ''}" data-template="${t.id}">
            <div class="template-name">${t.name}</div>
            <div class="template-desc">${t.desc}</div>
        </div>
    `).join('');
    
    // Add click handlers
    list.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', () => {
            list.querySelectorAll('.template-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            AppState.selectedTemplate = item.dataset.template;
            updateLiquidOutput();
        });
    });
}

/**
 * Set up output tab switching
 */
function setupOutputTabs() {
    $$('.output-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update tab states
            $$('.output-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update section visibility
            $$('.output-section').forEach(s => s.classList.remove('active'));
            $(tab.dataset.tab + 'Tab').classList.add('active');
        });
    });
}

/**
 * Set up copy buttons
 */
function setupCopyButtons() {
    $$('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            copyToClipboard(btn.dataset.copy, btn);
        });
    });
}
