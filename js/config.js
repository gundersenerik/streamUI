/**
 * SVP Content Builder - Configuration
 * Providers and Content Type definitions
 */

const PROVIDERS = {
    vgtv: {
        id: 'vgtv',
        name: 'VG (Verdens Gang)',
        baseUrl: 'https://svp.vg.no/svp/api/v1/vgtv',
        appName: 'edm_antichurn'
    },
    ab: {
        id: 'ab',
        name: 'Aftonbladet',
        baseUrl: 'https://svp.vg.no/svp/api/v1/ab',
        appName: 'braze_test'
    },
    bt: {
        id: 'bt',
        name: 'BT (Bergens Tidende)',
        baseUrl: 'https://svp.vg.no/svp/api/v1/bt',
        appName: 'edm_antichurn'
    },
    aftenbladet: {
        id: 'aftenbladet',
        name: 'Aftenbladet',
        baseUrl: 'https://svp.vg.no/svp/api/v1/aftenbladet',
        appName: 'edm_antichurn'
    }
};

const CONTENT_TYPES = {
    live: {
        id: 'live',
        title: 'Live Content',
        subtitle: 'Fetch currently live streams and broadcasts',
        icon: '📺',
        filter: 'streamType::live',
        discovery: [
            { id: 'all-live', title: 'All Live Now', desc: 'Everything currently streaming', filter: '' },
            { id: 'recent', title: 'Recently Live', desc: 'Ended within 24 hours', filter: 'flightTimes.end>=' },
            { id: 'upcoming', title: 'Starting Soon', desc: 'Next 3 hours', filter: 'flightTimes.start>=' }
        ],
        filters: [
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort By', type: 'select', options: [
                { value: '-flightTimes.start', label: 'Start Time (Newest)' },
                { value: 'flightTimes.start', label: 'Start Time (Oldest)' },
                { value: '-published', label: 'Published (Newest)' }
            ], default: '-flightTimes.start' }
        ],
        quickFilters: ['Free Only', 'With Images', 'Has Description']
    },
    
    sports: {
        id: 'sports',
        title: 'Sports Events',
        subtitle: 'Live and upcoming sports broadcasts',
        icon: '⚽',
        filter: 'streamType::live',
        discovery: [
            { id: 'live-sports', title: 'Live Now', desc: 'Matches in progress', filter: '' },
            { id: 'today', title: "Today's Games", desc: 'All events today', filter: 'flightTimes.start>=' },
            { id: 'week', title: 'This Week', desc: 'Next 7 days', filter: 'flightTimes.start>=' },
            { id: 'month', title: 'This Month', desc: 'Next 30 days', filter: 'flightTimes.start>=' }
        ],
        filters: [
            { id: 'sportType', label: 'Sport Type', type: 'select', dynamic: true, apiPath: 'additional.metadata.sportType' },
            { id: 'access', label: 'Access Level', type: 'select', options: [
                { value: '', label: 'All' },
                { value: 'free', label: 'Free' },
                { value: 'sport_subscription', label: 'Sport Subscription' }
            ] },
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort By', type: 'select', options: [
                { value: 'flightTimes.start', label: 'Start Time (Soonest)' },
                { value: '-flightTimes.start', label: 'Start Time (Latest)' }
            ], default: 'flightTimes.start' }
        ],
        quickFilters: ['Football', 'Hockey', 'Handball', 'Basketball']
    },
    
    podcasts: {
        id: 'podcasts',
        title: 'Podcasts',
        subtitle: 'Audio series and episodes',
        icon: '🎧',
        filter: 'streamType::audio',
        discovery: [
            { id: 'latest', title: 'Latest Episodes', desc: 'Most recently published', filter: '' },
            { id: 'popular', title: 'Popular Series', desc: 'Top podcast shows', filter: '' },
            { id: 'all-series', title: 'All Series', desc: 'Browse all podcasts', filter: '' }
        ],
        filters: [
            { id: 'category', label: 'Podcast Series', type: 'select', dynamic: true },
            { id: 'limit', label: 'Episodes', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort By', type: 'select', options: [
                { value: '-published', label: 'Newest First' },
                { value: 'published', label: 'Oldest First' }
            ], default: '-published' }
        ],
        quickFilters: ['Last 24 Hours', 'Last Week', 'Last Month']
    },
    
    vod: {
        id: 'vod',
        title: 'Video on Demand',
        subtitle: 'Pre-recorded video content',
        icon: '🎬',
        filter: 'streamType::vod',
        discovery: [
            { id: 'latest-vod', title: 'Latest Videos', desc: 'Most recent uploads', filter: '' },
            { id: 'featured', title: 'Featured', desc: "Editor's picks", filter: '' }
        ],
        filters: [
            { id: 'category', label: 'Category', type: 'select', dynamic: true },
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort By', type: 'select', options: [
                { value: '-published', label: 'Newest First' },
                { value: 'published', label: 'Oldest First' },
                { value: '-title', label: 'Title (Z-A)' },
                { value: 'title', label: 'Title (A-Z)' }
            ], default: '-published' }
        ]
    },
    
    all: {
        id: 'all',
        title: 'All Content',
        subtitle: 'Search across all content types',
        icon: '📚',
        filter: '',
        discovery: [
            { id: 'everything', title: 'All Content', desc: 'No stream type filter', filter: '' },
            { id: 'live-all', title: 'Live Streams', desc: 'Currently live', filter: 'streamType::live' },
            { id: 'vod-all', title: 'Videos', desc: 'Video on demand', filter: 'streamType::vod' },
            { id: 'audio-all', title: 'Audio', desc: 'Podcasts & audio', filter: 'streamType::audio' }
        ],
        filters: [
            { id: 'streamType', label: 'Stream Type', type: 'select', options: [
                { value: '', label: 'All Types' },
                { value: 'live', label: 'Live' },
                { value: 'vod', label: 'Video on Demand' },
                { value: 'audio', label: 'Audio' }
            ] },
            { id: 'category', label: 'Category', type: 'select', dynamic: true },
            { id: 'limit', label: 'Results', type: 'number', default: 10, min: 1, max: 100 },
            { id: 'sort', label: 'Sort By', type: 'select', options: [
                { value: '-published', label: 'Newest First' },
                { value: 'published', label: 'Oldest First' }
            ], default: '-published' }
        ]
    }
};

// Default sport types (fallback if API fails)
const DEFAULT_SPORT_TYPES = [
    { value: 'football', label: 'Football' },
    { value: 'handball', label: 'Handball' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'skiing', label: 'Skiing' },
    { value: 'athletics', label: 'Athletics' },
    { value: 'motorsport', label: 'Motorsport' },
    { value: 'cycling', label: 'Cycling' }
];
