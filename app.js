// SVP Builder v7.0 - Sports Events Update
// Features: Live sports filtering, tag-based sport filtering, time-based queries
// Supports: VGTV (Norway) and AB/Aftonbladet (Sweden) for sports content

document.addEventListener('DOMContentLoaded', function () {

    console.log('SVP Builder v7.0 loading...');

    // ============================================
    // ELEMENT REFERENCES
    // ============================================

    // Navigation
    var navItems = document.querySelectorAll('.nav-item');
    var contentTitle = document.getElementById('content-title');
    var contentDescription = document.getElementById('content-description');
    var presetCardsContainer = document.getElementById('preset-cards');

    // Config
    var providerSelect = document.getElementById('provider-select');
    var providerHint = document.getElementById('provider-hint');
    var variableInput = document.getElementById('variable-name');

    // Filters - General
    var generalFilters = document.getElementById('general-filters');
    var filterCategory = document.getElementById('filter-category');
    var filterLimit = document.getElementById('filter-limit');
    var filterSort = document.getElementById('filter-sort');
    var resetFilters = document.getElementById('reset-filters');

    // Filters - Sports
    var sportsFilters = document.getElementById('sports-filters');
    var sportsInfo = document.getElementById('sports-info');
    var timeBtns = document.querySelectorAll('.time-btn');
    var sportsLimit = document.getElementById('sports-limit');
    var sportsSort = document.getElementById('sports-sort');
    var loadSportTagsBtn = document.getElementById('load-sport-tags');
    var sportTagsList = document.getElementById('sport-tags-list');
    var selectedTagsCount = document.getElementById('selected-tags-count');
    var tagsCountText = document.getElementById('tags-count-text');
    var clearTagsBtn = document.getElementById('clear-tags');
    var resetSportsFilters = document.getElementById('reset-sports-filters');

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
    var fetchSeriesBtn = document.getElementById('fetch-series');

    // Preview
    var previewContent = document.getElementById('preview-content');
    var previewCount = document.getElementById('preview-count');
    var previewBtn = document.getElementById('load-preview');

    // Output
    var outputTabs = document.querySelectorAll('.output-tab');
    var panelConnected = document.getElementById('panel-connected');
    var panelLiquid = document.getElementById('panel-liquid');
    var templateList = document.getElementById('template-list');
    var brazeCode = document.getElementById('braze-code');
    var readableUrl = document.getElementById('readable-url');
    var liquidCode = document.getElementById('liquid-code');

    // Toast
    var toast = document.getElementById('toast');

    // ============================================
    // CONTENT TYPE CONFIGURATIONS
    // ============================================

    var contentTypes = {
        live: {
            title: 'Live Content',
            description: 'Fetch currently live streams and broadcasts',
            filter: 'streamType::live',
            showSportsFilters: false,
            presets: [
                { icon: '🔴', title: 'All Live Now', desc: 'Everything currently streaming', preset: 'all' },
                { icon: '🔄', title: 'Recently Ended', desc: 'Last 24 hours', preset: 'recent' },
                { icon: '📅', title: 'Starting Soon', desc: 'Next 3 hours', preset: 'soon' }
            ]
        },
        sports: {
            title: 'Sports Events',
            description: 'Live and upcoming sports matches from VGTV & Aftonbladet',
            filter: 'streamType::live|additional.metadata.contentType::liveSports',
            showSportsFilters: true,
            presets: [
                { icon: '🔴', title: 'Live Now', desc: 'Currently playing', preset: 'live', featured: true },
                { icon: '📅', title: 'Today\'s Matches', desc: 'All matches today', preset: 'today' },
                { icon: '📆', title: 'This Week', desc: 'Next 7 days', preset: 'week' },
                { icon: '⏰', title: 'Upcoming', desc: 'All scheduled', preset: 'upcoming' }
            ]
        },
        podcasts: {
            title: 'Podcasts',
            description: 'Audio podcasts and episodes',
            filter: 'assetType::audio',
            showSportsFilters: false,
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
            showSportsFilters: false,
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
            showSportsFilters: false,
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
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign episode = VAR._embedded.assets[0] %}\n<div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; max-width: 500px;">\n  <img src="{{episode.images.main}}?t[]=500x280q80" style="width: 100%; display: block;">\n  <div style="padding: 20px;">\n    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">🎙️ New Episode</p>\n    <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #111827;">{{episode.title}}</h2>\n    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.5;">{{episode.description | truncate: 150}}</p>\n    <p style="margin: 0 0 16px 0; color: #9ca3af; font-size: 13px;">⏱️ {{episode.duration | divided_by: 60000}} min</p>\n    <a href="#" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Listen Now →</a>\n  </div>\n</div>\n{% else %}\n<p>No new episodes available.</p>\n{% endif %}'
            },
            {
                id: 'single-simple',
                title: 'Simple Text',
                desc: 'Title and description only',
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign item = VAR._embedded.assets[0] %}\n<h2>{{item.title}}</h2>\n<p>{{item.description}}</p>\n{% endif %}'
            }
        ],
        list: [
            {
                id: 'list-cards',
                title: 'Card List',
                desc: 'Visual cards with images',
                code: '{% for item in VAR._embedded.assets %}\n<div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; border: 1px solid #eee; border-radius: 8px;">\n  <img src="{{item.images.main}}?t[]=80x80q80" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">\n  <div>\n    <h4 style="margin: 0 0 4px 0; color: #111;">{{item.title}}</h4>\n    <p style="margin: 0; color: #666; font-size: 14px;">{{item.category.title}}</p>\n    <small style="color: #999;">{{item.duration | divided_by: 60000}} min</small>\n  </div>\n</div>\n{% endfor %}'
            },
            {
                id: 'list-simple',
                title: 'Simple List',
                desc: 'Bullet points',
                code: '<ul>\n{% for item in VAR._embedded.assets %}\n  <li>{{item.title}}</li>\n{% endfor %}\n</ul>'
            }
        ],
        sports: [
            {
                id: 'sports-match-card',
                title: 'Sports Match Card',
                desc: 'Perfect for upcoming match emails',
                recommended: true,
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign match = VAR._embedded.assets[0] %}\n<div style="border: 2px solid #10b981; border-radius: 12px; overflow: hidden; max-width: 500px; background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);">\n  <img src="{{match.images.main}}?t[]=500x280q80" style="width: 100%; display: block;">\n  <div style="padding: 20px;">\n    <p style="margin: 0 0 8px 0; color: #059669; font-size: 14px; font-weight: 600;">⚽ LIVE SPORTS</p>\n    <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #111827;">{{match.title}}</h2>\n    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.5;">{{match.description | truncate: 150}}</p>\n    {% if match.flightTimes.start %}\n    <p style="margin: 0 0 16px 0; color: #059669; font-size: 14px;">📅 Kick-off: {{match.flightTimes.start | date: "%b %d, %H:%M"}}</p>\n    {% endif %}\n    <a href="{{match.additional.url}}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Watch Live →</a>\n  </div>\n</div>\n{% else %}\n<p>No upcoming matches.</p>\n{% endif %}'
            },
            {
                id: 'sports-list',
                title: 'Match List',
                desc: 'Multiple matches with kick-off times',
                code: '<h2 style="margin: 0 0 16px 0; color: #059669;">⚽ Upcoming Matches</h2>\n{% for match in VAR._embedded.assets %}\n<div style="display: flex; gap: 12px; margin-bottom: 12px; padding: 12px; border: 1px solid #a7f3d0; border-radius: 8px; background: #f0fdf4;">\n  <img src="{{match.images.main}}?t[]=80x60q80" style="width: 80px; height: 60px; border-radius: 6px; object-fit: cover;">\n  <div style="flex: 1;">\n    <h4 style="margin: 0 0 4px 0; color: #111;">{{match.title}}</h4>\n    {% if match.flightTimes.start %}\n    <p style="margin: 0; color: #059669; font-size: 13px;">📅 {{match.flightTimes.start | date: "%b %d, %H:%M"}}</p>\n    {% endif %}\n  </div>\n</div>\n{% endfor %}'
            },
            {
                id: 'sports-live-banner',
                title: 'Live Now Banner',
                desc: 'Highlight currently live match',
                code: '{% if VAR._embedded.assets.size > 0 %}\n{% assign match = VAR._embedded.assets[0] %}\n<div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 12px; padding: 20px; color: white;">\n  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">\n    <span style="display: inline-block; width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 1.5s infinite;"></span>\n    <span style="font-weight: 600; font-size: 14px;">LIVE NOW</span>\n  </div>\n  <h2 style="margin: 0 0 8px 0; font-size: 22px;">{{match.title}}</h2>\n  <p style="margin: 0 0 16px 0; opacity: 0.9;">{{match.description | truncate: 100}}</p>\n  <a href="{{match.additional.url}}" style="display: inline-block; padding: 12px 24px; background: white; color: #dc2626; text-decoration: none; border-radius: 8px; font-weight: 600;">Watch Now →</a>\n</div>\n<style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }</style>\n{% endif %}'
            }
        ],
        digest: [
            {
                id: 'digest-combined',
                title: 'Weekly Digest',
                desc: 'All podcasts in one list',
                recommended: true,
                code: '<!-- DIGEST_TEMPLATE -->'
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
    // PROVIDER CONFIGURATION
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

    // Providers that have live sports content
    var sportsProviders = ['vgtv', 'ab'];

    // ============================================
    // CURRENT STATE
    // ============================================

    var currentContentType = 'live';
    var currentMode = 'single'; // for podcasts
    var currentTimeFilter = 'live'; // for sports
    var currentTemplate = null;
    var selectedSeries = [];
    var selectedSportTags = [];
    var seriesData = [];
    var sportTagsData = [];
    var generatedConnectedContent = '';
    var generatedLiquidCode = '';
    var previewDebounceTimer = null;

    // ============================================
    // NAVIGATION
    // ============================================

    navItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var type = this.dataset.type;

            navItems.forEach(function (nav) { nav.classList.remove('active'); });
            this.classList.add('active');

            currentContentType = type;
            var config = contentTypes[type];

            contentTitle.textContent = config.title;
            contentDescription.textContent = config.description;

            renderPresetCards(config.presets);

            // Show/hide appropriate filter sections
            generalFilters.classList.add('hidden');
            sportsFilters.classList.add('hidden');
            podcastFilters.classList.add('hidden');

            if (type === 'sports') {
                sportsFilters.classList.remove('hidden');
                updateSportsProviderHint();
            } else if (type === 'podcasts') {
                podcastFilters.classList.remove('hidden');
                if (providerSelect.value) {
                    loadSeriesForProvider(providerSelect.value);
                }
            } else {
                generalFilters.classList.remove('hidden');
            }

            // Reset state
            selectedSportTags = [];
            updateSelectedTagsCount();
            updateGeneratedCode();
            renderTemplateList();
            triggerAutoPreview();
        });
    });

    // ============================================
    // PROVIDER SELECTION
    // ============================================

    providerSelect.addEventListener('change', function () {
        var provider = this.value;

        // Clear selections when switching providers
        selectedSeries = [];
        selectedSportTags = [];
        sportTagsData = [];
        updateSelectedCount();
        updateSelectedTagsCount();

        if (provider) {
            if (currentContentType === 'podcasts') {
                loadSeriesForProvider(provider);
            } else if (currentContentType === 'sports') {
                updateSportsProviderHint();
                // Clear sport tags when provider changes
                sportTagsList.innerHTML = '<div class="sport-tags-empty"><p>Click "Load Tags" to see available sports</p></div>';
            }
        } else {
            seriesData = [];
            renderSeriesList([]);
            sportTagsList.innerHTML = '<div class="sport-tags-empty"><p>Select a provider first</p></div>';
        }

        updateGeneratedCode();
        triggerAutoPreview();
    });

    function updateSportsProviderHint() {
        var provider = providerSelect.value;
        if (currentContentType === 'sports') {
            if (provider && sportsProviders.includes(provider)) {
                providerHint.textContent = '✓ This provider has live sports';
                providerHint.style.color = '#10B981';
            } else if (provider) {
                providerHint.textContent = '⚠️ Limited sports content - try VGTV or Aftonbladet';
                providerHint.style.color = '#F59E0B';
            } else {
                providerHint.textContent = '';
            }
        } else {
            providerHint.textContent = '';
        }
    }

    // ============================================
    // PRESET CARDS
    // ============================================

    function renderPresetCards(presets) {
        var html = '';
        presets.forEach(function (preset, index) {
            var activeClass = index === 0 ? ' active' : '';
            var featuredClass = preset.featured ? ' featured' : '';
            var sportsClass = currentContentType === 'sports' ? ' sports-card' : '';

            html += '<div class="preset-card' + activeClass + featuredClass + sportsClass + '" data-preset="' + preset.preset + '">';
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
                applyPreset(this.dataset.preset);
            });
        });
    }

    function applyPreset(preset) {
        if (currentContentType === 'sports') {
            applySportsPreset(preset);
        } else if (currentContentType === 'podcasts') {
            applyPodcastPreset(preset);
        }
        updateGeneratedCode();
        triggerAutoPreview();
    }

    function applySportsPreset(preset) {
        // Update time filter based on preset
        currentTimeFilter = preset;
        timeBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.time === preset);
        });
    }

    function applyPodcastPreset(preset) {
        podcastContentType.value = '';
        podcastAccess.value = '';
        podcastSort.value = '-published';
        podcastDateFilter.value = '';

        switch (preset) {
            case 'latest-single':
                currentMode = 'single';
                podcastLimit.value = 1;
                updateModeToggle('single');
                break;
            case 'weekly-digest':
                currentMode = 'digest';
                podcastLimit.value = 1;
                podcastDateFilter.value = '7';
                updateModeToggle('digest');
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

    // ============================================
    // SPORTS: TIME FILTER
    // ============================================

    timeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            timeBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentTimeFilter = this.dataset.time;
            updateGeneratedCode();
            triggerAutoPreview();
        });
    });

    // ============================================
    // SPORTS: LOAD TAGS
    // ============================================

    loadSportTagsBtn.addEventListener('click', function () {
        var provider = providerSelect.value;
        if (!provider) {
            showToast('Please select a provider first');
            return;
        }
        loadSportTags(provider);
    });

    function loadSportTags(provider) {
        loadSportTagsBtn.classList.add('loading');
        loadSportTagsBtn.disabled = true;

        // First, fetch some sports assets to discover which tags are actually used
        var url = 'https://svp.vg.no/svp/api/v1/' + provider + '/search?appName=svpBuilder&filter=streamType::live|additional.metadata.contentType::liveSports&limit=50&additional=settings,metadata,tags';

        fetch(url)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to fetch');
                return response.json();
            })
            .then(function (data) {
                var assets = data._embedded && data._embedded.assets ? data._embedded.assets : [];

                // Extract unique tags from assets
                var tagMap = {};
                assets.forEach(function (asset) {
                    if (asset._embedded && asset._embedded.tags) {
                        asset._embedded.tags.forEach(function (tag) {
                            if (!tagMap[tag.id]) {
                                tagMap[tag.id] = { id: tag.id, name: tag.tag, count: 0 };
                            }
                            tagMap[tag.id].count++;
                        });
                    }
                });

                // Convert to array and sort by count
                sportTagsData = Object.values(tagMap).sort(function (a, b) {
                    return b.count - a.count;
                });

                renderSportTags(sportTagsData);

                if (sportTagsData.length > 0) {
                    showToast('Loaded ' + sportTagsData.length + ' sport tags');
                } else {
                    showToast('No sport tags found');
                }
            })
            .catch(function (error) {
                console.error('Error fetching sport tags:', error);
                sportTagsList.innerHTML = '<div class="sport-tags-empty"><p>Failed to load tags. Try again.</p></div>';
            })
            .finally(function () {
                loadSportTagsBtn.classList.remove('loading');
                loadSportTagsBtn.disabled = false;
            });
    }

    function renderSportTags(tags) {
        if (!tags || tags.length === 0) {
            sportTagsList.innerHTML = '<div class="sport-tags-empty"><p>No sport tags found for this provider</p></div>';
            return;
        }

        var html = '';
        tags.forEach(function (tag) {
            var isSelected = selectedSportTags.some(function (t) { return t.id === tag.id; });
            var activeClass = isSelected ? ' active' : '';
            var icon = getSportIcon(tag.name);

            html += '<button class="sport-tag' + activeClass + '" data-id="' + tag.id + '" data-name="' + escapeHtml(tag.name) + '">';
            html += '<span class="sport-tag-icon">' + icon + '</span>';
            html += '<span>' + escapeHtml(tag.name) + '</span>';
            if (tag.count > 1) {
                html += '<span class="sport-tag-count">(' + tag.count + ')</span>';
            }
            html += '</button>';
        });

        sportTagsList.innerHTML = html;

        // Attach click handlers
        var tagBtns = sportTagsList.querySelectorAll('.sport-tag');
        tagBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = this.dataset.id;
                var name = this.dataset.name;

                this.classList.toggle('active');

                if (this.classList.contains('active')) {
                    selectedSportTags.push({ id: id, name: name });
                } else {
                    selectedSportTags = selectedSportTags.filter(function (t) { return t.id !== id; });
                }

                updateSelectedTagsCount();
                updateGeneratedCode();
                triggerAutoPreview();
            });
        });
    }

    function getSportIcon(name) {
        var lowerName = name.toLowerCase();
        if (lowerName.includes('fotball') || lowerName.includes('football') || lowerName.includes('soccer')) return '⚽';
        if (lowerName.includes('hockey') || lowerName.includes('ishockey')) return '🏒';
        if (lowerName.includes('handball') || lowerName.includes('håndball')) return '🤾';
        if (lowerName.includes('basketball')) return '🏀';
        if (lowerName.includes('tennis')) return '🎾';
        if (lowerName.includes('golf')) return '⛳';
        if (lowerName.includes('ski') || lowerName.includes('langrenn')) return '⛷️';
        if (lowerName.includes('premier league')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
        if (lowerName.includes('allsvenskan')) return '🇸🇪';
        if (lowerName.includes('eliteserien')) return '🇳🇴';
        if (lowerName.includes('champions')) return '🏆';
        if (lowerName.includes('coppa')) return '🏆';
        return '🏅';
    }

    function updateSelectedTagsCount() {
        var count = selectedSportTags.length;
        if (count > 0) {
            selectedTagsCount.classList.remove('hidden');
            tagsCountText.textContent = count + ' sport' + (count !== 1 ? 's' : '') + ' selected';
        } else {
            selectedTagsCount.classList.add('hidden');
        }
    }

    clearTagsBtn.addEventListener('click', function () {
        selectedSportTags = [];
        var tagBtns = sportTagsList.querySelectorAll('.sport-tag');
        tagBtns.forEach(function (btn) { btn.classList.remove('active'); });
        updateSelectedTagsCount();
        updateGeneratedCode();
        triggerAutoPreview();
    });

    resetSportsFilters.addEventListener('click', function () {
        currentTimeFilter = 'live';
        timeBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.time === 'live');
        });
        sportsLimit.value = 10;
        sportsSort.value = 'flightTimes.start';
        selectedSportTags = [];
        var tagBtns = sportTagsList.querySelectorAll('.sport-tag');
        tagBtns.forEach(function (btn) { btn.classList.remove('active'); });
        updateSelectedTagsCount();
        updateGeneratedCode();
        triggerAutoPreview();
    });

    // ============================================
    // PODCASTS: MODE TOGGLE
    // ============================================

    modeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            modeBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentMode = this.dataset.mode;
            updateModeUI();
            updateGeneratedCode();
            renderTemplateList();
            triggerAutoPreview();
        });
    });

    function updateModeToggle(mode) {
        modeBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }

    function updateModeUI() {
        if (currentMode === 'digest') {
            modeInfo.innerHTML = '<div class="mode-info-icon">📰</div><div class="mode-info-text"><strong>Digest Mode:</strong> Select multiple podcasts to create a "released this week" roundup.</div>';
            seriesLabel.textContent = 'SELECT PODCASTS (Multi-select)';
            seriesSelectedCount.classList.remove('hidden');
        } else {
            modeInfo.innerHTML = '<div class="mode-info-icon">💡</div><div class="mode-info-text"><strong>Single Podcast Mode:</strong> Fetch episodes from one podcast. Perfect for automated "new episode" emails.</div>';
            seriesLabel.textContent = 'SELECT PODCAST SERIES';
            seriesSelectedCount.classList.add('hidden');
        }

        if (seriesData.length > 0) {
            renderSeriesList(seriesData);
        }
        updateSelectedCount();
    }

    function updateSelectedCount() {
        var count = selectedSeries.length;
        selectedCountText.textContent = count + ' podcast' + (count !== 1 ? 's' : '') + ' selected';
    }

    // ============================================
    // PODCASTS: LOAD SERIES
    // ============================================

    fetchSeriesBtn.addEventListener('click', function () {
        var provider = providerSelect.value;
        if (provider) {
            loadSeriesForProvider(provider);
        } else {
            showToast('Please select a provider first');
        }
    });

    function loadSeriesForProvider(provider) {
        if (!provider) return;

        seriesList.innerHTML = '<div class="series-loading"><div class="loading-spinner"></div><p>Loading podcasts...</p></div>';

        var url = 'https://svp.vg.no/svp/api/v1/' + provider + '/categories?appName=svpBuilder&limit=500';

        fetch(url)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to fetch');
                return response.json();
            })
            .then(function (data) {
                var allCategories = data._embedded ? data._embedded.categories : [];

                // Filter for podcasts using metadata
                seriesData = allCategories.filter(function (cat) {
                    if (!cat.additional || !cat.additional.metadata) return false;
                    var meta = cat.additional.metadata;
                    return meta.podcast_author || meta.podcast_type || meta.podcast_acast_showId;
                });

                console.log('Categories fetched:', allCategories.length, '| Podcasts found:', seriesData.length);

                renderSeriesList(seriesData);

                if (seriesData.length > 0) {
                    showToast('Loaded ' + seriesData.length + ' podcast series');
                } else {
                    showToast('No podcasts found for this provider');
                }
            })
            .catch(function (error) {
                console.error('Error fetching series:', error);
                seriesList.innerHTML = '<div class="series-empty"><p>Could not load series. Try again.</p></div>';
            });
    }

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
            item.addEventListener('click', function () {
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

        if (currentContentType === 'sports') {
            templateGroups = [
                { name: 'Sports Templates', templates: templates.sports },
                { name: 'With Fallback', templates: templates.fallback }
            ];
        } else if (currentContentType === 'podcasts') {
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
            templates.sports,
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
        var params = ['appName=svpBuilder'];

        if (currentContentType === 'sports') {
            baseUrl += '/search';

            // Add live sports filters
            filters.push('streamType::live');
            filters.push('additional.metadata.contentType::liveSports');

            // Add time-based filtering
            var now = Date.now();
            switch (currentTimeFilter) {
                case 'live':
                    // Currently live - no additional time filter needed, just live streams
                    break;
                case 'today':
                    var endOfDay = new Date();
                    endOfDay.setHours(23, 59, 59, 999);
                    filters.push('flightTimes.start<' + endOfDay.getTime());
                    break;
                case 'week':
                    var weekFromNow = now + (7 * 24 * 60 * 60 * 1000);
                    filters.push('flightTimes.start<' + weekFromNow);
                    break;
                case 'upcoming':
                    filters.push('flightTimes.start>' + now);
                    break;
                // 'all' - no time filter
            }

            // Add tag filter if any selected
            if (selectedSportTags.length > 0) {
                var tagIds = selectedSportTags.map(function (t) { return t.id; }).join(',');
                filters.push('tagId<>' + tagIds);
            }

            params.push('limit=' + (sportsLimit.value || 10));
            params.push('sort=' + sportsSort.value);
            params.push('additional=settings,metadata,tags');

        } else if (currentContentType === 'podcasts') {
            if (seriesId) {
                baseUrl += '/categories/' + seriesId + '/assets';
            } else {
                baseUrl += '/search';
                filters.push('assetType::audio');
            }

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

            params.push('limit=' + (podcastLimit.value || 10));
            params.push('sort=' + podcastSort.value);
            params.push('additional=settings,metadata,access');

        } else {
            baseUrl += '/search';
            var config = contentTypes[currentContentType];

            if (config.filter) {
                config.filter.split('|').forEach(function (f) {
                    filters.push(f);
                });
            }

            if (filterCategory.value) {
                filters.push('categoryId::' + filterCategory.value);
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
            brazeCode.textContent = '// Select a provider to generate code';
            readableUrl.textContent = 'https://svp.vg.no/...';
            liquidCode.textContent = '// Select a provider to generate code';
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
            brazeCode.textContent = generatedConnectedContent;
            readableUrl.textContent = '(Multiple API calls - see above)';
        } else {
            var seriesId = currentContentType === 'podcasts' && selectedSeries.length > 0
                ? selectedSeries[0].id
                : null;
            var url = buildUrl(seriesId);
            generatedConnectedContent = '{% connected_content ' + url + ' :save ' + varName + ' %}';
            brazeCode.textContent = generatedConnectedContent;
            readableUrl.textContent = url || '';
        }

        // Generate Liquid Code
        if (!currentTemplate) {
            liquidCode.textContent = '// Select a template';
            return;
        }

        if (currentContentType === 'podcasts' && currentMode === 'digest' && selectedSeries.length > 0) {
            generatedLiquidCode = generateDigestTemplate();
        } else {
            generatedLiquidCode = currentTemplate.code.replace(/VAR/g, varName);
        }
        liquidCode.textContent = generatedLiquidCode;
    }

    function generateDigestTemplate() {
        if (selectedSeries.length === 0) {
            return '<!-- Select podcasts to generate digest template -->';
        }

        var code = '<h2 style="margin: 0 0 16px 0;">🎧 This Week\'s Episodes</h2>\n\n';

        selectedSeries.forEach(function (series, index) {
            var varName = 'podcast_' + (index + 1);
            code += '{% if ' + varName + '._embedded.assets.size > 0 %}\n';
            code += '{% assign episode = ' + varName + '._embedded.assets[0] %}\n';
            code += '<div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">\n';
            code += '  <img src="{{episode.images.main}}?t[]=80x80q80" style="width: 60px; height: 60px; border-radius: 8px;">\n';
            code += '  <div>\n';
            code += '    <p style="margin: 0 0 4px 0; color: #7c3aed; font-size: 12px; font-weight: 600;">' + series.title + '</p>\n';
            code += '    <h4 style="margin: 0 0 4px 0; color: #111;">{{episode.title}}</h4>\n';
            code += '    <p style="margin: 0; color: #666; font-size: 14px;">{{episode.duration | divided_by: 60000}} min</p>\n';
            code += '  </div>\n';
            code += '</div>\n';
            code += '{% endif %}\n\n';
        });

        return code;
    }

    // ============================================
    // AUTO-PREVIEW
    // ============================================

    function triggerAutoPreview() {
        if (!providerSelect.value) return;

        if (previewDebounceTimer) {
            clearTimeout(previewDebounceTimer);
        }

        previewDebounceTimer = setTimeout(function () {
            loadPreview();
        }, 600);
    }

    previewBtn.addEventListener('click', function () {
        loadPreview();
    });

    function loadPreview() {
        var provider = providerSelect.value;
        if (!provider) {
            previewContent.innerHTML = '<div class="preview-empty"><div class="preview-empty-icon">📡</div><p>Select a provider to see preview</p></div>';
            return;
        }

        previewBtn.classList.add('loading');
        previewBtn.textContent = 'Loading...';

        if (currentContentType === 'podcasts' && currentMode === 'digest' && selectedSeries.length > 0) {
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
                    previewBtn.classList.remove('loading');
                    previewBtn.textContent = 'Load Preview';
                });
        } else {
            var seriesId = currentContentType === 'podcasts' && selectedSeries.length > 0 ? selectedSeries[0].id : null;
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
                    previewBtn.classList.remove('loading');
                    previewBtn.textContent = 'Load Preview';
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
        var isSports = currentContentType === 'sports';

        assets.forEach(function (asset) {
            var imageUrl = asset.images && asset.images.main
                ? asset.images.main + '?t[]=160x90q80'
                : '';

            var duration = asset.duration
                ? Math.floor(asset.duration / 60000) + ' min'
                : '';

            var badges = '';
            if (asset.streamType === 'live') {
                badges += '<span class="preview-badge live">LIVE</span>';
            } else if (asset.assetType === 'audio') {
                badges += '<span class="preview-badge audio">AUDIO</span>';
            }

            if (isSports && asset.flightTimes && asset.flightTimes.start) {
                var startTime = new Date(asset.flightTimes.start);
                var now = new Date();
                if (startTime > now) {
                    badges += '<span class="preview-badge upcoming">UPCOMING</span>';
                }
            }

            var itemClass = isSports ? 'preview-item sports-item' : 'preview-item';

            html += '<div class="' + itemClass + '">';
            if (imageUrl) {
                html += '<img src="' + imageUrl + '" class="preview-thumb" alt="">';
            }
            html += '<div class="preview-details">';
            html += '<div class="preview-item-title">' + escapeHtml(asset.title) + '</div>';
            if (asset.description) {
                html += '<div class="preview-item-desc">' + escapeHtml(asset.description) + '</div>';
            }
            html += '<div class="preview-item-meta">';
            if (badges) html += badges;
            if (asset.category && asset.category.title) {
                html += '<span>' + escapeHtml(asset.category.title) + '</span>';
            }
            if (duration) html += '<span>' + duration + '</span>';

            // Show flight time for sports
            if (isSports && asset.flightTimes && asset.flightTimes.start) {
                var startDate = new Date(asset.flightTimes.start);
                html += '<span>📅 ' + startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>';
            }
            html += '</div>';

            // Show tags for sports
            if (isSports && asset._embedded && asset._embedded.tags && asset._embedded.tags.length > 0) {
                html += '<div class="preview-tags">';
                asset._embedded.tags.slice(0, 3).forEach(function (tag) {
                    html += '<span class="preview-tag">' + escapeHtml(tag.tag) + '</span>';
                });
                html += '</div>';
            }

            html += '</div></div>';
        });

        return html;
    }

    // ============================================
    // OUTPUT TABS
    // ============================================

    outputTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            outputTabs.forEach(function (t) { t.classList.remove('active'); });
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
    // COPY BUTTONS
    // ============================================

    document.querySelectorAll('.copy-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = this.dataset.target;
            var targetEl = document.getElementById(targetId);
            if (targetEl) {
                copyToClipboard(targetEl.textContent);
            }
        });
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
    // RESET FILTERS
    // ============================================

    resetFilters.addEventListener('click', function () {
        filterCategory.value = '';
        filterLimit.value = 10;
        filterSort.value = '-published';
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
        updateGeneratedCode();
        renderTemplateList();
        triggerAutoPreview();
        showToast('Podcast filters reset');
    });

    // ============================================
    // INPUT CHANGE HANDLERS
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

    sportsLimit.addEventListener('input', function () {
        updateGeneratedCode();
        triggerAutoPreview();
    });

    sportsSort.addEventListener('change', function () {
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
    updateGeneratedCode();

    console.log('SVP Builder v7.0 initialized');
    console.log('Sports Events support added with tag-based filtering');

});