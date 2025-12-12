// SVP Builder v4 - Simplified with Series Selection
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('SVP Builder v4 loaded');
    
    // ============================================
    // ELEMENT REFERENCES
    // ============================================
    
    var navItems = document.querySelectorAll('.nav-item');
    var contentTitle = document.getElementById('content-title');
    var contentDescription = document.getElementById('content-description');
    var presetCardsContainer = document.getElementById('preset-cards');
    var quickTags = document.getElementById('quick-tags');
    var outputTabs = document.querySelectorAll('.output-tab');
    var panelConnected = document.getElementById('panel-connected');
    var panelLiquid = document.getElementById('panel-liquid');
    var templateList = document.getElementById('template-list');
    var providerSelect = document.getElementById('provider-select');
    var variableInput = document.getElementById('variable-name');
    var brazeCode = document.getElementById('braze-code');
    var readableUrl = document.getElementById('readable-url');
    var liquidCode = document.getElementById('liquid-code');
    var toast = document.getElementById('toast');
    var resetFilters = document.getElementById('reset-filters');
    
    // General filters
    var filterCategory = document.getElementById('filter-category');
    var filterLimit = document.getElementById('filter-limit');
    var filterSort = document.getElementById('filter-sort');
    
    // Podcast filters
    var generalFilters = document.getElementById('general-filters');
    var podcastFilters = document.getElementById('podcast-filters');
    var podcastContentType = document.getElementById('podcast-content-type');
    var podcastAccess = document.getElementById('podcast-access');
    var podcastLimit = document.getElementById('podcast-limit');
    var podcastSort = document.getElementById('podcast-sort');
    var fetchSeriesBtn = document.getElementById('fetch-series');
    var seriesList = document.getElementById('series-list');
    var resetPodcastFilters = document.getElementById('reset-podcast-filters');
    
    // Preview
    var loadPreviewBtn = document.getElementById('load-preview');
    var previewContent = document.getElementById('preview-content');
    var previewCount = document.getElementById('preview-count');
    
    // ============================================
    // CONTENT TYPE CONFIGURATIONS
    // ============================================
    
    var contentTypes = {
        live: {
            title: 'Live Content',
            description: 'Fetch currently live streams and broadcasts',
            filter: 'streamType::live',
            showTags: false,
            presets: [
                { icon: '🔴', title: 'All Live Now', desc: 'Everything currently streaming', preset: 'all' },
                { icon: '🔄', title: 'Recently Ended', desc: 'Last 24 hours', preset: 'recent' },
                { icon: '📅', title: 'Starting Soon', desc: 'Next 3 hours', preset: 'soon' }
            ]
        },
        sports: {
            title: 'Sports Events',
            description: 'Live and upcoming sports matches',
            filter: 'streamType::live',
            showTags: true,
            presets: [
                { icon: '⚽', title: 'All Sports', desc: 'Every sport type', preset: 'all' },
                { icon: '🔴', title: 'Live Now', desc: 'Currently playing', preset: 'live' },
                { icon: '📅', title: 'Today\'s Matches', desc: 'All matches today', preset: 'today' },
                { icon: '📆', title: 'This Week', desc: 'Next 7 days', preset: 'week' }
            ]
        },
        podcasts: {
            title: 'Podcasts',
            description: 'Audio podcasts and episodes',
            filter: 'assetType::audio',
            showTags: false,
            presets: [
                { icon: '🎙️', title: 'Latest Episodes', desc: 'Most recent first', preset: 'latest' },
                { icon: '⭐', title: 'Popular', desc: 'Most played', preset: 'popular' },
                { icon: '📻', title: 'Full Episodes', desc: 'Episodes only', preset: 'episodes' },
                { icon: '⚡', title: 'Quick Listens', desc: 'Under 15 minutes', preset: 'short' }
            ]
        },
        vod: {
            title: 'Video on Demand',
            description: 'Recorded video content and replays',
            filter: 'streamType::vod',
            showTags: false,
            presets: [
                { icon: '🎬', title: 'Latest Videos', desc: 'Most recent uploads', preset: 'latest' },
                { icon: '🔥', title: 'Trending', desc: 'Most viewed', preset: 'trending' },
                { icon: '🏆', title: 'Sports Highlights', desc: 'Match replays', preset: 'sports' }
            ]
        },
        all: {
            title: 'All Content',
            description: 'Search across all content types',
            filter: '',
            showTags: false,
            presets: [
                { icon: '🎯', title: 'Everything', desc: 'No filters applied', preset: 'all' },
                { icon: '📅', title: 'Recent', desc: 'Last 7 days', preset: 'recent' },
                { icon: '⭐', title: 'Featured', desc: 'Editor picks', preset: 'featured' }
            ]
        }
    };
    
    // ============================================
    // LIQUID TEMPLATES
    // ============================================
    
    var templates = [
        // 0: Single Item - Simple
        '<h2>{{VAR._embedded.assets[0].title}}</h2>\n<p>{{VAR._embedded.assets[0].description}}</p>',
        
        // 1: Single Item - Card
        '<div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">\n  <img src="{{VAR._embedded.assets[0].images.main}}?t[]=480x270q80" style="width: 100%;">\n  <div style="padding: 16px;">\n    <h2>{{VAR._embedded.assets[0].title}}</h2>\n    <p>{{VAR._embedded.assets[0].description}}</p>\n  </div>\n</div>',
        
        // 2: List - Bullet Points
        '<ul>\n{% for item in VAR._embedded.assets %}\n  <li>{{item.title}}</li>\n{% endfor %}\n</ul>',
        
        // 3: List - With Details
        '{% for item in VAR._embedded.assets %}\n<div style="margin-bottom: 16px;">\n  <h3>{{item.title}}</h3>\n  <p>{{item.description}}</p>\n  <small>{{item.published | date: "%b %d, %Y"}}</small>\n</div>\n{% endfor %}',
        
        // 4: Grid Layout
        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">\n{% for item in VAR._embedded.assets %}\n  <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">\n    <img src="{{item.images.main}}?t[]=480x270q80" style="width: 100%; height: 150px; object-fit: cover;">\n    <div style="padding: 12px;">\n      <h4>{{item.title}}</h4>\n    </div>\n  </div>\n{% endfor %}\n</div>',
        
        // 5: Sports Schedule
        '<table style="width: 100%; border-collapse: collapse;">\n{% for item in VAR._embedded.assets %}\n  <tr style="border-bottom: 1px solid #eee;">\n    <td style="padding: 12px;">{{item.flightTimes.start | date: "%H:%M"}}</td>\n    <td style="padding: 12px;"><strong>{{item.title}}</strong></td>\n  </tr>\n{% endfor %}\n</table>',
        
        // 6: Podcast Episodes
        '{% for item in VAR._embedded.assets %}\n<div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; border: 1px solid #eee; border-radius: 8px;">\n  <img src="{{item.images.main}}?t[]=80x80q80" style="width: 60px; height: 60px; border-radius: 8px;">\n  <div>\n    <h4 style="margin: 0 0 4px 0;">{{item.title}}</h4>\n    <p style="margin: 0; color: #666; font-size: 14px;">{{item.category.title}}</p>\n    <small style="color: #999;">{{item.duration | divided_by: 60000}} min</small>\n  </div>\n</div>\n{% endfor %}',
        
        // 7: With Live Badge
        '{% for item in VAR._embedded.assets %}\n<div style="position: relative; margin-bottom: 16px;">\n  {% if item.streamType == \'live\' %}\n    <span style="position: absolute; top: 8px; left: 8px; background: red; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">🔴 LIVE</span>\n  {% endif %}\n  <img src="{{item.images.main}}?t[]=480x270q80" style="width: 100%; border-radius: 8px;">\n  <h3>{{item.title}}</h3>\n</div>\n{% endfor %}',
        
        // 8: Featured + List
        '{% assign featured = VAR._embedded.assets[0] %}\n<div style="margin-bottom: 24px;">\n  <img src="{{featured.images.main}}?t[]=480x270q80" style="width: 100%; border-radius: 8px;">\n  <h2>{{featured.title}}</h2>\n  <p>{{featured.description}}</p>\n</div>\n\n<h3>More Content</h3>\n{% for item in VAR._embedded.assets offset: 1 %}\n<div style="padding: 12px 0; border-bottom: 1px solid #eee;">\n  {{item.title}}\n</div>\n{% endfor %}',
        
        // 9: With Fallback
        '{% if VAR._embedded.assets.size > 0 %}\n  {% for item in VAR._embedded.assets %}\n    <div style="margin-bottom: 16px;">\n      <h3>{{item.title}}</h3>\n      <p>{{item.description}}</p>\n    </div>\n  {% endfor %}\n{% else %}\n  <p>No content available at this time.</p>\n{% endif %}'
    ];
    
    // ============================================
    // CURRENT STATE
    // ============================================
    
    var currentContentType = 'live';
    var currentTemplate = 4;
    var selectedSeriesId = null;
    var selectedSeriesTitle = null;
    
    // ============================================
    // NAVIGATION HANDLING
    // ============================================
    
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var type = this.dataset.type;
            
            // Remove active class from all nav items
            navItems.forEach(function(nav) {
                nav.classList.remove('active');
            });
            this.classList.add('active');
            
            currentContentType = type;
            var config = contentTypes[type];
            
            // Update header
            contentTitle.textContent = config.title;
            contentDescription.textContent = config.description;
            
            // Update preset cards
            renderPresetCards(config.presets);
            
            // Show/hide appropriate filters
            if (type === 'podcasts') {
                generalFilters.classList.add('hidden');
                podcastFilters.classList.remove('hidden');
            } else {
                generalFilters.classList.remove('hidden');
                podcastFilters.classList.add('hidden');
            }
            
            // Show/hide quick tags (for sports)
            if (config.showTags) {
                quickTags.classList.add('visible');
            } else {
                quickTags.classList.remove('visible');
            }
            
            // Reset series selection
            selectedSeriesId = null;
            selectedSeriesTitle = null;
            
            // Clear preview
            clearPreview();
            
            // Update generated code
            updateGeneratedCode();
        });
    });
    
    // ============================================
    // PRESET CARDS
    // ============================================
    
    function renderPresetCards(presets) {
        var html = '';
        presets.forEach(function(preset, index) {
            var activeClass = index === 0 ? ' active' : '';
            html += '<div class="preset-card' + activeClass + '" data-preset="' + preset.preset + '">';
            html += '<div class="preset-icon">' + preset.icon + '</div>';
            html += '<div class="preset-title">' + preset.title + '</div>';
            html += '<div class="preset-desc">' + preset.desc + '</div>';
            html += '</div>';
        });
        presetCardsContainer.innerHTML = html;
        
        // Attach click listeners
        var cards = presetCardsContainer.querySelectorAll('.preset-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                cards.forEach(function(c) { c.classList.remove('active'); });
                this.classList.add('active');
                
                // Apply preset filters for podcasts
                if (currentContentType === 'podcasts') {
                    applyPodcastPreset(this.dataset.preset);
                }
                
                updateGeneratedCode();
            });
        });
    }
    
    function applyPodcastPreset(preset) {
        // Reset filters first
        podcastContentType.value = '';
        podcastAccess.value = '';
        podcastSort.value = 'published';
        
        switch(preset) {
            case 'episodes':
                podcastContentType.value = 'episodes';
                break;
            case 'short':
                // We'll handle this in URL generation
                break;
            case 'popular':
                podcastSort.value = '-displays';
                break;
        }
    }
    
    // ============================================
    // QUICK TAGS (Sports)
    // ============================================
    
    var quickTagButtons = document.querySelectorAll('.quick-tag');
    quickTagButtons.forEach(function(tag) {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            updateGeneratedCode();
        });
    });
    
    // ============================================
    // OUTPUT TABS
    // ============================================
    
    outputTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            outputTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            
            var tabName = this.dataset.tab;
            if (tabName === 'connected') {
                panelConnected.classList.remove('hidden');
                panelLiquid.classList.add('hidden');
            } else {
                panelConnected.classList.add('hidden');
                panelLiquid.classList.remove('hidden');
            }
        });
    });
    
    // ============================================
    // TEMPLATE SELECTION
    // ============================================
    
    var templateItems = templateList.querySelectorAll('.template-item');
    templateItems.forEach(function(item) {
        item.addEventListener('click', function() {
            templateItems.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentTemplate = parseInt(this.dataset.template);
            updateLiquidCode();
        });
    });
    
    function updateLiquidCode() {
        var varName = variableInput.value || 'content';
        var code = templates[currentTemplate].replace(/VAR/g, varName);
        liquidCode.textContent = code;
    }
    
    // ============================================
    // URL GENERATION
    // ============================================
    
    function buildUrl() {
        var provider = providerSelect.value;
        if (!provider) return null;
        
        var baseUrl = 'https://svp.vg.no/svp/api/v1/' + provider;
        var filters = [];
        var params = ['appName=braze_content'];
        
        if (currentContentType === 'podcasts') {
            // Podcast-specific URL building
            baseUrl += '/search';
            filters.push('assetType::audio');
            
            // Content type filter
            if (podcastContentType.value === 'episodes') {
                filters.push('series.episodeNumber>0');
            } else if (podcastContentType.value === 'clips') {
                filters.push('duration<300000');
            }
            
            // Access filter
            if (podcastAccess.value === 'free') {
                filters.push('additional.access.free::true');
            } else if (podcastAccess.value === 'paid') {
                filters.push('additional.access.free::false');
            }
            
            // If a series is selected, filter by category
            if (selectedSeriesId) {
                filters.push('categoryId::' + selectedSeriesId);
            }
            
            // Check for "short" preset
            var activePreset = presetCardsContainer.querySelector('.preset-card.active');
            if (activePreset && activePreset.dataset.preset === 'short') {
                filters.push('duration<900000');
            }
            
            params.push('limit=' + (podcastLimit.value || 10));
            params.push('sort=' + podcastSort.value);
            params.push('additional=settings,metadata,access');
            
        } else {
            // General content URL building
            baseUrl += '/search';
            var config = contentTypes[currentContentType];
            
            if (config.filter) {
                filters.push(config.filter);
            }
            
            // Category filter
            if (filterCategory.value) {
                filters.push('categoryId::' + filterCategory.value);
            }
            
            // Sports tags
            if (currentContentType === 'sports') {
                var activeTags = document.querySelectorAll('.quick-tag.active');
                if (activeTags.length > 0) {
                    var sports = [];
                    activeTags.forEach(function(tag) {
                        sports.push(tag.dataset.sport);
                    });
                    filters.push('additional.metadata.sportType<>' + sports.join(','));
                }
            }
            
            params.push('limit=' + (filterLimit.value || 10));
            params.push('sort=' + filterSort.value);
            params.push('additional=settings,metadata');
        }
        
        if (filters.length > 0) {
            params.push('filter=' + filters.join('|'));
        }
        
        return baseUrl + '?' + params.join('&');
    }
    
    function updateGeneratedCode() {
        var provider = providerSelect.value;
        var varName = variableInput.value || 'content';
        
        if (!provider) {
            brazeCode.textContent = 'Select a provider to begin...';
            readableUrl.textContent = 'https://svp.vg.no/...';
            return;
        }
        
        var url = buildUrl();
        if (!url) return;
        
        // Braze Connected Content code
        brazeCode.textContent = '{% connected_content ' + url + ' :save ' + varName + ' %}';
        
        // Readable URL
        readableUrl.textContent = decodeURIComponent(url);
        
        // Update liquid code
        updateLiquidCode();
    }
    
    // ============================================
    // FETCH PODCAST SERIES
    // ============================================
    
    fetchSeriesBtn.addEventListener('click', function() {
        var provider = providerSelect.value;
        if (!provider) {
            showToast('Please select a provider first');
            return;
        }
        
        fetchSeriesBtn.disabled = true;
        fetchSeriesBtn.classList.add('loading');
        fetchSeriesBtn.innerHTML = '<span class="fetch-icon">🔄</span> Loading...';
        
        // Build URL to fetch series (categories marked as series)
        var url = 'https://svp.vg.no/svp/api/v1/' + provider + '/series?appName=braze_content&limit=50';
        
        fetch(url)
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to fetch');
                return response.json();
            })
            .then(function(data) {
                renderSeriesList(data._embedded ? data._embedded.categories : []);
            })
            .catch(function(error) {
                console.error('Error fetching series:', error);
                seriesList.innerHTML = '<div class="series-empty"><p>Failed to load series. Try again.</p></div>';
            })
            .finally(function() {
                fetchSeriesBtn.disabled = false;
                fetchSeriesBtn.classList.remove('loading');
                fetchSeriesBtn.innerHTML = '<span class="fetch-icon">🔄</span> Load Series';
            });
    });
    
    function renderSeriesList(categories) {
        if (!categories || categories.length === 0) {
            seriesList.innerHTML = '<div class="series-empty"><p>No podcast series found for this provider</p></div>';
            return;
        }
        
        var html = '<div class="series-item" data-id="" data-title="All Series">';
        html += '<input type="radio" name="series" value="" ' + (!selectedSeriesId ? 'checked' : '') + '>';
        html += '<div class="series-info">';
        html += '<div class="series-title">All Series</div>';
        html += '<div class="series-meta">Show episodes from all podcasts</div>';
        html += '</div></div>';
        
        categories.forEach(function(cat) {
            var isSelected = selectedSeriesId === cat.id;
            html += '<div class="series-item' + (isSelected ? ' selected' : '') + '" data-id="' + cat.id + '" data-title="' + escapeHtml(cat.title) + '">';
            html += '<input type="radio" name="series" value="' + cat.id + '" ' + (isSelected ? 'checked' : '') + '>';
            html += '<div class="series-info">';
            html += '<div class="series-title">' + escapeHtml(cat.title) + '</div>';
            if (cat.additional && cat.additional.description) {
                html += '<div class="series-meta">' + escapeHtml(cat.additional.description.substring(0, 60)) + '...</div>';
            }
            html += '</div></div>';
        });
        
        seriesList.innerHTML = html;
        
        // Attach click handlers
        var items = seriesList.querySelectorAll('.series-item');
        items.forEach(function(item) {
            item.addEventListener('click', function() {
                items.forEach(function(i) { i.classList.remove('selected'); });
                this.classList.add('selected');
                this.querySelector('input').checked = true;
                
                selectedSeriesId = this.dataset.id || null;
                selectedSeriesTitle = this.dataset.title;
                
                updateGeneratedCode();
                showToast(selectedSeriesId ? 'Selected: ' + selectedSeriesTitle : 'Showing all series');
            });
        });
    }
    
    // ============================================
    // PREVIEW
    // ============================================
    
    loadPreviewBtn.addEventListener('click', function() {
        var provider = providerSelect.value;
        if (!provider) {
            showToast('Please select a provider first');
            return;
        }
        
        var url = buildUrl();
        if (!url) return;
        
        loadPreviewBtn.disabled = true;
        loadPreviewBtn.classList.add('loading');
        loadPreviewBtn.textContent = 'Loading...';
        previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">⏳</div><p>Fetching content...</p></div>';
        
        fetch(url)
            .then(function(response) {
                if (!response.ok) throw new Error('API request failed');
                return response.json();
            })
            .then(function(data) {
                renderPreview(data);
            })
            .catch(function(error) {
                console.error('Preview error:', error);
                previewContent.innerHTML = '<div class="preview-error">Failed to load preview. Check the console for details.</div>';
                previewCount.textContent = '';
            })
            .finally(function() {
                loadPreviewBtn.disabled = false;
                loadPreviewBtn.classList.remove('loading');
                loadPreviewBtn.textContent = 'Load Preview';
            });
    });
    
    function renderPreview(data) {
        var assets = data._embedded && data._embedded.assets ? data._embedded.assets : [];
        
        if (assets.length === 0) {
            previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">📭</div><p>No content found matching your filters</p></div>';
            previewCount.textContent = '0 results';
            return;
        }
        
        previewCount.textContent = assets.length + ' result' + (assets.length !== 1 ? 's' : '');
        
        var html = '';
        assets.forEach(function(asset) {
            var imageUrl = asset.images && asset.images.main 
                ? asset.images.main + '?t[]=160x90q80' 
                : '';
            
            var duration = asset.duration 
                ? Math.floor(asset.duration / 60000) + ' min' 
                : '';
            
            var badge = '';
            if (asset.streamType === 'live') {
                badge = '<span class="preview-badge live">LIVE</span>';
            } else if (asset.assetType === 'audio') {
                badge = '<span class="preview-badge audio">AUDIO</span>';
            }
            
            html += '<div class="preview-item">';
            if (imageUrl) {
                html += '<img src="' + imageUrl + '" class="preview-thumb" alt="">';
            }
            html += '<div class="preview-details">';
            html += '<div class="preview-item-title">' + escapeHtml(asset.title) + '</div>';
            if (asset.description) {
                html += '<div class="preview-item-desc">' + escapeHtml(asset.description) + '</div>';
            }
            html += '<div class="preview-item-meta">';
            if (badge) html += badge;
            if (asset.category && asset.category.title) {
                html += '<span>' + escapeHtml(asset.category.title) + '</span>';
            }
            if (duration) html += '<span>' + duration + '</span>';
            html += '</div>';
            html += '</div></div>';
        });
        
        previewContent.innerHTML = html;
    }
    
    function clearPreview() {
        previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">🔍</div><p>Click "Load Preview" to see what content your query will return</p></div>';
        previewCount.textContent = '';
    }
    
    // ============================================
    // RESET FILTERS
    // ============================================
    
    resetFilters.addEventListener('click', function() {
        filterCategory.value = '';
        filterLimit.value = 10;
        filterSort.value = 'published';
        document.querySelectorAll('.quick-tag').forEach(function(tag) {
            tag.classList.remove('active');
        });
        updateGeneratedCode();
        showToast('Filters reset');
    });
    
    resetPodcastFilters.addEventListener('click', function() {
        podcastContentType.value = '';
        podcastAccess.value = '';
        podcastLimit.value = 10;
        podcastSort.value = 'published';
        selectedSeriesId = null;
        selectedSeriesTitle = null;
        
        // Reset series selection UI
        var items = seriesList.querySelectorAll('.series-item');
        items.forEach(function(item) {
            item.classList.remove('selected');
            if (item.dataset.id === '') {
                item.classList.add('selected');
                item.querySelector('input').checked = true;
            }
        });
        
        updateGeneratedCode();
        showToast('Podcast filters reset');
    });
    
    // ============================================
    // INPUT CHANGE HANDLERS
    // ============================================
    
    providerSelect.addEventListener('change', function() {
        // Clear series when provider changes
        selectedSeriesId = null;
        selectedSeriesTitle = null;
        seriesList.innerHTML = '<div class="series-empty"><p>Select a provider and click "Load Series" to see available podcasts</p></div>';
        clearPreview();
        updateGeneratedCode();
    });
    
    variableInput.addEventListener('input', updateGeneratedCode);
    filterLimit.addEventListener('input', updateGeneratedCode);
    filterSort.addEventListener('change', updateGeneratedCode);
    filterCategory.addEventListener('change', updateGeneratedCode);
    
    podcastContentType.addEventListener('change', updateGeneratedCode);
    podcastAccess.addEventListener('change', updateGeneratedCode);
    podcastLimit.addEventListener('input', updateGeneratedCode);
    podcastSort.addEventListener('change', updateGeneratedCode);
    
    // ============================================
    // COPY BUTTONS
    // ============================================
    
    var copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.dataset.target;
            var targetElement = document.getElementById(targetId);
            var text = targetElement.textContent;
            
            navigator.clipboard.writeText(text).then(function() {
                showToast('Copied to clipboard!');
            }).catch(function(err) {
                console.error('Copy failed:', err);
                showToast('Failed to copy');
            });
        });
    });
    
    // ============================================
    // UTILITIES
    // ============================================
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
        }, 2000);
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ============================================
    // INITIAL SETUP
    // ============================================
    
    renderPresetCards(contentTypes.live.presets);
    updateGeneratedCode();
    updateLiquidCode();
    
    console.log('SVP Builder v4 initialized');
    
});
