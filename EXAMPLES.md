# Usage Examples - All Live Content & Relative Dates

## New Features Added

### 1. All Live Content Type 🔴
Shows ALL upcoming live streams, not just sports. Includes:
- Live sports matches
- Live news broadcasts
- Live events
- Live shows
- Any other live content

### 2. Relative Date Ranges 📅
Easy date filtering without manual timestamp calculation:
- **All Upcoming** - Everything scheduled in the future
- **Next 7 Days** - Content in the next week
- **Next 14 Days** - Content in the next 2 weeks
- **Next 30 Days** - Content in the next month
- **Today Only** - Only today's content
- **Tomorrow Only** - Only tomorrow's content

---

## Example 1: All Live Content for Next 7 Days

### In the App:
1. Select Provider: **Aftonbladet**
2. Select Content Type: **🔴 All Live Content**
3. Time Range: **Next 7 Days**
4. Limit: **20**

### Generated Code:
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/ab/search?appName=braze_test&filter=streamType::live|flightTimes.start>=1731024000|flightTimes.start<=1731628800&limit=20&sort=flightTimes.start :save ABlive %}

{% if ABlive._embedded.assets.size > 0 %}
  <h2>🔴 Live This Week ({{ABlive._embedded.assets.size}} events)</h2>

  {% for item in ABlive._embedded.assets %}
  <div style="border-left: 4px solid #dd2a30; padding: 15px; margin: 10px 0;">
    <p style="color: #dd2a30; font-weight: bold;">
      {{ item.flightTimes.start | date: "%B %d at %H:%M" }}
    </p>
    <h3>{{ item.title }}</h3>
    <p>{{ item.description | truncate: 120 }}</p>
  </div>
  {% endfor %}
{% else %}
  <p>No live events scheduled</p>
{% endif %}
{% endraw %}
```

---

## Example 2: Live Sports - Next 14 Days (No Sport Filter)

### In the App:
1. Select Provider: **VG**
2. Select Content Type: **🏆 Live Sports Events**
3. Time Range: **Next 14 Days**
4. Sport Type: *(Leave empty for ALL sports)*
5. Limit: **15**

### Generated Code:
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/vgtv/search?appName=edm_antichurn&filter=streamType::live|flightTimes.start>=1731024000|flightTimes.start<=1732233600&limit=15&sort=flightTimes.start&additional=tags|metadata :save VGsports %}

{% if VGsports._embedded.assets.size > 0 %}
  <h2>⚽ Upcoming Matches - Next 2 Weeks</h2>

  {% for match in VGsports._embedded.assets %}
  <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 4px;">
    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
      📅 {{ match.flightTimes.start | date: "%a %b %d, %H:%M" }}
    </div>
    <h3 style="margin: 5px 0;">{{ match.title }}</h3>
    {% if match.additional.metadata.sportType %}
      <span style="background: #0066cc; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px;">
        {{ match.additional.metadata.sportType.value }}
      </span>
    {% endif %}
  </div>
  {% endfor %}
{% else %}
  <p>No matches scheduled</p>
{% endif %}
{% endraw %}
```

---

## Example 3: Today's Live Content Only

### In the App:
1. Select Provider: **Aftonbladet**
2. Select Content Type: **🔴 All Live Content**
3. Time Range: **Today Only**
4. Limit: **10**

### Generated Code:
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/ab/search?appName=braze_test&filter=streamType::live|flightTimes.start>=1731024000|flightTimes.start<=1731110399&limit=10&sort=flightTimes.start :save ABtoday %}

{% if ABtoday._embedded.assets.size > 0 %}
  <h2>🔴 Live Today</h2>

  {% for item in ABtoday._embedded.assets %}
  <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">
    <strong>{{ item.flightTimes.start | date: "%H:%M" }}</strong> - {{ item.title }}
  </div>
  {% endfor %}
{% else %}
  <p>Nothing live today</p>
{% endif %}
{% endraw %}
```

---

## Example 4: Tomorrow's Football Matches

### In the App:
1. Select Provider: **VG**
2. Select Content Type: **🏆 Live Sports Events**
3. Time Range: **Tomorrow Only**
4. Sport Type: **Football**
5. Limit: **5**

### Generated Code:
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/vgtv/search?appName=edm_antichurn&filter=streamType::live|flightTimes.start>=1731110400|flightTimes.start<=1731196799|additional.metadata.sportType::football&limit=5&sort=flightTimes.start&additional=tags|metadata :save VGfootball %}

{% if VGfootball._embedded.assets.size > 0 %}
  <h2>⚽ Tomorrow's Football</h2>

  {% for match in VGfootball._embedded.assets %}
  <p><strong>{{ match.flightTimes.start | date: "%H:%M" }}</strong> {{ match.title }}</p>
  {% endfor %}
{% else %}
  <p>No football tomorrow</p>
{% endif %}
{% endraw %}
```

---

## Example 5: Next 30 Days - All Sports (No Filters)

### In the App:
1. Select Provider: **VG**
2. Select Content Type: **🏆 Live Sports Events**
3. Time Range: **Next 30 Days**
4. Sport Type: *(Leave empty)*
5. Teams: *(Leave empty)*
6. Limit: **50**

### Perfect for monthly newsletters!

---

## Key Benefits

### ✅ **Flexibility**
- Show ALL live content or just sports
- No need to specify sport type if you want everything

### ✅ **Easy Dates**
- No manual timestamp calculation
- "Next 7 days" is easier than timestamps
- Automatically updates based on when campaign runs

### ✅ **Use Cases**
- **Daily emails**: "Today Only"
- **Weekly roundups**: "Next 7 Days"
- **Monthly previews**: "Next 30 Days"
- **Tomorrow's schedule**: "Tomorrow Only"

---

## Tips

1. **Use "All Live Content" when:**
   - You want sports + events + shows
   - You're unsure what categories exist
   - Maximum visibility is needed

2. **Use "Live Sports" when:**
   - You only want sports content
   - You want to filter by specific sports
   - You want to filter by teams

3. **Use relative dates when:**
   - Building recurring campaigns
   - You don't know exact future dates
   - You want dynamic content

---

**These features make it MUCH easier to create flexible, recurring live content campaigns! 🎉**
