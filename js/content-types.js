// Content Type Configurations

const CONTENT_TYPES = {
    allLive: {
        id: 'allLive',
        name: 'All Live Content',
        icon: '🔴',
        description: 'All upcoming live streams (sports, events, shows)',
        endpoint: '/search',
        defaultFilters: {
            streamType: { value: 'live', locked: true }
        },
        filters: [
            {
                id: 'dateRange',
                label: 'Time Range',
                type: 'dropdown',
                apiPath: 'flightTimes.start',
                operator: '>=',
                options: [
                    { value: '', label: 'All Upcoming' },
                    { value: 'next7days', label: 'Next 7 Days' },
                    { value: 'next14days', label: 'Next 14 Days' },
                    { value: 'next30days', label: 'Next 30 Days' },
                    { value: 'today', label: 'Today Only' },
                    { value: 'tomorrow', label: 'Tomorrow Only' }
                ],
                required: false,
                isRelativeDate: true
            },
            {
                id: 'limit',
                label: 'Number of Results',
                type: 'number',
                paramName: 'limit',
                default: 10,
                min: 1,
                max: 100,
                required: false
            },
            {
                id: 'sort',
                label: 'Sort Order',
                type: 'dropdown',
                paramName: 'sort',
                options: [
                    { value: 'flightTimes.start', label: 'Start Time (Soonest First)' },
                    { value: '-flightTimes.start', label: 'Start Time (Latest First)' }
                ],
                default: 'flightTimes.start',
                required: false
            }
        ]
    },
    
    liveSports: {
        id: 'liveSports',
        name: 'Live Sports Events',
        icon: '🏆',
        description: 'Upcoming live sports matches and events',
        endpoint: '/search',
        defaultFilters: {
            streamType: { value: 'live', locked: true }
        },
        filters: [
            {
                id: 'dateRange',
                label: 'Time Range',
                type: 'dropdown',
                apiPath: 'flightTimes.start',
                operator: '>=',
                options: [
                    { value: '', label: 'All Upcoming' },
                    { value: 'next7days', label: 'Next 7 Days' },
                    { value: 'next14days', label: 'Next 14 Days' },
                    { value: 'next30days', label: 'Next 30 Days' },
                    { value: 'today', label: 'Today Only' },
                    { value: 'tomorrow', label: 'Tomorrow Only' }
                ],
                required: false,
                isRelativeDate: true
            },
            {
                id: 'sportType',
                label: 'Sport Type',
                type: 'dropdown',
                apiPath: 'additional.metadata.sportType',
                operator: '::',
                fetchOptions: true, // Will fetch dynamically
                required: false
            },
            {
                id: 'teams',
                label: 'Teams',
                type: 'multiselect',
                apiPath: 'additional.tags.id',
                operator: '<>',
                fetchOptions: true,
                required: false
            },
            {
                id: 'dateStart',
                label: 'From Date',
                type: 'datetime',
                apiPath: 'flightTimes.start',
                operator: '>=',
                required: false
            },
            {
                id: 'dateEnd',
                label: 'To Date',
                type: 'datetime',
                apiPath: 'flightTimes.start',
                operator: '<=',
                required: false
            },
            {
                id: 'access',
                label: 'Access Level',
                type: 'dropdown',
                apiPath: 'additional.access',
                operator: '::',
                options: [
                    { value: '', label: 'All' },
                    { value: 'free', label: 'Free' },
                    { value: 'sport', label: 'Sport Subscription' },
                    { value: 'plus', label: 'Plus Subscription' }
                ],
                required: false
            },
            {
                id: 'limit',
                label: 'Number of Results',
                type: 'number',
                paramName: 'limit',
                default: 10,
                min: 1,
                max: 100,
                required: false
            },
            {
                id: 'sort',
                label: 'Sort Order',
                type: 'dropdown',
                paramName: 'sort',
                options: [
                    { value: '-flightTimes.start', label: 'Start Time (Newest First)' },
                    { value: 'flightTimes.start', label: 'Start Time (Oldest First)' },
                    { value: '-published', label: 'Published (Newest First)' }
                ],
                default: '-flightTimes.start',
                required: false
            }
        ]
    },
    
    vodSports: {
        id: 'vodSports',
        name: 'Sports Video on Demand',
        icon: '📹',
        description: 'Recorded sports content and highlights',
        endpoint: '/search',
        defaultFilters: {
            streamType: { value: 'vod', locked: true }
        },
        filters: [
            {
                id: 'sportType',
                label: 'Sport Type',
                type: 'dropdown',
                apiPath: 'additional.metadata.sportType',
                operator: '::',
                fetchOptions: true,
                required: false
            },
            {
                id: 'category',
                label: 'Category',
                type: 'dropdown',
                apiPath: 'categories.id',
                operator: '::',
                fetchOptions: true,
                required: false
            },
            {
                id: 'limit',
                label: 'Number of Results',
                type: 'number',
                paramName: 'limit',
                default: 10,
                min: 1,
                max: 100
            },
            {
                id: 'sort',
                label: 'Sort Order',
                type: 'dropdown',
                paramName: 'sort',
                options: [
                    { value: '-published', label: 'Published (Newest First)' },
                    { value: 'published', label: 'Published (Oldest First)' },
                    { value: '-views', label: 'Most Viewed' }
                ],
                default: '-published'
            }
        ]
    },
    
    podcasts: {
        id: 'podcasts',
        name: 'Podcasts',
        icon: '🎙️',
        description: 'Audio podcasts and episodes',
        endpoint: '/search',
        defaultFilters: {
            streamType: { value: 'audio', locked: true }
        },
        filters: [
            {
                id: 'category',
                label: 'Podcast Series',
                type: 'dropdown',
                apiPath: 'categories.id',
                operator: '::',
                fetchOptions: true,
                required: false
            },
            {
                id: 'dateStart',
                label: 'Published After',
                type: 'date',
                apiPath: 'published',
                operator: '>=',
                required: false
            },
            {
                id: 'limit',
                label: 'Number of Episodes',
                type: 'number',
                paramName: 'limit',
                default: 10,
                min: 1,
                max: 100
            },
            {
                id: 'sort',
                label: 'Sort Order',
                type: 'dropdown',
                paramName: 'sort',
                options: [
                    { value: '-published', label: 'Newest First' },
                    { value: 'published', label: 'Oldest First' }
                ],
                default: '-published'
            }
        ]
    },
    
    general: {
        id: 'general',
        name: 'General Video Content',
        icon: '🎬',
        description: 'All types of video content',
        endpoint: '/search',
        filters: [
            {
                id: 'streamType',
                label: 'Stream Type',
                type: 'dropdown',
                apiPath: 'streamType',
                operator: '::',
                options: [
                    { value: '', label: 'All' },
                    { value: 'live', label: 'Live' },
                    { value: 'vod', label: 'Video on Demand' },
                    { value: 'audio', label: 'Audio' }
                ],
                required: false
            },
            {
                id: 'category',
                label: 'Category',
                type: 'dropdown',
                apiPath: 'categories.id',
                operator: '::',
                fetchOptions: true,
                required: false
            },
            {
                id: 'limit',
                label: 'Number of Results',
                type: 'number',
                paramName: 'limit',
                default: 10,
                min: 1,
                max: 100
            },
            {
                id: 'sort',
                label: 'Sort Order',
                type: 'dropdown',
                paramName: 'sort',
                options: [
                    { value: '-published', label: 'Newest First' },
                    { value: 'published', label: 'Oldest First' }
                ],
                default: '-published'
            }
        ]
    }
};

/**
 * Get content type by ID
 */
function getContentType(contentTypeId) {
    return CONTENT_TYPES[contentTypeId];
}

/**
 * Get all content types
 */
function getAllContentTypes() {
    return Object.values(CONTENT_TYPES);
}

/**
 * Render content type cards
 */
function renderContentTypeCards() {
    const container = document.getElementById('content-type-cards');
    container.innerHTML = '';
    
    getAllContentTypes().forEach(contentType => {
        const card = document.createElement('div');
        card.className = 'content-type-card';
        card.dataset.contentType = contentType.id;
        
        card.innerHTML = `
            <div class="icon">${contentType.icon}</div>
            <div class="name">${contentType.name}</div>
            <div class="description" style="font-size: 0.85rem; color: #6b7280; margin-top: 8px;">
                ${contentType.description}
            </div>
        `;
        
        card.addEventListener('click', () => {
            // Remove selected from all cards
            document.querySelectorAll('.content-type-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Add selected to clicked card
            card.classList.add('selected');
            
            // Trigger content type selection
            if (window.app) {
                window.app.selectContentType(contentType.id);
            }
        });
        
        container.appendChild(card);
    });
}
