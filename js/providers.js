// Provider Configurations

const PROVIDERS = {
    vgtv: {
        id: 'vgtv',
        name: 'VG (Verdens Gang)',
        baseUrl: 'https://svp.vg.no/svp/api/v1/vgtv',
        appName: 'edm_antichurn',
        country: 'Norway'
    },
    ab: {
        id: 'ab',
        name: 'Aftonbladet',
        baseUrl: 'https://svp.vg.no/svp/api/v1/ab',
        appName: 'braze_test',
        country: 'Sweden'
    },
    aftenbladet: {
        id: 'aftenbladet',
        name: 'Aftenbladet',
        baseUrl: 'https://svp.vg.no/svp/api/v1/aftenbladet',
        appName: 'edm_antichurn',
        country: 'Norway'
    },
    bt: {
        id: 'bt',
        name: 'BT (Bergens Tidende)',
        baseUrl: 'https://svp.vg.no/svp/api/v1/bt',
        appName: 'edm_antichurn',
        country: 'Norway'
    }
};

/**
 * Fetch providers from API dynamically
 * Falls back to hardcoded list if API fails
 */
async function fetchProviders() {
    console.log('🔍 Fetching providers from API...');
    
    try {
        const url = 'https://svp.vg.no/svp/api/v1/providers?appName=edm_antichurn';
        console.log('📡 API URL:', url);
        
        const response = await fetch(url);
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            console.warn('⚠️ API returned non-OK status, using fallback list');
            console.log('✅ Using fallback providers:', Object.values(PROVIDERS).length, 'providers');
            return Object.values(PROVIDERS);
        }
        
        const data = await response.json();
        console.log('📦 API response data:', data);
        
        // API returns providers in _embedded.providers format (HAL)
        if (data._embedded && data._embedded.providers) {
            console.log('✅ Successfully fetched providers from API:', data._embedded.providers.length);
            return data._embedded.providers.map(provider => ({
                id: provider.name,
                name: formatProviderName(provider.name),
                baseUrl: `https://svp.vg.no/svp/api/v1/${provider.name}`,
                appName: 'edm_antichurn'
            }));
        }
        
        // Fallback to hardcoded if unexpected format
        console.warn('⚠️ Unexpected API response format, using fallback list');
        console.log('✅ Using fallback providers:', Object.values(PROVIDERS).length, 'providers');
        return Object.values(PROVIDERS);
        
    } catch (error) {
        console.error('❌ Error fetching providers:', error);
        console.log('✅ Using fallback providers:', Object.values(PROVIDERS).length, 'providers');
        return Object.values(PROVIDERS);
    }
}

/**
 * Format provider name for display
 */
function formatProviderName(providerId) {
    const nameMap = {
        'vgtv': 'VG (Verdens Gang)',
        'ab': 'Aftonbladet',
        'aftonbladet': 'Aftonbladet',
        'aftenbladet': 'Aftenbladet',
        'bt': 'BT (Bergens Tidende)'
    };
    
    return nameMap[providerId] || providerId.charAt(0).toUpperCase() + providerId.slice(1);
}

/**
 * Get provider by ID
 */
function getProvider(providerId) {
    return PROVIDERS[providerId];
}

/**
 * Populate provider dropdown
 */
async function populateProviderDropdown() {
    console.log('🎯 Populating provider dropdown...');
    const select = document.getElementById('provider-select');
    
    if (!select) {
        console.error('❌ Provider select element not found!');
        return;
    }
    
    const providers = await fetchProviders();
    
    console.log('📋 Providers to add to dropdown:', providers);
    
    // Clear existing options (except the first placeholder)
    select.innerHTML = '<option value="">-- Select Provider --</option>';
    
    // Add providers
    providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.id;
        option.textContent = provider.name;
        select.appendChild(option);
        console.log('➕ Added provider:', provider.name);
    });
    
    console.log('✅ Provider dropdown populated with', providers.length, 'providers');
}
