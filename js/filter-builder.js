// Filter Builder - Handles dynamic filter rendering and API data fetching

class FilterBuilder {
    constructor(provider, contentType) {
        this.provider = provider;
        this.contentType = contentType;
        this.filterValues = {};
        this.container = document.getElementById('filters-container');
    }
    
    /**
     * Render all filters for the selected content type
     */
    async render() {
        this.container.innerHTML = '';
        const contentTypeConfig = getContentType(this.contentType);
        
        if (!contentTypeConfig) return;
        
        for (const filter of contentTypeConfig.filters) {
            const filterElement = await this.createFilterElement(filter);
            this.container.appendChild(filterElement);
        }
    }
    
    /**
     * Create a single filter element
     */
    async createFilterElement(filter) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', `filter-${filter.id}`);
        label.textContent = filter.label;
        if (filter.required) {
            label.innerHTML += ' <span style="color: #ef4444;">*</span>';
        }
        wrapper.appendChild(label);
        
        let input;
        
        switch (filter.type) {
            case 'dropdown':
                input = await this.createDropdown(filter);
                break;
            case 'multiselect':
                input = await this.createMultiSelect(filter);
                break;
            case 'number':
                input = this.createNumberInput(filter);
                break;
            case 'date':
                input = this.createDateInput(filter);
                break;
            case 'datetime':
                input = this.createDateTimeInput(filter);
                break;
            case 'text':
                input = this.createTextInput(filter);
                break;
            default:
                input = this.createTextInput(filter);
        }
        
