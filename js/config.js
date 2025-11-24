/**
 * SVP Content Builder - Configuration
 * Provider definitions, content types, and templates
 */

// ============================================
// PROVIDERS
// ============================================
const PROVIDERS = {
    vgtv: {
        id: 'vgtv',
        name: 'VG (Verdens Gang)',
        shortName: 'VG',
        baseUrl: 'https://svp.vg.no/svp/api/v1/vgtv',
        appName: 'edm_antichurn'
    },
    ab: {
        id: 'ab',
        name: 'Aftonbladet',
        shortName: 'AB',
        baseUrl: 'https://svp.vg.no/svp/api/v1/ab',
        appName: 'braze_test'
    },
    bt: {
        id: 'bt',
        name: 'BT (Bergens Tidende)',
        shortName: 'BT',
        baseUrl: 'https://svp.vg.no/svp/api/v1/bt',
        appName: 'edm_antichurn'
    },
    aftenbladet: {
        id: 'aftenbladet',
        name: 'Aftenbladet',
        shortName: 'Aftenbladet',
        baseUrl: 'https://svp.vg.no/svp/api/v1/aftenbladet',
        appName: 'edm_antichurn'
    }
};

// ============================================
// CONTENT TYPES
// ============================================
const CONTENT_TYPES = {
    live: {
        id: 'live',
        title: 'Live Content',
        subtitle: 'Fetch currently live streams and broadcasts',
        icon: '📺',
        baseFilter: 'streamType::live',
        discovery: [
            { id: 'all', icon: '🔴', title: 'All Live Now', desc: 'Everything currently streaming', preset: {} },
            { id: 'recent', icon: '⏱️', title: 'Recently Ended', desc: 'Last 24 hours', preset: { timeFilter: 'ended24h' } },
            { id: 'upcoming', icon: '📅', title: 'Starting Soon', desc: 'Next 3 hours', preset: { timeFilter: 'next3h' } }
        ],
        filters: [
            { id: 'category', label: 'Category', type: 'select', dynamic: 'categories' },
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort', type: 'select', options: [
                { value: '-flightTimes.start', label: 'Start Time (Newest)' },
                { value: 'flightTimes.start', label: 'Start Time (Oldest)' }
            ]}
        ]
    },
    sports: {
        id: 'sports',
        title: 'Sports Events',
        subtitle: 'Live and upcoming sports broadcasts',
        icon: '⚽',
        baseFilter: 'streamType::live',
        discovery: [
            { id: 'live', icon: '🔴', title: 'Live Now', desc: 'Games in progress', preset: {} },
            { id: 'today', icon: '📆', title: "Today's Games", desc: 'All events today', preset: { timeFilter: 'today' } },
            { id: 'week', icon: '📅', title: 'This Week', desc: 'Next 7 days', preset: { timeFilter: 'week' } },
            { id: 'month', icon: '🗓️', title: 'This Month', desc: 'Next 30 days', preset: { timeFilter: 'month' } }
        ],
        filters: [
            { id: 'sportType', label: 'Sport', type: 'select', options: [
                { value: '', label: 'All Sports' },
                { value: 'football', label: '⚽ Football' },
                { value: 'hockey', label: '🏒 Hockey' },
                { value: 'handball', label: '🤾 Handball' },
                { value: 'basketball', label: '🏀 Basketball' },
                { value: 'tennis', label: '🎾 Tennis' },
                { value: 'skiing', label: '⛷️ Skiing' },
                { value: 'golf', label: '⛳ Golf' },
                { value: 'motorsport', label: '🏎️ Motorsport' },
                { value: 'cycling', label: '🚴 Cycling' }
            ]},
            { id: 'access', label: 'Access', type: 'select', options: [
                { value: '', label: 'All' },
                { value: 'free', label: '🆓 Free' },
                { value: 'sport_subscription', label: '💳 Subscription' }
            ]},
            { id: 'limit', label: 'Results', type: 'number', default: 15, min: 1, max: 100 },
            { id: 'sort', label: 'Sort', type: 'select', options: [
                { value: 'flightTimes.start', label: 'Start Time (Soonest)' },
                { value: '-flightTimes.start', label: 'Start Time (Latest)' }
            ]}
        ],
        quickFilters: ['Football', 'Hockey', 'Handball', 'Basketball']
    },
    podcasts: {
        id: 'podcasts',
        title: 'Podcasts',
        subtitle: 'Audio series and episodes',
        icon: '🎧',
        baseFilter: 'streamType::audio',
        discovery: [
            { id: 'latest', icon: '🆕', title: 'Latest Episodes', desc: 'Most recent', preset: {} },
            { id: 'week', icon: '📅', title: 'This Week', desc: 'Last 7 days', preset: { timeFilter: 'lastWeek' } },
            { id: 'month', icon: '🗓️', title: 'This Month', desc: 'Last 30 days', preset: { timeFilter: 'lastMonth' } }
        ],
        filters: [
            { id: 'category', label: 'Podcast Series', type: 'select', dynamic: 'series' },
            { id: 'limit', label: 'Episodes', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort', type: 'select', options: [
                { value: '-published', label: 'Newest First' },
                { value: 'published', label: 'Oldest First' }
            ]}
        ],
        quickFilters: ['Last 24h', 'Last Week', 'Last Month']
    },
    vod: {
        id: 'vod',
        title: 'Video on Demand',
        subtitle: 'Pre-recorded video content',
        icon: '🎬',
        baseFilter: 'streamType::vod',
        discovery: [
            { id: 'latest', icon: '🆕', title: 'Latest Videos', desc: 'Most recent', preset: {} },
            { id: 'featured', icon: '⭐', title: 'Featured', desc: "Editor's picks", preset: {} }
        ],
        filters: [
            { id: 'category', label: 'Category', type: 'select', dynamic: 'categories' },
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort', type: 'select', options: [
                { value: '-published', label: 'Newest First' },
                { value: 'published', label: 'Oldest First' }
            ]}
        ]
    },
    all: {
        id: 'all',
        title: 'All Content',
        subtitle: 'Search across all content types',
        icon: '📚',
        baseFilter: '',
        discovery: [
            { id: 'everything', icon: '📚', title: 'All Content', desc: 'No filters', preset: {} },
            { id: 'live', icon: '📺', title: 'Live', desc: 'Currently streaming', preset: { streamType: 'live' } },
            { id: 'vod', icon: '🎬', title: 'Videos', desc: 'On demand', preset: { streamType: 'vod' } },
            { id: 'audio', icon: '🎧', title: 'Audio', desc: 'Podcasts', preset: { streamType: 'audio' } }
        ],
        filters: [
            { id: 'streamType', label: 'Type', type: 'select', options: [
                { value: '', label: 'All Types' },
                { value: 'live', label: 'Live' },
                { value: 'vod', label: 'Video' },
                { value: 'audio', label: 'Audio' }
            ]},
            { id: 'category', label: 'Category', type: 'select', dynamic: 'categories' },
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort', type: 'select', options: [
                { value: '-published', label: 'Newest' },
                { value: 'published', label: 'Oldest' }
            ]}
        ]
    }
};

