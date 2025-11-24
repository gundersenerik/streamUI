# Quick Start Guide

## Getting Started in 2 Minutes

### 1. Open the App
Simply open `index.html` in your web browser (Chrome, Firefox, Safari, or Edge).

### 2. Basic Workflow

#### Example: Create a Live Sports Content Block

**Step 1** → Select "VG (Verdens Gang)" from the provider dropdown

**Step 2** → Click on "🏆 Live Sports Events" card

**Step 3** → Fill in filters (all optional):
- Sport Type: Select from dropdown (fetched from API)
- Teams: Multi-select teams (fetched from API)
- From Date: Pick a start date
- Access Level: Choose "Free" or "Sport Subscription"
- Number of Results: 10 (default)

**Step 4** → Your Connected Content is auto-generated:
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/vgtv/search?appName=edm_antichurn&filter=streamType::live|...&limit=10 :save VGliveSports %}
{% endraw %}
```

**Step 5** → Choose a Liquid template:
- Click "Single Item" tab → Select "Card Layout"
- OR click "List/Loop" tab → Select "Detailed List with Images"
- OR click "Custom Fields" tab → Check boxes for fields you want

**Step 6** → Copy both codes to your Braze campaign!

---

## Real World Example

### Use Case: VG Live Football Matches

**Filters:**
- Provider: VG
- Content Type: Live Sports Events
- Sport Type: Football
- From Date: Today
- Limit: 5
- Sort: Start Time (Newest First)

**Generated Connected Content:**
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/vgtv/search?appName=edm_antichurn&filter=streamType::live|additional.metadata.sportType::football|flightTimes.start>=1699315200&limit=5&sort=-flightTimes.start&additional=tags|metadata :save VGsports %}
{% endraw %}
```

**Generated Liquid (Featured + List):**
```liquid
{% raw %}
<!-- Featured Match -->
{% if VGsports._embedded.assets[0] %}
<div style="border: 2px solid #0066cc; border-radius: 8px; padding: 20px;">
  <img src="{{VGsports._embedded.assets[0].images.main}}" style="width: 100%;">
  <h2>{{VGsports._embedded.assets[0].title}}</h2>
  <p>{{VGsports._embedded.assets[0].description}}</p>
  <a href="YOUR_LINK">Watch Now</a>
</div>
{% endif %}

<!-- Other Matches -->
{% for item in VGsports._embedded.assets offset: 1 %}
<div>
  <h4>{{item.title}}</h4>
  <p>{{item.flightTimes.start | date: '%b %d, %H:%M'}}</p>
</div>
{% endfor %}
{% endraw %}
```

---

## Tips & Tricks

### 1. Variable Naming
The app auto-generates names like:
- `VGsports` (VG + Live Sports)
- `ABpodcasts` (Aftonbladet + Podcasts)
- `VGsportsvod` (VG + Sports VOD)

You can edit these to your preference!

### 2. Date Filtering
When you select a date, the tool automatically converts it to Unix timestamp for the API.

### 3. Multi-Select Teams
Hold `Ctrl` (Windows) or `Cmd` (Mac) to select multiple teams.

### 4. View Full API URL
Click "View Full API URL" under the Connected Content to see the readable version.

### 5. Testing API Calls
Copy the readable API URL and paste it in your browser to test the API response.

### 6. Conditional Content
Use the "Conditional" templates to:
- Show "No content" messages when data is empty
- Display different content for free vs. paid access
- Add "LIVE" badges for currently streaming events

---

## Common Use Cases

### 1. Daily Sports Newsletter
- Content Type: Live Sports Events
- From Date: Today
- To Date: Tomorrow
- Template: Detailed List with Images

### 2. Podcast Series Update
- Content Type: Podcasts
- Category: Select your podcast series
- Limit: 3
- Template: Grid Layout

### 3. Premium Content Promotion
- Content Type: Sports VOD
- Access Level: Sport Subscription
- Sort: Most Viewed
- Template: Card Layout with access indicator

### 4. Upcoming Week Preview
- Content Type: Live Sports Events
- From Date: Today
- To Date: +7 days
- Template: Featured Item + List

---

## Troubleshooting

**Problem**: Dropdowns are empty
- **Solution**: Check browser console for errors. The API might be temporarily unavailable.

**Problem**: No teams/sports showing
- **Solution**: The provider might not have this data. Try a different provider or use manual filtering.

**Problem**: Generated URL doesn't work
- **Solution**: Copy the readable URL and test it in browser. Check if all required filters are set.

**Problem**: Liquid code shows "No content"
- **Solution**: Verify the API returns data by testing the URL directly. Adjust filters to be less restrictive.

---

## Next Steps

1. **Test with Real Data**: Copy the readable API URL to your browser
2. **Customize Templates**: Modify the Liquid code to match your email design
3. **Add Click Tracking**: Replace `YOUR_LINK` placeholders with proper URLs
4. **Test in Braze**: Create a test campaign and verify the output
5. **Save Favorites**: Bookmark commonly used filter combinations

---

**Happy Building! 🚀**
