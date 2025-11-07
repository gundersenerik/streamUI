// Liquid Template Library - Pre-built templates for Braze

const LIQUID_TEMPLATES = {
    single: {
        simple: {
            id: 'single-simple',
            name: 'Simple Single Item',
            description: 'Display the first item with title and description',
            generate: (varName) => `
<h2>{{${varName}._embedded.assets[0].title}}</h2>
<p>{{${varName}._embedded.assets[0].description}}</p>
            `.trim()
        },
        
        withImage: {
            id: 'single-with-image',
            name: 'Single Item with Image',
            description: 'Display first item with image, title, and description',
            generate: (varName) => `
<img src="{{${varName}._embedded.assets[0].images.main}}" alt="{{${varName}._embedded.assets[0].title}}" style="max-width: 100%;">
<h2>{{${varName}._embedded.assets[0].title}}</h2>
<p>{{${varName}._embedded.assets[0].description | truncate: 150}}</p>
            `.trim()
        },
        
        card: {
            id: 'single-card',
            name: 'Card Layout',
            description: 'Styled card with image, title, and CTA',
            generate: (varName) => `
<div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; max-width: 500px;">
  <img src="{{${varName}._embedded.assets[0].images.main}}" style="width: 100%; display: block;">
  <div style="padding: 20px;">
    <h2 style="margin: 0 0 10px 0;">{{${varName}._embedded.assets[0].title}}</h2>
    <p style="color: #666; margin: 0 0 15px 0;">{{${varName}._embedded.assets[0].description | truncate: 120}}</p>
    <a href="YOUR_LINK_HERE" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Watch Now</a>
  </div>
</div>
            `.trim()
        }
    },
    
    loop: {
        simpleList: {
            id: 'loop-simple-list',
            name: 'Simple List',
            description: 'Loop through all items in a simple list',
            generate: (varName) => `
<ul>
{% for item in ${varName}._embedded.assets %}
  <li>{{item.title}}</li>
{% endfor %}
</ul>
            `.trim()
        },
        
        detailedList: {
            id: 'loop-detailed-list',
            name: 'Detailed List with Images',
            description: 'Loop through items with images and descriptions',
            generate: (varName) => `
{% for item in ${varName}._embedded.assets %}
<div style="display: flex; gap: 15px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
  <img src="{{item.images.main}}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;">
  <div style="flex: 1;">
    <h3 style="margin: 0 0 8px 0;">{{item.title}}</h3>
    <p style="margin: 0; color: #666; font-size: 14px;">{{item.description | truncate: 100}}</p>
  </div>
</div>
{% endfor %}
            `.trim()
        },
        
        grid: {
            id: 'loop-grid',
            name: 'Grid Layout',
            description: 'Display items in a responsive grid',
            generate: (varName) => `
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
{% for item in ${varName}._embedded.assets %}
  <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <img src="{{item.images.main}}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">
    <div style="padding: 15px;">
      <h4 style="margin: 0 0 8px 0; font-size: 16px;">{{item.title}}</h4>
      <p style="margin: 0; font-size: 14px; color: #666;">{{item.description | truncate: 80}}</p>
    </div>
  </div>
{% endfor %}
</div>
            `.trim()
        },
        
        firstFive: {
            id: 'loop-first-five',
            name: 'First 5 Items Only',
            description: 'Loop through only the first 5 items',
            generate: (varName) => `
{% for item in ${varName}._embedded.assets limit: 5 %}
<div style="margin-bottom: 15px;">
  <h3>{{item.title}}</h3>
  <p>{{item.description | truncate: 100}}</p>
</div>
{% endfor %}
            `.trim()
        }
    },
    
    conditional: {
        checkExists: {
            id: 'cond-check-exists',
            name: 'Check if Data Exists',
            description: 'Show content only if data is returned',
            generate: (varName) => `
{% if ${varName}._embedded.assets.size > 0 %}
  <h2>Upcoming Matches</h2>
  {% for item in ${varName}._embedded.assets %}
    <p>{{item.title}}</p>
  {% endfor %}
{% else %}
  <p>No upcoming matches at this time.</p>
{% endif %}
            `.trim()
        },
        
        accessLevel: {
            id: 'cond-access-level',
            name: 'Conditional by Access Level',
            description: 'Show different content based on access level',
            generate: (varName) => `
{% for item in ${varName}._embedded.assets %}
  <div style="margin-bottom: 20px;">
    <h3>{{item.title}}</h3>
    {% if item.additional.access == "free" %}
      <span style="color: green;">🆓 Free to watch</span>
    {% elsif item.additional.access == "sport" %}
      <span style="color: orange;">🏆 Sport subscription required</span>
    {% else %}
      <span style="color: blue;">⭐ Premium content</span>
    {% endif %}
  </div>
{% endfor %}
            `.trim()
        },
        
        liveIndicator: {
            id: 'cond-live-indicator',
            name: 'Live Match Indicator',
            description: 'Show LIVE badge for matches that are currently streaming',
            generate: (varName) => `
{% for item in ${varName}._embedded.assets %}
  <div style="margin-bottom: 15px;">
    {% assign now = 'now' | date: '%s' %}
    {% assign startTime = item.flightTimes.start %}
    {% assign endTime = item.flightTimes.end %}
    
    {% if now >= startTime and now <= endTime %}
      <span style="background: red; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">🔴 LIVE</span>
    {% endif %}
    
    <h3>{{item.title}}</h3>
    <p>Starts: {{item.flightTimes.start | date: '%B %d, %Y at %H:%M'}}</p>
  </div>
{% endfor %}
            `.trim()
        }
    },
    
    mixed: {
        featuredPlusList: {
            id: 'mixed-featured-list',
            name: 'Featured Item + List',
            description: 'Show first item as featured, rest as list',
            generate: (varName) => `
<!-- Featured Match -->
{% if ${varName}._embedded.assets[0] %}
<div style="border: 2px solid #0066cc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
  <img src="{{${varName}._embedded.assets[0].images.main}}" style="width: 100%; border-radius: 4px; margin-bottom: 15px;">
  <h2 style="margin: 0 0 10px 0;">{{${varName}._embedded.assets[0].title}}</h2>
  <p style="margin: 0 0 15px 0;">{{${varName}._embedded.assets[0].description}}</p>
  <a href="YOUR_LINK" style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Watch Now</a>
</div>
{% endif %}

<!-- Other Matches -->
<h3>More Upcoming Matches</h3>
{% for item in ${varName}._embedded.assets offset: 1 %}
<div style="display: flex; gap: 15px; margin-bottom: 15px;">
  <img src="{{item.images.main}}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">
  <div>
    <h4 style="margin: 0 0 5px 0;">{{item.title}}</h4>
    <p style="margin: 0; font-size: 14px; color: #666;">{{item.flightTimes.start | date: '%b %d, %H:%M'}}</p>
  </div>
</div>
{% endfor %}
            `.trim()
        }
    }
};