// ============================================
// LIQUID TEMPLATES
// ============================================
const TEMPLATES = [
    {
        id: 'single-simple',
        name: 'Single Item - Simple',
        desc: 'Title and description only',
        code: (v) => `{% if ${v}._embedded.assets[0] %}
<div>
  <h2>{{ ${v}._embedded.assets[0].title }}</h2>
  <p>{{ ${v}._embedded.assets[0].description }}</p>
</div>
{% endif %}`
    },
    {
        id: 'single-card',
        name: 'Single Item - Card',
        desc: 'Card with image',
        code: (v) => `{% if ${v}._embedded.assets[0] %}
{% assign item = ${v}._embedded.assets[0] %}
<div style="border:1px solid #eee; border-radius:8px; overflow:hidden;">
  {% if item.images.main %}
  <img src="{{ item.images.main }}?t[]=680q80" style="width:100%;">
  {% endif %}
  <div style="padding:16px;">
    <h3 style="margin:0 0 8px;">{{ item.title }}</h3>
    <p style="color:#666; margin:0;">{{ item.description }}</p>
  </div>
</div>
{% endif %}`
    },
    {
        id: 'list-simple',
        name: 'List - Bullet Points',
        desc: 'Simple list of titles',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
<ul>
{% for item in ${v}._embedded.assets %}
  <li>{{ item.title }}</li>
{% endfor %}
</ul>
{% else %}
<p>No content available</p>
{% endif %}`
    },
    {
        id: 'list-detailed',
        name: 'List - With Details',
        desc: 'Title, description, and meta',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="padding:12px 0; border-bottom:1px solid #eee;">
  <h4 style="margin:0 0 4px;">{{ item.title }}</h4>
  <p style="color:#666; margin:0; font-size:14px;">{{ item.description | truncate: 100 }}</p>
  <small style="color:#999;">{{ item.published | date: "%b %d, %Y" }}</small>
</div>
{% endfor %}
{% endif %}`
    },
    {
        id: 'grid',
        name: 'Grid Layout',
        desc: '2-column grid with images',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
{% for item in ${v}._embedded.assets %}
  <div style="border:1px solid #eee; border-radius:8px; overflow:hidden;">
    {% if item.images.main %}
    <img src="{{ item.images.main }}?t[]=400q80" style="width:100%; height:120px; object-fit:cover;">
    {% endif %}
    <div style="padding:12px;">
      <h4 style="margin:0; font-size:14px;">{{ item.title }}</h4>
    </div>
  </div>
{% endfor %}
</div>
{% endif %}`
    },
    {
        id: 'sports-schedule',
        name: 'Sports Schedule',
        desc: 'Match times and teams',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="display:flex; align-items:center; padding:12px; border-bottom:1px solid #eee;">
  <div style="width:60px; text-align:center; color:#666; font-size:12px;">
    {{ item.flightTimes.start | date: "%H:%M" }}<br>
    {{ item.flightTimes.start | date: "%b %d" }}
  </div>
  <div style="flex:1; padding-left:12px;">
    <strong>{{ item.title }}</strong>
    {% if item.access.free %}<span style="color:green; font-size:11px;"> FREE</span>{% endif %}
  </div>
</div>
{% endfor %}
{% endif %}`
    },
    {
        id: 'podcast-episodes',
        name: 'Podcast Episodes',
        desc: 'Audio-focused layout',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #eee;">
  <div style="width:60px; height:60px; background:#f0f0f0; border-radius:8px; display:flex; align-items:center; justify-content:center;">🎧</div>
  <div style="flex:1;">
    <h4 style="margin:0 0 4px;">{{ item.title }}</h4>
    <p style="color:#666; font-size:13px; margin:0;">{{ item.description | truncate: 80 }}</p>
    <small style="color:#999;">{{ item.duration | divided_by: 60000 }} min</small>
  </div>
</div>
{% endfor %}
{% endif %}`
    },
    {
        id: 'with-live-badge',
        name: 'With Live Badge',
        desc: 'Shows LIVE indicator',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="padding:12px; border:1px solid #eee; border-radius:8px; margin-bottom:8px;">
  {% if item.streamType == 'live' %}
  <span style="background:#dc2626; color:white; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:bold;">LIVE</span>
  {% endif %}
  <h4 style="margin:8px 0 4px;">{{ item.title }}</h4>
  <p style="color:#666; margin:0; font-size:14px;">{{ item.description | truncate: 100 }}</p>
</div>
{% endfor %}
{% endif %}`
    },
    {
        id: 'featured-plus-list',
        name: 'Featured + List',
        desc: 'Large hero item with list below',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
<!-- Featured Item -->
{% assign featured = ${v}._embedded.assets[0] %}
<div style="border:2px solid #0066cc; border-radius:12px; overflow:hidden; margin-bottom:20px;">
  {% if featured.images.main %}
  <img src="{{ featured.images.main }}?t[]=800q80" style="width:100%;">
  {% endif %}
  <div style="padding:20px;">
    <h2 style="margin:0 0 8px;">{{ featured.title }}</h2>
    <p style="color:#666;">{{ featured.description }}</p>
  </div>
</div>

<!-- Rest of Items -->
{% for item in ${v}._embedded.assets offset:1 %}
<div style="padding:10px 0; border-bottom:1px solid #eee;">
  <strong>{{ item.title }}</strong>
</div>
{% endfor %}
{% endif %}`
    },
    {
        id: 'conditional',
        name: 'With Fallback Message',
        desc: 'Shows message if no content',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
  {% for item in ${v}._embedded.assets %}
  <div style="padding:12px 0; border-bottom:1px solid #eee;">
    <h4 style="margin:0;">{{ item.title }}</h4>
  </div>
  {% endfor %}
{% else %}
  <div style="padding:20px; text-align:center; color:#999;">
    <p>No content available at this time.</p>
    <p>Check back later!</p>
  </div>
{% endif %}`
    }
];

// ============================================
// QUICK FILTER MAPPINGS
// ============================================
const QUICK_FILTER_MAP = {
    'Football': { sportType: 'football' },
    'Hockey': { sportType: 'hockey' },
    'Handball': { sportType: 'handball' },
    'Basketball': { sportType: 'basketball' },
    'Last 24h': { timeFilter: 'last24h' },
    'Last Week': { timeFilter: 'lastWeek' },
    'Last Month': { timeFilter: 'lastMonth' }
};