        wrapper.appendChild(input);
        return wrapper;
    }
    
    /**
     * Create dropdown with optional dynamic fetching
     */
    async createDropdown(filter) {
        const select = document.createElement('select');
        select.id = `filter-${filter.id}`;
        select.className = 'form-control';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select --';
        select.appendChild(emptyOption);
        
        let options = [];
        
        // Fetch options dynamically if needed
        if (filter.fetchOptions) {
            try {
                options = await this.fetchFilterOptions(filter);
            } catch (error) {
                console.error(`Failed to fetch options for ${filter.id}:`, error);
            }
        } else if (filter.options) {
            options = filter.options;
        }
        
        // Add options to select
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.label || option.value;
            select.appendChild(optElement);
        });
        
        // Set default value
        if (filter.default) {
            select.value = filter.default;
            this.filterValues[filter.id] = filter.default;
        }
        
        // Listen for changes
        select.addEventListener('change', (e) => {
            this.filterValues[filter.id] = e.target.value;
            this.updateOutput();
        });
        
        return select;
    }
    
    /**
     * Create multi-select (using multiple select or custom)
     */
    async createMultiSelect(filter) {
        const select = document.createElement('select');
        select.id = `filter-${filter.id}`;
        select.className = 'form-control';
        select.multiple = true;
        select.size = 5;
        
        let options = [];
        
        // Fetch options dynamically
        if (filter.fetchOptions) {
            try {
                options = await this.fetchFilterOptions(filter);
            } catch (error) {
                console.error(`Failed to fetch options for ${filter.id}:`, error);
            }
        } else if (filter.options) {
            options = filter.options;
        }
        
        // Add options
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.label || option.value;
            select.appendChild(optElement);
        });
        
        // Listen for changes
        select.addEventListener('change', (e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            this.filterValues[filter.id] = selected;
            this.updateOutput();
        });
        
        return select;
    }
    
    /**
     * Create number input
     */
    createNumberInput(filter) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `filter-${filter.id}`;
        input.className = 'form-control';
        input.min = filter.min || 1;
        input.max = filter.max || 100;
        input.value = filter.default || '';
        
        if (filter.default) {
            this.filterValues[filter.id] = filter.default;
        }
        
        input.addEventListener('input', debounce((e) => {
            this.filterValues[filter.id] = e.target.value;
            this.updateOutput();
        }, 500));
        
        return input;
    }
    
    /**
     * Create date input
     */
    createDateInput(filter) {
        const input = document.createElement('input');
        input.type = 'date';
        input.id = `filter-${filter.id}`;
        input.className = 'form-control';
        
        input.addEventListener('change', (e) => {
            this.filterValues[filter.id] = e.target.value;
            this.updateOutput();
        });
        
        return input;
    }
    
    /**
     * Create datetime input
     */
    createDateTimeInput(filter) {
        const input = document.createElement('input');
        input.type = 'datetime-local';
        input.id = `filter-${filter.id}`;
        input.className = 'form-control';
        
        input.addEventListener('change', (e) => {
            this.filterValues[filter.id] = e.target.value;
            this.updateOutput();
        });
        
        return input;
    }
    
    /**
     * Create text input
     */
    createTextInput(filter) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `filter-${filter.id}`;
        input.className = 'form-control';
        input.placeholder = filter.placeholder || '';
        
        input.addEventListener('input', debounce((e) => {
            this.filterValues[filter.id] = e.target.value;
            this.updateOutput();
        }, 500));
        
        return input;
    }
    
    /**
     * Fetch filter options from API
     */
    async fetchFilterOptions(filter) {
        const providerConfig = getProvider(this.provider);
        
        // Determine which API endpoint to call based on filter type
        if (filter.id === 'sportType') {
            return await this.fetchSportTypes(providerConfig);
        } else if (filter.id === 'teams') {
            return await this.fetchTeams(providerConfig);
        } else if (filter.id === 'category') {
            return await this.fetchCategories(providerConfig);
        }
        
        return [];
    }
    
    /**
     * Fetch sport types from API
     */
    async fetchSportTypes(providerConfig) {
        console.log('🏆 Fetching sport types...');
        
        // Fallback sport types if API fails
        const fallbackSports = [
            { value: 'football', label: 'Football' },
            { value: 'handball', label: 'Handball' },
            { value: 'hockey', label: 'Hockey' },
            { value: 'basketball', label: 'Basketball' },
            { value: 'athletics', label: 'Athletics' },
            { value: 'skiing', label: 'Skiing' },
            { value: 'tennis', label: 'Tennis' },
            { value: 'golf', label: 'Golf' },
            { value: 'motorsport', label: 'Motorsport' },
            { value: 'cycling', label: 'Cycling' }
        ];
        
        try {
            // Search for assets with sports metadata to extract unique sport types
            const url = `${providerConfig.baseUrl}/search?appName=${providerConfig.appName}&limit=100&additional=metadata`;
            console.log('📡 Fetching from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('⚠️ Failed to fetch sport types from API, using fallback');
                return fallbackSports;
            }
            
            const data = await response.json();
            const sportTypes = new Set();
            
            // Extract unique sport types from assets
            if (data._embedded && data._embedded.assets) {
                data._embedded.assets.forEach(asset => {
                    if (asset.additional && asset.additional.metadata && asset.additional.metadata.sportType) {
                        sportTypes.add(asset.additional.metadata.sportType.value);
                    }
                });
            }
            
            if (sportTypes.size > 0) {
                console.log('✅ Found sport types from API:', Array.from(sportTypes));
                return Array.from(sportTypes).map(sport => ({
                    value: sport,
                    label: sport.charAt(0).toUpperCase() + sport.slice(1)
                })).sort((a, b) => a.label.localeCompare(b.label));
            } else {
                console.warn('⚠️ No sport types found in API response, using fallback');
                return fallbackSports;
            }
            
        } catch (error) {
            console.error('❌ Error fetching sport types:', error);
            console.log('✅ Using fallback sport types');
            return fallbackSports;
        }
    }
    
    /**
     * Fetch teams/tags from API
     */
    async fetchTeams(providerConfig) {
        console.log('👥 Fetching teams/tags...');
        
        try {
            const url = `${providerConfig.baseUrl}/tags?appName=${providerConfig.appName}`;
            console.log('📡 Fetching from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('⚠️ Failed to fetch teams, returning empty array');
                return [];
            }
            
            const data = await response.json();
            
            if (data._embedded && data._embedded.tags) {
                const teams = data._embedded.tags.map(tag => ({
                    value: tag.id,
                    label: tag.tag || tag.id
                })).sort((a, b) => a.label.localeCompare(b.label));
                
                console.log('✅ Found', teams.length, 'teams/tags');
                return teams;
            }
            
            console.warn('⚠️ No tags found in API response');
            return [];
            
        } catch (error) {
            console.error('❌ Error fetching teams:', error);
            return [];
        }
    }
    
    /**
     * Fetch categories from API
     */
    async fetchCategories(providerConfig) {
        console.log('📁 Fetching categories...');
        
        try {
            const url = `${providerConfig.baseUrl}/categories?appName=${providerConfig.appName}`;
            console.log('📡 Fetching from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('⚠️ Failed to fetch categories, returning empty array');
                return [];
            }
            
            const data = await response.json();
            
            if (data._embedded && data._embedded.categories) {
                const categories = data._embedded.categories
                    .filter(cat => cat.showCategory) // Only show visible categories
                    .map(cat => ({
                        value: cat.id,
                        label: cat.title
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                
                console.log('✅ Found', categories.length, 'categories');
                return categories;
            }
            
            console.warn('⚠️ No categories found in API response');
            return [];
            
        } catch (error) {
            console.error('❌ Error fetching categories:', error);
            return [];
        }
    }
    
    /**
     * Get current filter values
     */
    getFilterValues() {
        return this.filterValues;
    }
    
    /**
     * Update output when filters change
     */
    updateOutput() {
        if (window.app) {
            window.app.generateOutput();
        }
    }
}
