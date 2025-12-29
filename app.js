// SVP Builder v5 - With Digest Mode & Multi-Select
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('SVP Builder v5 loaded');
    
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
    var variableHint = document.getElementById('variable-hint');
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
    var podcastDateFilter = document.getElementById('podcast-date-filter');
    var fetchSeriesBtn = document.getElementById('fetch-series');
    var seriesList = document.getElementById('series-list');
    var seriesLabel = document.getElementById('series-label');
    var seriesSelectedCount = document.getElementById('series-selected-count');
    var selectedCountText = document.getElementById('selected-count-text');
    var resetPodcastFilters = document.getElementById('reset-podcast-filters');
    var modeInfo = document.getElementById('mode-info');
    
    // Mode toggle
    var modeBtns = document.querySelectorAll('.mode-btn');
    
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
                { icon: '📬', title: 'Latest Episode', desc: 'For scheduled sends', preset: 'latest-single', featured: true, badge: 'AUTOMATED' },
                { icon: '📰', title: 'Weekly Digest', desc: 'Multiple podcasts', preset: 'weekly-digest', featured: true, badge: 'AUTOMATED' },
                { icon: '🎙️', title: 'Recent Episodes', desc: 'Newest first', preset: 'latest' },
                { icon: '📻', title: 'Full Episodes', desc: 'Episodes only', preset: 'episodes' }
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
    
    var templates = {
        single: [
            {
                id: 'single-episode-card',
                title: 'Single Episode Card',
                desc: 'Perfect for "new episode" emails',
                recommended: true,
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign episode = VAR._embedded.assets[0] %}\n<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; max-width: 500px;">\n  <img src="{{episode.images.main}}?t[]=500x280q80" style="width: 100%; display: block;">\n  <div style="padding: 20px;">\n    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">🎙️ New Episode</p>\n    <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #111827;">{{episode.title}}</h2>\n    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.5;">{{episode.description | truncate: 150}}</p>\n    <p style="margin: 0; color: #9ca3af; font-size: 13px;">⏱️ {{episode.duration | divided_by: 60000}} min</p>\n  </div>\n</div>\n{% else %}\n<p>No new episodes available.</p>\n{% endif %}'
            },
            {
                id: 'single-simple',
                title: 'Simple Text',
                desc: 'Title and description only',
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign item = VAR._embedded.assets[0] %}\n<h2>{{item.title}}</h2>\n<p>{{item.description}}</p>\n{% endif %}'
            },
            {
                id: 'single-with-image',
                title: 'With Image',
                desc: 'Card layout with thumbnail',
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign item = VAR._embedded.assets[0] %}\n<div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">\n  <img src="{{item.images.main}}?t[]=480x270q80" style="width: 100%;">\n  <div style="padding: 16px;">\n    <h2>{{item.title}}</h2>\n    <p>{{item.description}}</p>\n  </div>\n</div>\n{% endif %}'
            }
        ],
        list: [
            {
                id: 'list-cards',
                title: 'Card List',
                desc: 'Visual cards with images',
                code: '{% for item in VAR._embedded.assets %}\n<div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; border: 1px solid #eee; border-radius: 8px;">\n  <img src="{{item.images.main}}?t[]=80x80q80" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">\n  <div>\n    <h4 style="margin: 0 0 4px 0;">{{item.title}}</h4>\n    <p style="margin: 0; color: #666; font-size: 14px;">{{item.category.title}}</p>\n    <small style="color: #999;">{{item.duration | divided_by: 60000}} min</small>\n  </div>\n</div>\n{% endfor %}'
            },
            {
                id: 'list-simple',
                title: 'Simple List',
                desc: 'Bullet points',
                code: '<ul>\n{% for item in VAR._embedded.assets %}\n  <li>{{item.title}}</li>\n{% endfor %}\n</ul>'
            },
            {
                id: 'list-detailed',
                title: 'Detailed List',
                desc: 'With descriptions and dates',
                code: '{% for item in VAR._embedded.assets %}\n<div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee;">\n  <h3 style="margin: 0 0 8px 0;">{{item.title}}</h3>\n  <p style="margin: 0 0 8px 0; color: #666;">{{item.description | truncate: 120}}</p>\n  <small style="color: #999;">{{item.published | date: "%b %d, %Y"}}</small>\n</div>\n{% endfor %}'
            }
        ],
        digest: [
            {
                id: 'digest-combined',
                title: 'Weekly Digest',
                desc: 'All podcasts in one list',
                recommended: true,
                code: '<!-- DIGEST_TEMPLATE -->'
            },
            {
                id: 'digest-grouped',
                title: 'Grouped by Podcast',
                desc: 'Separate sections per podcast',
                code: '<!-- DIGEST_GROUPED_TEMPLATE -->'
            }
        ],
        fallback: [
            {
                id: 'with-fallback',
                title: 'With Fallback',
                desc: 'Shows message if no content',
                code: '{% if VAR._embedded.assets.size > 0 %}\n  {% for item in VAR._embedded.assets %}\n    <div style="margin-bottom: 16px;">\n      <h3>{{item.title}}</h3>\n      <p>{{item.description}}</p>\n    </div>\n  {% endfor %}\n{% else %}\n  <p>No content available at this time. Check back soon!</p>\n{% endif %}'
            }
        ]
    };
    
    // ============================================
    // CURRENT STATE
    // ============================================
    
    var currentContentType = 'live';
    var currentMode = 'single'; // 'single' or 'digest'
    var currentTemplate = null;
    var selectedSeries = []; // Array for multi-select in digest mode
    var seriesData = []; // Cached series data
    
    // ============================================
    // NAVIGATION HANDLING
    // ============================================
    
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var type = this.dataset.type;
            
            navItems.forEach(function(nav) {
                nav.classList.remove('active');
            });
            this.classList.add('active');
            
            currentContentType = type;
            var config = contentTypes[type];
            
            contentTitle.textContent = config.title;
            contentDescription.textContent = config.description;
            
            renderPresetCards(config.presets);
            
            if (type === 'podcasts') {
                generalFilters.classList.add('hidden');
                podcastFilters.classList.remove('hidden');
            } else {
                generalFilters.classList.remove('hidden');
                podcastFilters.classList.add('hidden');
            }
            
            if (config.showTags) {
                quickTags.classList.add('visible');
            } else {
                quickTags.classList.remove('visible');
            }
            
            // Reset state
            selectedSeries = [];
            currentMode = 'single';
            updateModeUI();
            clearPreview();
            updateGeneratedCode();
            renderTemplateList();
        });
    });
    
    // ============================================
    // MODE TOGGLE (Single / Digest)
    // ============================================
    
    modeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            modeBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            
            currentMode = this.dataset.mode;
            updateModeUI();
            updateGeneratedCode();
            renderTemplateList();
        });
    });
    
    function updateModeUI() {
        if (currentMode === 'digest') {
            modeInfo.innerHTML = '<div class="mode-info-icon">📰</div><div class="mode-info-text"><strong>Digest Mode:</strong> Select multiple podcasts to create a "released this week" roundup. Each podcast gets its own API call.</div>';
            seriesLabel.textContent = 'SELECT PODCASTS (Multi-select)';
            podcastLimit.value = 1;
            variableHint.textContent = 'In digest mode, variables are auto-named: podcast_1, podcast_2, etc.';
            seriesSelectedCount.classList.remove('hidden');
            updateSelectedCount();
        } else {
            modeInfo.innerHTML = '<div class="mode-info-icon">💡</div><div class="mode-info-text"><strong>Single Podcast Mode:</strong> Fetch episodes from one podcast. Perfect for automated "new episode" emails.</div>';
            seriesLabel.textContent = 'SELECT PODCAST SERIES';
            variableHint.textContent = '';
            seriesSelectedCount.classList.add('hidden');
        }
        
        // Re-render series list with correct input type
        if (seriesData.length > 0) {
            renderSeriesList(seriesData);
        }
    }
    
    function updateSelectedCount() {
        var count = selectedSeries.length;
        selectedCountText.textContent = count + ' podcast' + (count !== 1 ? 's' : '') + ' selected';
    }
    
    // ============================================
    // PRESET CARDS
    // ============================================
    
    function renderPresetCards(presets) {
        var html = '';
        presets.forEach(function(preset, index) {
            var activeClass = index === 0 ? ' active' : '';
            var featuredClass = preset.featured ? ' featured' : '';
            
            html += '<div class="preset-card' + activeClass + featuredClass + '" data-preset="' + preset.preset + '">';
            html += '<div class="preset-icon">' + preset.icon + '</div>';
            html += '<div class="preset-title">' + preset.title + '</div>';
            html += '<div class="preset-desc">' + preset.desc + '</div>';
            if (preset.badge) {
                html += '<div class="preset-badge">' + preset.badge + '</div>';
            }
            html += '</div>';
        });
        presetCardsContainer.innerHTML = html;
        
        var cards = presetCardsContainer.querySelectorAll('.preset-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                cards.forEach(function(c) { c.classList.remove('active'); });
                this.classList.add('active');
                
                var preset = this.dataset.preset;
                applyPreset(preset);
                updateGeneratedCode();
            });
        });
    }
    
    function applyPreset(preset) {
        if (currentContentType !== 'podcasts') return;
        
        // Reset first
        podcastContentType.value = '';
        podcastAccess.value = '';
        podcastSort.value = '-published';
        podcastDateFilter.value = '';
        
        switch(preset) {
            case 'latest-single':
                // Latest Episode - for automated single podcast emails
                currentMode = 'single';
                podcastLimit.value = 1;
                podcastSort.value = '-published';
                updateModeToggle('single');
                showToast('Set to fetch 1 latest episode - perfect for scheduled sends!');
                break;
                
            case 'weekly-digest':
                // Weekly Digest - multi-select mode
                currentMode = 'digest';
                podcastLimit.value = 1;
                podcastDateFilter.value = '7';
                updateModeToggle('digest');
                showToast('Digest mode enabled - select multiple podcasts below');
                break;
                
            case 'episodes':
                podcastContentType.value = 'episodes';
                break;
                
            case 'latest':
                podcastLimit.value = 10;
                break;
        }
        
        updateModeUI();
        renderTemplateList();
    }
    
    function updateModeToggle(mode) {
        modeBtns.forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }
    
    // ============================================
    // TEMPLATE LIST
    // ============================================
    
    function renderTemplateList() {
        var html = '';
        var templateGroups = [];
        
        if (currentContentType === 'podcasts') {
            if (currentMode === 'digest') {
                templateGroups = [
                    { name: 'Digest Templates', templates: templates.digest },
                    { name: 'With Fallback', templates: templates.fallback }
                ];
            } else {
                templateGroups = [
                    { name: 'Single Episode', templates: templates.single },
                    { name: 'Episode Lists', templates: templates.list },
                    { name: 'With Fallback', templates: templates.fallback }
                ];
            }
        } else {
            templateGroups = [
                { name: 'Single Item', templates: templates.single },
                { name: 'Lists', templates: templates.list },
                { name: 'With Fallback', templates: templates.fallback }
            ];
        }
        
        templateGroups.forEach(function(group) {
            group.templates.forEach(function(tmpl, index) {
                var isFirst = index === 0 && group === templateGroups[0];
                var activeClass = isFirst ? ' active' : '';
                var recommendedClass = tmpl.recommended ? ' recommended' : '';
                
                if (isFirst) {
                    currentTemplate = tmpl;
                }
                
                html += '<div class="template-item' + activeClass + recommendedClass + '" data-template-id="' + tmpl.id + '">';
                html += '<div class="template-title">' + tmpl.title;
                if (tmpl.recommended) {
                    html += ' <span class="template-recommended-badge">RECOMMENDED</span>';
                }
                html += '</div>';
                html += '<div class="template-desc">' + tmpl.desc + '</div>';
                html += '</div>';
            });
        });
        
        templateList.innerHTML = html;
        
        // Attach click handlers
        var items = templateList.querySelectorAll('.template-item');
        items.forEach(function(item) {
            item.addEventListener('click', function() {
                items.forEach(function(i) { i.classList.remove('active'); });
                this.classList.add('active');
                
                var templateId = this.dataset.templateId;
                currentTemplate = findTemplateById(templateId);
                updateLiquidCode();
            });
        });
        
        updateLiquidCode();
    }
    
    function findTemplateById(id) {
        var allTemplates = [].concat(
            templates.single,
            templates.list,
            templates.digest,
            templates.fallback
        );
        return allTemplates.find(function(t) { return t.id === id; }) || allTemplates[0];
    }
    
    function updateLiquidCode() {
        if (!currentTemplate) return;
        
        var varName = variableInput.value || 'content';
        var code = currentTemplate.code;
        
        // Handle digest templates
        if (currentMode === 'digest' && selectedSeries.length > 0) {
            code = generateDigestTemplate();
        } else {
            code = code.replace(/VAR/g, varName);
        }
        
        liquidCode.textContent = code;
    }
    
    function generateDigestTemplate() {
        if (selectedSeries.length === 0) {
            return '<!-- Select podcasts to generate digest template -->';
        }
        
        var isGrouped = currentTemplate && currentTemplate.id === 'digest-grouped';
        var code = '';
        
        if (isGrouped) {
            // Grouped by podcast
            selectedSeries.forEach(function(series, index) {
                var varName = 'podcast_' + (index + 1);
                code += '<!-- ' + series.title + ' -->\n';
                code += '{% if ' + varName + '._embedded.assets.size > 0 %}\n';
                code += '<div style="margin-bottom: 24px;">\n';
                code += '  <h3 style="margin: 0 0 12px 0; color: #7c3aed;">🎙️ ' + series.title + '</h3>\n';
                code += '  {% assign episode = ' + varName + '._embedded.assets[0] %}\n';
                code += '  <div style="display: flex; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">\n';
                code += '    <img src="{{episode.images.main}}?t[]=80x80q80" style="width: 60px; height: 60px; border-radius: 8px;">\n';
                code += '    <div>\n';
                code += '      <h4 style="margin: 0 0 4px 0;">{{episode.title}}</h4>\n';
                code += '      <p style="margin: 0; color: #666; font-size: 14px;">{{episode.duration | divided_by: 60000}} min</p>\n';
                code += '    </div>\n';
                code += '  </div>\n';
                code += '</div>\n';
                code += '{% endif %}\n\n';
            });
        } else {
            // Combined list
            code += '<h2 style="margin: 0 0 16px 0;">🎧 This Week\'s Episodes</h2>\n\n';
            
            selectedSeries.forEach(function(series, index) {
                var varName = 'podcast_' + (index + 1);
                code += '{% if ' + varName + '._embedded.assets.size > 0 %}\n';
                code += '{% assign episode = ' + varName + '._embedded.assets[0] %}\n';
                code += '<div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">\n';
                code += '  <img src="{{episode.images.main}}?t[]=80x80q80" style="width: 60px; height: 60px; border-radius: 8px;">\n';
                code += '  <div>\n';
                code += '    <p style="margin: 0 0 4px 0; color: #7c3aed; font-size: 12px; font-weight: 600;">' + series.title + '</p>\n';
                code += '    <h4 style="margin: 0 0 4px 0;">{{episode.title}}</h4>\n';
                code += '    <p style="margin: 0; color: #666; font-size: 14px;">{{episode.duration | divided_by: 60000}} min</p>\n';
                code += '  </div>\n';
                code += '</div>\n';
                code += '{% endif %}\n\n';
            });
        }
        
        return code;
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
    // URL GENERATION
    // ============================================
    
    function buildUrl(seriesId) {
        var provider = providerSelect.value;
        if (!provider) return null;
        
        var baseUrl = 'https://svp.vg.no/svp/api/v1/' + provider;
        var filters = [];
        var params = ['appName=braze_content'];
        
        if (currentContentType === 'podcasts') {
            baseUrl += '/search';
            filters.push('assetType::audio');
            
            if (podcastContentType.value === 'episodes') {
                filters.push('series.episodeNumber>0');
            } else if (podcastContentType.value === 'clips') {
                filters.push('duration<300000');
            }
            
            if (podcastAccess.value === 'free') {
                filters.push('additional.access.free::true');
            } else if (podcastAccess.value === 'paid') {
                filters.push('additional.access.free::false');
            }
            
            // Date filter
            if (podcastDateFilter.value) {
                var days = parseInt(podcastDateFilter.value);
                var since = Date.now() - (days * 24 * 60 * 60 * 1000);
                filters.push('published>' + since);
            }
            
            // Series filter
            if (seriesId) {
                filters.push('categoryId::' + seriesId);
            }
            
            params.push('limit=' + (podcastLimit.value || 10));
            params.push('sort=' + podcastSort.value);
            params.push('additional=settings,metadata,access');
            
        } else {
            baseUrl += '/search';
            var config = contentTypes[currentContentType];
            
            if (config.filter) {
                filters.push(config.filter);
            }
            
            if (filterCategory.value) {
                filters.push('categoryId::' + filterCategory.value);
            }
            
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
        
        if (currentContentType === 'podcasts' && currentMode === 'digest' && selectedSeries.length > 0) {
            // Generate multiple Connected Content blocks
            var code = '';
            var urls = [];
            
            selectedSeries.forEach(function(series, index) {
                var seriesVarName = 'podcast_' + (index + 1);
                var url = buildUrl(series.id);
                urls.push(url);
                code += '{% connected_content ' + url + ' :save ' + seriesVarName + ' %}\n';
            });
            
            brazeCode.textContent = code.trim();
            readableUrl.textContent = 'Multiple API calls:\n\n' + urls.map(function(u, i) {
                return (i + 1) + '. ' + decodeURIComponent(u);
            }).join('\n\n');
            
        } else {
            // Single URL
            var seriesId = currentMode === 'single' && selectedSeries.length > 0 
                ? selectedSeries[0].id 
                : null;
            var url = buildUrl(seriesId);
            
            if (!url) return;
            
            brazeCode.textContent = '{% connected_content ' + url + ' :save ' + varName + ' %}';
            readableUrl.textContent = decodeURIComponent(url);
        }
        
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
        
        var url = 'https://svp.vg.no/svp/api/v1/' + provider + '/categories?appName=braze_content&limit=100&filter=isSeries::true';
        
        fetch(url)
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to fetch');
                return response.json();
            })
            .then(function(data) {
                seriesData = data._embedded ? data._embedded.categories : [];
                renderSeriesList(seriesData);
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
        
        var inputType = currentMode === 'digest' ? 'checkbox' : 'radio';
        var html = '';
        
        if (currentMode === 'single') {
            var isAllSelected = selectedSeries.length === 0;
            html += '<div class="series-item' + (isAllSelected ? ' selected' : '') + '" data-id="" data-title="All Series">';
            html += '<input type="radio" name="series" value="" ' + (isAllSelected ? 'checked' : '') + '>';
            html += '<div class="series-info">';
            html += '<div class="series-title">All Series</div>';
            html += '<div class="series-meta">Show episodes from all podcasts</div>';
            html += '</div></div>';
        }
        
        categories.forEach(function(cat) {
            var isSelected = selectedSeries.some(function(s) { return s.id === cat.id; });
            
            html += '<div class="series-item' + (isSelected ? ' selected' : '') + '" data-id="' + cat.id + '" data-title="' + escapeHtml(cat.title) + '">';
            html += '<input type="' + inputType + '" name="series" value="' + cat.id + '" ' + (isSelected ? 'checked' : '') + '>';
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
            item.addEventListener('click', function(e) {
                var id = this.dataset.id;
                var title = this.dataset.title;
                var checkbox = this.querySelector('input');
                
                if (currentMode === 'digest') {
                    // Multi-select mode
                    if (id) { // Can't select "All" in digest mode
                        checkbox.checked = !checkbox.checked;
                        this.classList.toggle('selected', checkbox.checked);
                        
                        if (checkbox.checked) {
                            selectedSeries.push({ id: id, title: title });
                        } else {
                            selectedSeries = selectedSeries.filter(function(s) { return s.id !== id; });
                        }
                        
                        updateSelectedCount();
                    }
                } else {
                    // Single-select mode
                    items.forEach(function(i) { i.classList.remove('selected'); });
                    this.classList.add('selected');
                    checkbox.checked = true;
                    
                    if (id) {
                        selectedSeries = [{ id: id, title: title }];
                    } else {
                        selectedSeries = [];
                    }
                    
                    showToast(id ? 'Selected: ' + title : 'Showing all series');
                }
                
                updateGeneratedCode();
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
        
        loadPreviewBtn.disabled = true;
        loadPreviewBtn.classList.add('loading');
        loadPreviewBtn.textContent = 'Loading...';
        previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">⏳</div><p>Fetching content...</p></div>';
        
        if (currentMode === 'digest' && selectedSeries.length > 0) {
            // Fetch all selected series
            var promises = selectedSeries.map(function(series) {
                var url = buildUrl(series.id);
                return fetch(url)
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                        return { series: series, data: data };
                    });
            });
            
            Promise.all(promises)
                .then(function(results) {
                    renderDigestPreview(results);
                })
                .catch(function(error) {
                    console.error('Preview error:', error);
                    previewContent.innerHTML = '<div class="preview-error">Failed to load preview.</div>';
                })
                .finally(function() {
                    loadPreviewBtn.disabled = false;
                    loadPreviewBtn.classList.remove('loading');
                    loadPreviewBtn.textContent = 'Load Preview';
                });
        } else {
            // Single fetch
            var seriesId = selectedSeries.length > 0 ? selectedSeries[0].id : null;
            var url = buildUrl(seriesId);
            
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
                    previewContent.innerHTML = '<div class="preview-error">Failed to load preview.</div>';
                    previewCount.textContent = '';
                })
                .finally(function() {
                    loadPreviewBtn.disabled = false;
                    loadPreviewBtn.classList.remove('loading');
                    loadPreviewBtn.textContent = 'Load Preview';
                });
        }
    });
    
    function renderPreview(data) {
        var assets = data._embedded && data._embedded.assets ? data._embedded.assets : [];
        
        if (assets.length === 0) {
            previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">📭</div><p>No content found matching your filters</p></div>';
            previewCount.textContent = '0 results';
            return;
        }
        
        previewCount.textContent = assets.length + ' result' + (assets.length !== 1 ? 's' : '');
        previewContent.innerHTML = renderAssetList(assets);
    }
    
    function renderDigestPreview(results) {
        var totalCount = 0;
        var html = '';
        
        results.forEach(function(result) {
            var assets = result.data._embedded && result.data._embedded.assets ? result.data._embedded.assets : [];
            totalCount += assets.length;
            
            html += '<div class="preview-group">';
            html += '<div class="preview-group-header">';
            html += '<span class="preview-group-icon">🎙️</span>';
            html += '<span class="preview-group-title">' + escapeHtml(result.series.title) + '</span>';
            html += '</div>';
            
            if (assets.length > 0) {
                html += renderAssetList(assets);
            } else {
                html += '<div class="preview-empty" style="padding: 12px;"><p style="font-size: 13px;">No recent episodes</p></div>';
            }
            
            html += '</div>';
        });
        
        previewCount.textContent = totalCount + ' total episode' + (totalCount !== 1 ? 's' : '') + ' from ' + results.length + ' podcasts';
        previewContent.innerHTML = html;
    }
    
    function renderAssetList(assets) {
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
        
        return html;
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
        filterSort.value = '-published';
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
        podcastSort.value = '-published';
        podcastDateFilter.value = '';
        selectedSeries = [];
        currentMode = 'single';
        
        updateModeToggle('single');
        updateModeUI();
        
        // Reset series selection UI
        var items = seriesList.querySelectorAll('.series-item');
        items.forEach(function(item) {
            item.classList.remove('selected');
            item.querySelector('input').checked = false;
            if (item.dataset.id === '') {
                item.classList.add('selected');
                item.querySelector('input').checked = true;
            }
        });
        
        updateGeneratedCode();
        renderTemplateList();
        showToast('Podcast filters reset');
    });
    
    // ============================================
    // INPUT CHANGE HANDLERS
    // ============================================
    
    providerSelect.addEventListener('change', function() {
        selectedSeries = [];
        seriesData = [];
        seriesList.innerHTML = '<div class="series-empty"><p>Select a provider and click "Load Series" to see available podcasts</p></div>';
        seriesSelectedCount.classList.add('hidden');
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
    podcastDateFilter.addEventListener('change', updateGeneratedCode);
    
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
        }, 2500);
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
    renderTemplateList();
    updateGeneratedCode();
    
    console.log('SVP Builder v5 initialized with Digest Mode');
    
});
