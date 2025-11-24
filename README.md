# Braze Connected Content Builder for SVP API

A user-friendly web application that helps Braze users generate Connected Content API calls and Liquid templates for SVP (Stream Video Platform) API integration.

## Overview

This tool eliminates the need for manual coding of Connected Content calls and Liquid templating by providing an intuitive UI that generates the correct code based on user selections.

## Features

### 1. Provider Selection
- Dynamically fetches available providers from SVP API
- Supports multiple Schibsted brands (VG, Aftonbladet, BT, Aftenbladet, etc.)

### 2. Content Type Selection
- **Live Sports Events**: Filter by sport type, teams, dates, access level
- **Sports VOD**: Filter sports video on demand content
- **Podcasts**: Filter audio content and episodes
- **General Content**: Flexible filtering for all content types

### 3. Dynamic Filter Builder
- Automatically fetches filter options from API:
  - Sport types
  - Teams/tags
  - Categories
- Date/time filtering with timestamp conversion
- Multi-select for teams and tags
- Number inputs for limits and pagination

### 4. Connected Content Generator
- Generates properly formatted `{% connected_content %}` tags
- Handles URL encoding automatically
- Auto-generates variable names based on provider and content type
- Allows custom variable name editing
- Shows both encoded and readable API URLs

### 5. Liquid Template Library
- **Single Item Templates**: Display first result in various formats
- **Loop Templates**: Iterate through multiple results
- **Conditional Templates**: Show/hide based on data availability, access levels, live status
- **Custom Field Builder**: Select specific fields to display
- **Mixed Templates**: Combine featured and list layouts

### 6. Copy-to-Clipboard
- One-click copying of Connected Content code
- One-click copying of Liquid templates
- Success notifications

## File Structure

```
braze-svp-builder/
├── index.html              # Main HTML structure
├── css/
│   └── styles.css          # Clean, minimal styling
└── js/
    ├── app.js              # Main application controller
    ├── providers.js        # Provider configurations and API fetching
    ├── content-types.js    # Content type definitions and filters
    ├── filter-builder.js   # Dynamic filter rendering and API fetching
    ├── url-generator.js    # Connected Content URL builder
    ├── liquid-library.js   # Liquid template library
    └── utils.js            # Utility functions
```

## How to Use

### Step 1: Select Provider
Choose your brand/newsroom from the dropdown menu.

### Step 2: Select Content Type
Click on the type of content you want to fetch:
- Live Sports Events
- Sports VOD
- Podcasts
- General Video Content

### Step 3: Configure Filters
Fill in the filters based on your needs:
- Sport types, teams, and leagues are fetched dynamically from the API
- Set date ranges for upcoming events
- Choose access levels (free, sport subscription, etc.)
- Set number of results and sort order

### Step 4: Copy Connected Content
The tool generates:
```liquid
{% raw %}
{% connected_content https://svp.vg.no/svp/api/v1/vgtv/search?... :save VGsports %}
{% endraw %}
```
Click "Copy to Clipboard" and paste into your Braze campaign.

### Step 5: Select Liquid Template
Choose a template or build custom fields:
- Select from pre-built templates
- Or check the fields you want to display in the Custom tab
The tool generates the Liquid code using your variable name.

### Step 6: Copy Liquid Code
Click "Copy to Clipboard" for your Liquid template and paste it into your Braze message.

## API Integration

### Dynamic Data Fetching
The tool fetches data from SVP API endpoints:

- **Providers**: `/v1/providers`
- **Sport Types**: Extracted from `/v1/{provider}/search?additional=metadata`
- **Teams/Tags**: `/v1/{provider}/tags`
- **Categories**: `/v1/{provider}/categories`

### Filter Syntax
The tool generates proper SVP API filter syntax:
- `::` for exact match
- `<>` for IN operator (multiple values)
- `>=` / `<=` for date comparisons
- `|` to combine multiple filters

## Technical Details

### No Dependencies
- Pure HTML, CSS, and JavaScript
- No frameworks or build tools required
- Works in any modern browser

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CORS
The SVP API allows cross-origin requests, so the tool can fetch data directly from the browser.

## Deployment

### Option 1: Local File
Simply open `index.html` in a web browser.

### Option 2: Web Server
Host on any static web server:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

### Option 3: Internal Network
Deploy to your organization's internal web server.

## Future Enhancements

Potential features for future versions:
- Save/load filter configurations
- Recent queries history
- Template customization UI
- Additional content types
- Preview mode with real API data
- Export configurations as JSON

## Support

For issues or questions:
1. Check the SVP API documentation
2. Verify filter syntax in API docs
3. Test API calls directly in browser console
4. Contact SVP API support team

## License

Internal tool for Schibsted newsrooms.

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Author**: Erik (based on VG newsroom integration experience)
