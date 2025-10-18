# Job Listing Highlighter

A browser extension for Chrome and Firefox that automatically highlights job listings based on their destination URLs. Perfect for streamlining your software engineering internship search on platforms like the PittCSC GitHub repository and other job boards.

## Features

- 🟢 **Preferred Sites** - Highlights easy-to-use application platforms (Greenhouse, Lever, Ashby) in green
- 🟡 **Warning Sites** - Marks tedious application systems (Workday, SuccessFactors) in yellow
- 🔴 **Blocked Sites** - Dims sites you want to avoid in red
- 🎨 **Visual Badges** - Adds icons next to links for instant recognition
- ⚙️ **Customizable Rules** - Define your own URL patterns through an easy-to-use popup
- 🔄 **Dynamic Detection** - Automatically highlights new links as they load on the page
- 💾 **Synced Settings** - Your preferences sync across all your devices

## Installation

### Chrome

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the extension folder
6. The extension icon should appear in your toolbar

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Navigate to the extension folder and select `manifest.json`
5. The extension will be active until you restart Firefox

*Note: For permanent installation in Firefox, you'll need to sign the extension through Mozilla's Add-on Developer Hub.*

## Usage

1. Click the extension icon in your browser toolbar
2. Configure your URL patterns in three categories:
   - **Preferred Sites**: Application platforms you like
   - **Warning Sites**: Platforms with tedious processes
   - **Blocked Sites**: Sites you want to avoid
3. Click **Save Settings**
4. Visit job listing pages (GitHub, LinkedIn, company career pages)
5. Links will be automatically highlighted based on your rules

### Default Configuration

**Preferred (Green):**
- greenhouse.io
- lever.co
- ashbyhq.com

**Warning (Yellow):**
- myworkdayjobs.com
- successfactors.com
- ultipro.com

**Blocked (Red):**
- (none by default)

## Supported Websites

The extension works on any website, but is optimized for:
- GitHub (PittCSC repositories, etc.)
- LinkedIn
- Greenhouse
- Lever
- Workday
- And any other job board

## File Structure

```
job-listing-highlighter/
├── manifest.json          # Extension configuration
├── content.js            # Main highlighting logic
├── styles.css            # Visual styling for highlights
├── popup.html            # Settings interface
├── popup.js              # Settings logic
├── icons/                # Extension icons
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── android-chrome-192x192.png
└── README.md
```

## Customization

### Adding Custom URL Patterns

In the popup interface, add domain patterns (one per line):

```
greenhouse.io
mycompany.com/careers
lever.co
```

The extension will match any URL containing these strings.

### Modifying Colors

Edit `styles.css` to change highlight colors:

```css
.job-highlight-preferred {
  background-color: rgba(34, 197, 94, 0.15) !important;
  border-left: 3px solid #22c55e !important;
}
```

## Technologies Used

- JavaScript (ES6+)
- Chrome Extension API (Manifest V3)
- HTML/CSS
- Chrome Storage API
- MutationObserver API

## Privacy

This extension:
- ✅ Only runs on pages you visit
- ✅ Stores preferences locally in your browser
- ✅ Does not collect or transmit any data
- ✅ Does not require internet connection
- ✅ Open source - inspect the code yourself

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License

MIT License - feel free to use and modify as needed.

## Support

If you encounter issues:
1. Try reloading the extension
2. Check that your URL patterns are correct
3. Verify the extension has permission for the website
4. Open browser console for error messages

## Roadmap

Future improvements:
- [ ] Import/export settings
- [ ] Company name filtering
- [ ] Application deadline tracking
- [ ] Statistics dashboard
- [ ] Firefox Add-ons store publication

---

**Happy job hunting!**