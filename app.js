// SVP Builder v6 - Complete UX Overhaul
// Features: Auto-preview, Auto-load series, Dynamic Island, Tooltips, Modal
// v6.1 - Fixed podcast detection (use metadata instead of isSeries flag)

document.addEventListener('DOMContentLoaded', function () {

    console.log('SVP Builder v6.1 loading...');

    // ============================================
    // ELEMENT REFERENCES
    // ============================================

    // Dynamic Island
    var dynamicIsland = document.getElementById('dynamic-island');
    var islandText = document.getElementById('island-text');
    var islandDot = dynamicIsland.querySelector('.island-dot');

    // Welcome & Builder
    var welcomeState = document.getElementById('welcome-state');
    var builderContent = document.getElementById('builder-content');
    var providerBtns = document.querySelectorAll('.provider-btn');

    // Navigation
    var navItems = document.querySelectorAll('.nav-item');
    var contentTitle = document.getElementById('content-title');
    var contentDescription = document.getElementById('content-description');
    var presetCardsContainer = document.getElementById('preset-cards');
    var quickTags = document.getElementById('quick-tags');

    // Config
    var providerSelect = document.getElementById('provider-select');
    var variableInput = document.getElementById('variable-name');

    // Filters - General
    var generalFilters = document.getElementById('general-filters');
    var filterCategory = document.getElementById('filter-category');
    var filterLimit = document.getElementById('filter-limit');
    var filterSort = document.getElementById('filter-sort');
    var resetFilters = document.getElementById('reset-filters');

    // Filters - Podcast
    var podcastFilters = document.getElementById('podcast-filters');
    var podcastContentType = document.getElementById('podcast-content-type');
    var podcastAccess = document.getElementById('podcast-access');
    var podcastLimit = document.getElementById('podcast-limit');
    var podcastSort = document.getElementById('podcast-sort');
    var podcastDateFilter = document.getElementById('podcast-date-filter');
    var resetPodcastFilters = document.getElementById('reset-podcast-filters');
    var seriesList = document.getElementById('series-list');
    var seriesLabel = document.getElementById('series-label');
    var seriesSearch = document.getElementById('series-search');
    var seriesSelectedCount = document.getElementById('series-selected-count');
    var selectedCountText = document.getElementById('selected-count-text');
    var modeInfo = document.getElementById('mode-info');
    var modeBtns = document.querySelectorAll('.mode-btn');

    // Preview
    var previewContent = document.getElementById('preview-content');
    var previewCount = document.getElementById('preview-count');
    var previewStatus = document.getElementById('preview-status');

    // Output
    var templateList = document.getElementById('template-list');
    var connectedSubtitle = document.getElementById('connected-subtitle');
    var liquidSubtitle = document.getElementById('liquid-subtitle');

    // Buttons
    var copyConnectedBtn = document.getElementById('copy-connected');
    var viewConnectedBtn = document.getElementById('view-connected');
    var copyLiquidBtn = document.getElementById('copy-liquid');
    var viewLiquidBtn = document.getElementById('view-liquid');
    var copyAllBtn = document.getElementById('copy-all');
    var viewAllBtn = document.getElementById('view-all');

    // Modal
    var modalOverlay = document.getElementById('code-modal');
    var modalTitle = document.getElementById('modal-title');
    var modalCode = document.getElementById('modal-code');
    var modalCodeLabel = document.getElementById('modal-code-label');
    var modalCopyBtn = document.getElementById('modal-copy');
    var modalCloseBtn = document.getElementById('modal-close');
    var modalTabs = document.querySelectorAll('.modal-tab');

    // Tooltip
    var tooltip = document.getElementById('tooltip');
    var toast = document.getElementById('toast');

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
    // PROVIDER NAMES
    // ============================================

    var providerNames = {
        'vgtv': 'VG/VGTV',
        'ap': 'Aftenposten',
        'bt': 'Bergens Tidende',
        'aftenbladet': 'Stavanger Aftenblad',
        'e24': 'E24',
        'ab': 'Aftonbladet',
        'svd': 'Svenska Dagbladet',
        'podme': 'Podme'
    };

    // ============================================
    // CURRENT STATE
    // ============================================

    var currentContentType = 'live';
    var currentMode = 'single';
    var currentTemplate = null;
    var selectedSeries = [];
    var seriesData = [];
    var generatedConnectedContent = '';
    var generatedLiquidCode = '';
    var previewDebounceTimer = null;
    var isProviderSelected = false;

    // ============================================
    // DYNAMIC ISLAND
    // ============================================

    function updateIsland() {
        var provider = providerSelect.value;

        if (!provider) {
            islandText.textContent = 'Select a provider to begin';
            islandDot.className = 'island-dot';
            dynamicIsland.classList.remove('expanded');
            return;
        }

        var providerName = providerNames[provider] || provider;
        var contentType = contentTypes[currentContentType];
        var parts = [];

        parts.push('📡 ' + providerName);
        parts.push(contentType.title);

        if (currentContentType === 'podcasts') {
            if (currentMode === 'digest') {
                parts.push('Digest Mode');
                if (selectedSeries.length > 0) {
                    parts.push(selectedSeries.length + ' selected');
                }
            } else if (selectedSeries.length > 0) {
                parts.push(selectedSeries[0].title);
            }
        }

        islandText.textContent = parts.join('  •  ');
        islandDot.className = 'island-dot active';
        dynamicIsland.classList.add('expanded');
    }

    function setIslandLoading(loading) {
        if (loading) {
            islandDot.className = 'island-dot loading';
        } else {
            islandDot.className = 'island-dot active';
        }
    }

    // ============================================
    // WELCOME STATE & PROVIDER SELECTION
    // ============================================

    function showBuilder() {
        welcomeState.classList.add('hidden');
        builderContent.classList.remove('hidden');
        isProviderSelected = true;
        updateIsland();
        triggerAutoPreview();
    }

    // Welcome screen provider buttons
    providerBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var provider = this.dataset.provider;

            if (provider === 'more') {
                // Show all providers modal or expand
                showBuilder();
                providerSelect.focus();
                return;
            }

            providerSelect.value = provider;
            showBuilder();
            loadSeriesForProvider(provider);
        });
    });

    // Main provider dropdown
    providerSelect.addEventListener('change', function () {
        var provider = this.value;

        if (provider && !isProviderSelected) {
            showBuilder();
        }

        if (provider) {
            loadSeriesForProvider(provider);
        } else {
            seriesData = [];
            selectedSeries = [];
            renderSeriesList([]);
        }

        updateIsland();
        updateGeneratedCode();
        triggerAutoPreview();
    });

    // ============================================
    // AUTO-LOAD SERIES (FIXED - uses metadata detection)
    // ============================================

    function loadSeriesForProvider(provider) {
        if (!provider) return;

        // Show loading state
        seriesList.innerHTML = '<div class="series-loading"><div class="loading-spinner"></div><p>Loading podcasts...</p></div>';

        // Fetch ALL categories - don't filter by isSeries (many podcasts have isSeries:false)
        var url = 'https://svp.vg.no/svp/api/v1/' + provider + '/categories?appName=braze_content&limit=500';

        fetch(url)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to fetch');
                return response.json();
            })
            .then(function (data) {
                var allCategories = data._embedded ? data._embedded.categories : [];

                // Filter client-side: keep only categories with podcast metadata
                // Real podcasts have podcast_author or podcast_type in their metadata
                seriesData = allCategories.filter(function (cat) {
                    if (!cat.additional || !cat.additional.metadata) return false;
                    var meta = cat.additional.metadata;
                    // Check for podcast-specific metadata fields
                    return meta.podcast_author || meta.podcast_type || meta.podcast_acast_showId;
                });

                console.log('Categories fetched:', allCategories.length, '| Podcasts found:', seriesData.length);

                renderSeriesList(seriesData);

                if (seriesData.length > 0) {
                    showToast('Loaded ' + seriesData.length + ' podcast series');
                } else if (allCategories.length > 0) {
                    showToast('No podcasts found for this provider');
                }
            })
            .catch(function (error) {
                console.error('Error fetching series:', error);
                seriesList.innerHTML = '<div class="series-empty"><p>Could not load series. Check provider and try again.</p></div>';
            });
    }

    // ============================================
    // NAVIGATION
    // ============================================

    navItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var type = this.dataset.type;

            navItems.forEach(function (nav) {
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

                // Auto-load series if provider is selected
                if (providerSelect.value) {
                    loadSeriesForProvider(providerSelect.value);
                }
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
            updateIsland();
            updateGeneratedCode();
            renderTemplateList();
            triggerAutoPreview();
        });
    });

    // ============================================
    // MODE TOGGLE (Single / Digest)
    // ============================================

    modeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            modeBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            currentMode = this.dataset.mode;
            updateModeUI();
            updateIsland();
            updateGeneratedCode();
            renderTemplateList();
            triggerAutoPreview();
        });
    });

    function updateModeUI() {
        if (currentMode === 'digest') {
            modeInfo.innerHTML = '<div class="mode-info-icon">📰</div><div class="mode-info-text"><strong>Digest Mode:</strong> Select multiple podcasts to create a "released this week" roundup. Each podcast gets its own API call.</div>';
            seriesLabel.textContent = 'SELECT PODCASTS (Multi-select)';
            podcastLimit.value = 1;
            seriesSelectedCount.classList.remove('hidden');
            updateSelectedCount();
        } else {
            modeInfo.innerHTML = '<div class="mode-info-icon">💡</div><div class="mode-info-text"><strong>Single Podcast Mode:</strong> Fetch episodes from one podcast. Perfect for automated "new episode" emails.</div>';
            seriesLabel.textContent = 'SELECT PODCAST SERIES';
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
        presets.forEach(function (preset, index) {
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
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                cards.forEach(function (c) { c.classList.remove('active'); });
                this.classList.add('active');

                var preset = this.dataset.preset;
                applyPreset(preset);
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

        switch (preset) {
            case 'latest-single':
                currentMode = 'single';
                podcastLimit.value = 1;
                podcastSort.value = '-published';
                updateModeToggle('single');
                showToast('Set to fetch 1 latest episode');
                break;

            case 'weekly-digest':
                currentMode = 'digest';
                podcastLimit.value = 1;
                podcastDateFilter.value = '7';
                updateModeToggle('digest');
                showToast('Digest mode - select podcasts below');
                break;

            case 'episodes':
                podcastContentType.value = 'episodes';
                break;

            case 'latest':
                podcastLimit.value = 10;
                break;
        }

        updateModeUI();
        updateIsland();
        renderTemplateList();
        updateGeneratedCode();
        triggerAutoPreview();
    }

    function updateModeToggle(mode) {
        modeBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }

    // ============================================
    // SERIES LIST
    // ============================================

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

        categories.forEach(function (cat) {
            var isSelected = selectedSeries.some(function (s) { return s.id === cat.id; });

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
        items.forEach(function (item) {
            item.addEventListener('click', function (e) {
                var id = this.dataset.id;
                var title = this.dataset.title;
                var checkbox = this.querySelector('input');

                if (currentMode === 'digest') {
                    if (id) {
                        checkbox.checked = !checkbox.checked;
                        this.classList.toggle('selected', checkbox.checked);

                        if (checkbox.checked) {
                            selectedSeries.push({ id: id, title: title });
                        } else {
                            selectedSeries = selectedSeries.filter(function (s) { return s.id !== id; });
                        }

                        updateSelectedCount();
                    }
                } else {
                    items.forEach(function (i) { i.classList.remove('selected'); });
                    this.classList.add('selected');
                    checkbox.checked = true;

                    if (id) {
                        selectedSeries = [{ id: id, title: title }];
                    } else {
                        selectedSeries = [];
                    }
                }

                updateIsland();
                updateGeneratedCode();
                triggerAutoPreview();
            });
        });
    }

    // Series search
    seriesSearch.addEventListener('input', function () {
        var query = this.value.toLowerCase();
        var items = seriesList.querySelectorAll('.series-item');

        items.forEach(function (item) {
            var title = item.dataset.title.toLowerCase();
            if (title.includes(query) || query === '') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });

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

        var isFirst = true;
        templateGroups.forEach(function (group) {
            group.templates.forEach(function (tmpl) {
                var activeClass = isFirst ? ' active' : '';
                var recommendedClass = tmpl.recommended ? ' recommended' : '';

                if (isFirst) {
                    currentTemplate = tmpl;
                    isFirst = false;
                }

                html += '<div class="template-item' + activeClass + recommendedClass + '" data-template-id="' + tmpl.id + '">';
                html += '<div class="template-title">' + tmpl.title;
                if (tmpl.recommended) {
                    html += ' <span class="template-recommended-badge">BEST</span>';
                }
                html += '</div>';
                html += '<div class="template-desc">' + tmpl.desc + '</div>';
                html += '</div>';
            });
        });

        templateList.innerHTML = html;

        var items = templateList.querySelectorAll('.template-item');
        items.forEach(function (item) {
            item.addEventListener('click', function () {
                items.forEach(function (i) { i.classList.remove('active'); });
                this.classList.add('active');

                var templateId = this.dataset.templateId;
                currentTemplate = findTemplateById(templateId);
                updateGeneratedCode();
            });
        });

        updateGeneratedCode();
    }

    function findTemplateById(id) {
        var allTemplates = [].concat(
            templates.single,
            templates.list,
            templates.digest,
            templates.fallback
        );
        return allTemplates.find(function (t) { return t.id === id; }) || allTemplates[0];
    }

    // ============================================
    // CODE GENERATION
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

            if (podcastDateFilter.value) {
                var days = parseInt(podcastDateFilter.value);
                var since = Date.now() - (days * 24 * 60 * 60 * 1000);
                filters.push('published>' + since);
            }

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
                    activeTags.forEach(function (tag) {
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
            generatedConnectedContent = '// Select a provider to generate code';
            generatedLiquidCode = '// Select a provider to generate code';
            connectedSubtitle.textContent = 'Select a provider first';
            liquidSubtitle.textContent = 'Select a provider first';
            return;
        }

        // Generate Connected Content
        if (currentContentType === 'podcasts' && currentMode === 'digest' && selectedSeries.length > 0) {
            var code = '';
            selectedSeries.forEach(function (series, index) {
                var seriesVarName = 'podcast_' + (index + 1);
                var url = buildUrl(series.id);
                code += '{% connected_content ' + url + ' :save ' + seriesVarName + ' %}\n';
            });
            generatedConnectedContent = code.trim();
            connectedSubtitle.textContent = selectedSeries.length + ' API calls ready';
        } else {
            var seriesId = currentMode === 'single' && selectedSeries.length > 0
                ? selectedSeries[0].id
                : null;
            var url = buildUrl(seriesId);
            generatedConnectedContent = '{% connected_content ' + url + ' :save ' + varName + ' %}';
            connectedSubtitle.textContent = '1 API call ready';
        }

        // Generate Liquid Code
        if (!currentTemplate) {
            generatedLiquidCode = '// Select a template';
            liquidSubtitle.textContent = 'Select a template';
            return;
        }

        if (currentMode === 'digest' && selectedSeries.length > 0) {
            generatedLiquidCode = generateDigestTemplate();
            liquidSubtitle.textContent = 'Digest template ready';
        } else {
            generatedLiquidCode = currentTemplate.code.replace(/VAR/g, varName);
            liquidSubtitle.textContent = currentTemplate.title + ' ready';
        }
    }

    function generateDigestTemplate() {
        if (selectedSeries.length === 0) {
            return '<!-- Select podcasts to generate digest template -->';
        }

        var isGrouped = currentTemplate && currentTemplate.id === 'digest-grouped';
        var code = '';

        if (isGrouped) {
            selectedSeries.forEach(function (series, index) {
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
            code += '<h2 style="margin: 0 0 16px 0;">🎧 This Week\'s Episodes</h2>\n\n';

            selectedSeries.forEach(function (series, index) {
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

    function getCompleteCode() {
        return generatedConnectedContent + '\n\n' + generatedLiquidCode;
    }

    // ============================================
    // AUTO-PREVIEW
    // ============================================

    function triggerAutoPreview() {
        if (!providerSelect.value) return;

        // Clear existing timer
        if (previewDebounceTimer) {
            clearTimeout(previewDebounceTimer);
        }

        // Show loading state
        setPreviewLoading(true);

        // Debounce - wait 600ms after last change
        previewDebounceTimer = setTimeout(function () {
            loadPreview();
        }, 600);
    }

    function setPreviewLoading(loading) {
        if (loading) {
            previewStatus.classList.add('loading');
            previewStatus.querySelector('.preview-status-text').textContent = 'Updating...';
        } else {
            previewStatus.classList.remove('loading');
            previewStatus.querySelector('.preview-status-text').textContent = 'Auto-updates';
        }
    }

    function loadPreview() {
        var provider = providerSelect.value;
        if (!provider) {
            previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">📡</div><p>Select a provider to see preview</p></div>';
            setPreviewLoading(false);
            return;
        }

        setIslandLoading(true);

        if (currentMode === 'digest' && selectedSeries.length > 0) {
            var promises = selectedSeries.map(function (series) {
                var url = buildUrl(series.id);
                return fetch(url)
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        return { series: series, data: data };
                    });
            });

            Promise.all(promises)
                .then(function (results) {
                    renderDigestPreview(results);
                })
                .catch(function (error) {
                    console.error('Preview error:', error);
                    previewContent.innerHTML = '<div class="preview-error">Failed to load preview.</div>';
                })
                .finally(function () {
                    setPreviewLoading(false);
                    setIslandLoading(false);
                });
        } else {
            var seriesId = selectedSeries.length > 0 ? selectedSeries[0].id : null;
            var url = buildUrl(seriesId);

            fetch(url)
                .then(function (response) {
                    if (!response.ok) throw new Error('API request failed');
                    return response.json();
                })
                .then(function (data) {
                    renderPreview(data);
                })
                .catch(function (error) {
                    console.error('Preview error:', error);
                    previewContent.innerHTML = '<div class="preview-error">Failed to load preview.</div>';
                    previewCount.textContent = '';
                })
                .finally(function () {
                    setPreviewLoading(false);
                    setIslandLoading(false);
                });
        }
    }

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

        results.forEach(function (result) {
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

        previewCount.textContent = totalCount + ' episode' + (totalCount !== 1 ? 's' : '') + ' from ' + results.length + ' podcasts';
        previewContent.innerHTML = html;
    }

    function renderAssetList(assets) {
        var html = '';

        assets.forEach(function (asset) {
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

    // ============================================
    // QUICK TAGS (Sports)
    // ============================================

    var quickTagButtons = document.querySelectorAll('.quick-tag');
    quickTagButtons.forEach(function (tag) {
        tag.addEventListener('click', function () {
            this.classList.toggle('active');
            updateGeneratedCode();
            triggerAutoPreview();
        });
    });

    // ============================================
    // RESET FILTERS
    // ============================================

    resetFilters.addEventListener('click', function () {
        filterCategory.value = '';
        filterLimit.value = 10;
        filterSort.value = '-published';
        document.querySelectorAll('.quick-tag').forEach(function (tag) {
            tag.classList.remove('active');
        });
        updateGeneratedCode();
        triggerAutoPreview();
        showToast('Filters reset');
    });

    resetPodcastFilters.addEventListener('click', function () {
        podcastContentType.value = '';
        podcastAccess.value = '';
        podcastLimit.value = 10;
        podcastSort.value = '-published';
        podcastDateFilter.value = '';
        selectedSeries = [];
        currentMode = 'single';
        seriesSearch.value = '';

        updateModeToggle('single');
        updateModeUI();

        if (seriesData.length > 0) {
            renderSeriesList(seriesData);
        }

        updateIsland();
        updateGeneratedCode();
        renderTemplateList();
        triggerAutoPreview();
        showToast('Podcast filters reset');
    });

    // ============================================
    // INPUT CHANGE HANDLERS (with auto-preview)
    // ============================================

    variableInput.addEventListener('input', function () {
        updateGeneratedCode();
    });

    filterLimit.addEventListener('input', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    filterSort.addEventListener('change', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    filterCategory.addEventListener('change', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    podcastContentType.addEventListener('change', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    podcastAccess.addEventListener('change', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    podcastLimit.addEventListener('input', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    podcastSort.addEventListener('change', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    podcastDateFilter.addEventListener('change', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    // ============================================
    // COPY BUTTONS
    // ============================================

    copyConnectedBtn.addEventListener('click', function () {
        copyToClipboard(generatedConnectedContent);
    });

    copyLiquidBtn.addEventListener('click', function () {
        copyToClipboard(generatedLiquidCode);
    });

    copyAllBtn.addEventListener('click', function () {
        copyToClipboard(getCompleteCode());
    });

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function () {
            showToast('Copied to clipboard!');
        }).catch(function (err) {
            console.error('Copy failed:', err);
            showToast('Failed to copy');
        });
    }

    // ============================================
    // MODAL
    // ============================================

    var currentModalTab = 'connected';

    function openModal(tab) {
        currentModalTab = tab || 'connected';
        updateModalContent();
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Update tab state
        modalTabs.forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === currentModalTab);
        });
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function updateModalContent() {
        switch (currentModalTab) {
            case 'connected':
                modalTitle.textContent = 'Connected Content Code';
                modalCodeLabel.textContent = 'CONNECTED CONTENT';
                modalCode.textContent = generatedConnectedContent;
                break;
            case 'liquid':
                modalTitle.textContent = 'Liquid Template Code';
                modalCodeLabel.textContent = 'LIQUID TEMPLATE';
                modalCode.textContent = generatedLiquidCode;
                break;
            case 'complete':
                modalTitle.textContent = 'Complete Code';
                modalCodeLabel.textContent = 'CONNECTED CONTENT + LIQUID TEMPLATE';
                modalCode.textContent = getCompleteCode();
                break;
        }
    }

    viewConnectedBtn.addEventListener('click', function () {
        openModal('connected');
    });

    viewLiquidBtn.addEventListener('click', function () {
        openModal('liquid');
    });

    viewAllBtn.addEventListener('click', function () {
        openModal('complete');
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    modalTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            modalTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentModalTab = this.dataset.tab;
            updateModalContent();
        });
    });

    modalCopyBtn.addEventListener('click', function () {
        var text = modalCode.textContent;
        copyToClipboard(text);
    });

    // ESC to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    // ============================================
    // TOOLTIPS
    // ============================================

    var infoBtns = document.querySelectorAll('.info-btn');

    infoBtns.forEach(function (btn) {
        btn.addEventListener('mouseenter', function (e) {
            var text = this.dataset.tooltip;
            if (!text) return;

            tooltip.textContent = text;
            tooltip.classList.add('visible');

            var rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 8) + 'px';
        });

        btn.addEventListener('mouseleave', function () {
            tooltip.classList.remove('visible');
        });
    });

    // ============================================
    // UTILITIES
    // ============================================

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(function () {
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
    updateIsland();

    console.log('SVP Builder v6.1 initialized');
    console.log('Fixed: Podcast detection now uses metadata instead of isSeries flag');

});