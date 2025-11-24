/**
 * SVP Content Builder - Liquid Templates
 * Pre-built templates for common use cases
 */

const TEMPLATES = [
    {
        id: 'single-simple',
        name: 'Single Item - Simple',
        desc: 'Display just the title and description',
        code: (v) => `{% if ${v}._embedded.assets[0] %}
<div>
  <h2>{{${v}._embedded.assets[0].title}}</h2>
  <p>{{${v}._embedded.assets[0].description}}</p>
</div>
{% endif %}`
    },
    
    {
        id: 'single-card',
        name: 'Single Item - Card',
        desc: 'Card with image, title, and description',
        code: (v) => `{% if ${v}._embedded.assets[0] %}
<div style="border:1px solid #eee; border-radius:8px; overflow:hidden;">
  {% if ${v}._embedded.assets[0].images.main %}
  <img src="{{${v}._embedded.assets[0].images.main}}?t[]=680q80" style="width:100%; height:auto;">
  {% endif %}
  <div style="padding:16px;">
    <h3 style="margin:0 0 8px;">{{${v}._embedded.assets[0].title}}</h3>
    <p style="margin:0; color:#666;">{{${v}._embedded.assets[0].description}}</p>
  </div>
</div>
{% endif %}`
    },
    
    {
        id: 'list-simple',
        name: 'List - Simple',
        desc: 'Bullet list of titles',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
<ul>
{% for item in ${v}._embedded.assets %}
  <li>{{item.title}}</li>
{% endfor %}
</ul>
{% endif %}`
    },
    
    {
        id: 'list-detailed',
        name: 'List - Detailed',
        desc: 'List with thumbnails and metadata',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="display:flex; gap:16px; padding:12px 0; border-bottom:1px solid #eee;">
  {% if item.images.main %}
  <img src="{{item.images.main}}?t[]=180q80" style="width:120px; height:68px; object-fit:cover; border-radius:4px;">
  {% endif %}
  <div>
    <h4 style="margin:0 0 4px;">{{item.title}}</h4>
    <p style="margin:0; font-size:14px; color:#666;">{{item.published | date: '%b %d, %Y'}}</p>
  </div>
</div>
{% endfor %}
{% endif %}`
    },
    
    {
        id: 'featured-list',
        name: 'Featured + List',
        desc: 'Large featured item with remaining as list',
        code: (v) => `{% if ${v}._embedded.assets[0] %}
<!-- Featured -->
<div style="margin-bottom:24px;">
  {% if ${v}._embedded.assets[0].images.main %}
  <img src="{{${v}._embedded.assets[0].images.main}}?t[]=980q80" style="width:100%; height:auto; border-radius:8px;">
  {% endif %}
  <h2 style="margin:16px 0 8px;">{{${v}._embedded.assets[0].title}}</h2>
  <p style="color:#666;">{{${v}._embedded.assets[0].description}}</p>
</div>

<!-- List -->
{% for item in ${v}._embedded.assets offset:1 limit:5 %}
<div style="display:flex; gap:12px; padding:12px 0; border-top:1px solid #eee;">
  <div>
    <h4 style="margin:0;">{{item.title}}</h4>
  </div>
</div>
{% endfor %}
{% endif %}`
    },
    
    {
        id: 'podcast-episodes',
        name: 'Podcast Episodes',
        desc: 'Audio-focused layout with episode info',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="display:flex; align-items:center; gap:16px; padding:16px; background:#f9f9f9; border-radius:8px; margin-bottom:12px;">
  <div style="width:60px; height:60px; background:#e5e5e5; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px;">🎧</div>
  <div style="flex:1;">
    <h4 style="margin:0 0 4px;">{{item.title}}</h4>
    <p style="margin:0; font-size:13px; color:#666;">{{item.published | date: '%b %d, %Y'}}</p>
  </div>
</div>
{% endfor %}
{% endif %}`
    },
    
    {
        id: 'grid',
        name: 'Grid Layout',
        desc: '2-column grid of cards',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px;">
{% for item in ${v}._embedded.assets %}
<div style="border:1px solid #eee; border-radius:8px; overflow:hidden;">
  {% if item.images.main %}
  <img src="{{item.images.main}}?t[]=480q80" style="width:100%; height:120px; object-fit:cover;">
  {% endif %}
  <div style="padding:12px;">
    <h4 style="margin:0; font-size:14px;">{{item.title}}</h4>
  </div>
</div>
{% endfor %}
</div>
{% endif %}`
    },
    
    {
        id: 'sports-schedule',
        name: 'Sports Schedule',
        desc: 'Match times and teams layout',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border-bottom:1px solid #eee;">
  <div>
    <h4 style="margin:0 0 4px;">{{item.title}}</h4>
    <p style="margin:0; font-size:13px; color:#666;">
      {{item.flightTimes.start | date: '%a, %b %d at %H:%M'}}
    </p>
  </div>
  <div style="text-align:right; font-size:12px; color:#999;">
    {% if item.additional.access == 'free' %}
    <span style="color:#10b981;">FREE</span>
    {% else %}
    <span>Subscription</span>
    {% endif %}
  </div>
</div>
{% endfor %}
{% endif %}`
    },
    
    {
        id: 'conditional',
        name: 'Conditional Display',
        desc: 'Show fallback if no content',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
  {% for item in ${v}._embedded.assets %}
  <div style="padding:12px 0; border-bottom:1px solid #eee;">
    <h4 style="margin:0;">{{item.title}}</h4>
  </div>
  {% endfor %}
{% else %}
  <p style="color:#666; text-align:center; padding:20px;">No content available at this time.</p>
{% endif %}`
    },
    
    {
        id: 'live-badge',
        name: 'With Live Badge',
        desc: 'Shows live indicator for active streams',
        code: (v) => `{% if ${v}._embedded.assets.size > 0 %}
{% for item in ${v}._embedded.assets %}
<div style="display:flex; gap:16px; padding:12px 0; border-bottom:1px solid #eee;">
  <div style="position:relative;">
    {% if item.images.main %}
    <img src="{{item.images.main}}?t[]=180q80" style="width:120px; height:68px; object-fit:cover; border-radius:4px;">
    {% endif %}
    {% if item.streamType == 'live' %}
    <span style="position:absolute; top:4px; left:4px; background:#ef4444; color:white; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px;">LIVE</span>
    {% endif %}
  </div>
  <div>
    <h4 style="margin:0 0 4px;">{{item.title}}</h4>
    <p style="margin:0; font-size:14px; color:#666;">{{item.description | truncate: 80}}</p>
  </div>
</div>
{% endfor %}
{% endif %}`
    }
];