/**
 * Get templates by category
 */
function getTemplatesByCategory(category) {
    return LIQUID_TEMPLATES[category] || {};
}

/**
 * Get all template categories
 */
function getTemplateCategories() {
    return Object.keys(LIQUID_TEMPLATES);
}

/**
 * Render template list for a category
 */
function renderTemplateList(category, containerId, varName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    const templates = getTemplatesByCategory(category);
    
    Object.values(templates).forEach(template => {
        const item = document.createElement('div');
        item.className = 'template-item';
        item.dataset.templateId = template.id;
        
        item.innerHTML = `
            <div class="template-item-header">
                <input type="checkbox" class="template-checkbox" id="template-${template.id}">
                <label for="template-${template.id}" class="template-name">${template.name}</label>
            </div>
            <p class="template-description">${template.description}</p>
        `;
        
        const checkbox = item.querySelector('.template-checkbox');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Uncheck others
                container.querySelectorAll('.template-checkbox').forEach(cb => {
                    if (cb !== e.target) cb.checked = false;
                });
                item.classList.add('selected');
                container.querySelectorAll('.template-item').forEach(i => {
                    if (i !== item) i.classList.remove('selected');
                });
                
                // Update liquid output
                updateLiquidOutput(template, varName);
            } else {
                item.classList.remove('selected');
                document.getElementById('liquid-output').textContent = '<!-- Select a template to see the code -->';
            }
        });
        
        container.appendChild(item);
    });
}

/**
 * Update liquid output display
 */
function updateLiquidOutput(template, varName) {
    const output = document.getElementById('liquid-output');
    if (output && template && varName) {
        output.textContent = template.generate(varName);
    }
}

/**
 * Generate custom fields template
 */
function generateCustomFieldsTemplate(varName, selectedFields) {
    if (selectedFields.length === 0) {
        return '<!-- Select fields to generate template -->';
    }
    
    let template = '{% for item in ' + varName + '._embedded.assets %}\n<div>\n';
    
    selectedFields.forEach(field => {
        const fieldPath = `item.${field.path}`;
        template += `  <p><strong>${field.label}:</strong> {{${fieldPath}}}</p>\n`;
    });
    
    template += '</div>\n{% endfor %}';
    
    return template;
}
