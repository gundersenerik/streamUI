================================================================================
                              SVP BUILDER (StreamUI)
                            Braze Content Generator
================================================================================

SUMMARY
--------------------------------------------------------------------------------
SVP Builder is a web-based tool for generating Braze Connected Content code and
Liquid templates for streaming video platform (SVP) content. It provides an
intuitive interface for fetching and displaying various content types including
live streams, sports events, podcasts, and video on demand (VOD) from Nordic
media providers like VG, Aftonbladet, and Podme.

The application features a three-panel layout with content type navigation,
filter configuration, and code output generation. It supports automated email
workflows for podcast episodes and sports content, generating ready-to-use
Braze code snippets.


TECH STACK
--------------------------------------------------------------------------------
- Frontend:     Vanilla JavaScript (ES6+)
- Styling:      CSS3 with CSS Grid layout
- Build:        Static files (no build process required)
- API:          SVP (Streaming Video Platform) API integration
- Template:     Liquid templating language for Braze


KEY FEATURES
--------------------------------------------------------------------------------
- Multi-provider support (Norwegian/Swedish media outlets)
- Content type filtering (Live, Sports, Podcasts, VOD)
- Podcast series selection with digest mode
- Auto-preview of API results
- Code generation for Braze Connected Content
- Liquid template library with copy functionality
- Dynamic filtering (category, date, access type)


FILE LEGEND
--------------------------------------------------------------------------------
index.html          Main HTML structure with three-panel layout
                    - Left sidebar: Content type navigation
                    - Main area: Filters and preview
                    - Right sidebar: Provider selection and code output

app.js              Core JavaScript application (v6.1)
                    - Content type configurations
                    - Liquid template definitions
                    - API URL builder
                    - Event handlers and UI logic
                    - Preview functionality

styles.css          Complete styling for the application
                    - CSS Grid-based responsive layout
                    - Dark theme sidebar styling
                    - Form controls and filters
                    - Modal and toast notifications


SUPPORTED PROVIDERS
--------------------------------------------------------------------------------
Norwegian:          VG/VGTV, Aftenposten, Bergens Tidende,
                    Stavanger Aftenblad, E24
Swedish:            Aftonbladet, Svenska Dagbladet
Audio:              Podme


================================================================================
