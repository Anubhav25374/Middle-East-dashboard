# 🌍 Middle East Military Intelligence Dashboard

> A dark tactical HUD-style web dashboard displaying open-source military intelligence across the Middle East — built with Leaflet.js, vanilla HTML/CSS/JS, and real GeoJSON country boundaries.

![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)

---

## 📸 Overview

This is a single-page intelligence dashboard that visualizes open-source, declassified military data across the Middle East region. It features a real interactive map with country highlights, military base markers, nuclear site indicators, conflict zones, missile range rings, and a live scrolling intel feed.

All data is sourced from publicly available, open-source references including **SIPRI**, **IISS Military Balance**, **FAS Nuclear Notebook**, and the **Arms Control Association**.

![alt text](https://github.com/Anubhav25374/Middle-East-dashboard/blob/26f4f70fa65b32a3243176840b7ae7192a049cc2/Screenshot%202026-03-03%20185420.png))

---

## ✨ Features

- **Real Interactive Map** powered by Leaflet.js + OpenStreetMap tiles with a custom dark military filter
- **GeoJSON Country Highlights** — Iran, Israel, Saudi Arabia, UAE, Syria, Iraq, Yemen and more, each colored by alliance/threat status
- **30+ Military Asset Markers** with hover popups showing location, assets, personnel, and operational notes:
  - US bases: Al Udeid, Al Dhafra, Camp Arifjan, NSA Bahrain, Camp Lemonnier, Incirlik, Masirah Island and more
  - US Carrier Strike Groups (Arabian Sea + E. Mediterranean)
  - Israeli airbases and the Negev Nuclear Research Center
  - Iranian nuclear facilities (Fordow ☢, Natanz ☢), IRGC missile HQ, Bandar Abbas Naval Base
  - Houthi operations (Yemen) and Hezbollah corridor (Syria/Lebanon)
  - Saudi RSAF bases
  - Russian Hmeimim AB and Tartus Naval Base (Syria)
- **Missile Range Circles** — Iran MRBM ~2,000km, Khorramshahr ~3,200km, Israel Jericho III ~5,500km, USCENTCOM AOR
- **Pulsing Conflict Zone Markers** — Gaza, Yemen, Syria, Iraq
- **Country Intelligence Cards** (left panel) — click to filter asset breakdown; shows threat level badges (ALLY / PARTNER / ADVERSARY / MONITOR)
- **Asset Breakdown Panel** (right panel) — animated progress bars per asset category, updates on country selection
- **Scrolling Intel Feed** — 15 open-source intelligence items auto-scrolling continuously, categorized as CRITICAL / WARNING / INFO
- **Nuclear/Missile Stockpile Chart** — comparative horizontal bar chart (SIPRI 2024 data)
- **Live UTC Clock** updating every second
- **Status Grid** — DEFCON level, US base count, carrier count, active conflict count
- **Tactical HUD Aesthetics** — scanline overlay, glowing animations, Orbitron + Share Tech Mono fonts, ping animations on markers

---

## 🗂️ Project Structure

```
middle-east-dashboard/
├── index.html       # HTML structure and layout
├── style.css        # All styling — dark HUD theme, Leaflet overrides, animations
├── app.js           # All logic — map init, markers, GeoJSON, data, interactions
└── README.md        # This file
```

---

## 🚀 Getting Started

### Prerequisites

No build tools, no npm, no frameworks required. Just a modern browser and an internet connection (for map tiles and GeoJSON boundaries).

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/middle-east-dashboard.git

# Navigate into the project
cd middle-east-dashboard

# Open in browser — use a local server to avoid CORS issues with fetch()
# Option 1: Python (recommended)
python3 -m http.server 8080

# Option 2: Node.js
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then open your browser at `http://localhost:8080`

> ⚠️ **Important:** Opening `index.html` directly via `file://` will cause the GeoJSON fetch to fail due to browser CORS restrictions. Always use a local HTTP server. The map markers will still work — only the country boundary highlights require the fetch.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Leaflet.js v1.9.4](https://leafletjs.com/) | Interactive real map |
| [OpenStreetMap](https://www.openstreetmap.org/) | Map tile provider |
| [geo-countries GeoJSON](https://github.com/datasets/geo-countries) | Country boundary polygons |
| [Google Fonts — Orbitron](https://fonts.google.com/specimen/Orbitron) | Display / HUD headers |
| [Google Fonts — Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) | Monospace body text |
| Vanilla HTML / CSS / JS | No frameworks, no build step |

---

## 🗺️ Map Interactions

| Action | Result |
|---|---|
| Click country boundary | Selects country, updates asset breakdown panel |
| Click left panel card | Same as clicking country on map |
| Hover marker | Shows popup with base details |
| Hover range circle | Shows tooltip with range label |
| Hover country | Brightens country fill color |
| Scroll / Zoom | Standard Leaflet pan & zoom |

---

## 📊 Data Sources

All data is open-source and declassified. No classified or proprietary intelligence is used.

| Source | Data Used |
|---|---|
| [SIPRI](https://www.sipri.org/) | Nuclear warhead stockpile estimates |
| [IISS Military Balance](https://www.iiss.org/publications/the-military-balance) | Force structure, base locations, equipment counts |
| [FAS Nuclear Notebook](https://fas.org/issues/nuclear-weapons/nuclear-notebook/) | Nuclear program estimates |
| [Arms Control Association](https://www.armscontrol.org/) | Treaty status, enrichment data |
| Open-source journalism | Conflict zone status, proxy force activity |

---

## ⚙️ Configuration

All marker data, country highlights, and asset panel data live in `app.js` and are easy to modify.

### Add a new base marker

```javascript
// In app.js — follow this pattern
L.marker([LAT, LNG], { icon: mkIcon('marker-usa', '✈', 28) })
  .addTo(map)
  .bindPopup(mkPopup('Base Name', '#00aaff', [
    ['LOCATION', 'Country'],
    ['ASSETS',   'Aircraft types'],
    ['PERSONNEL','~1,000'],
    ['NOTES',    'Operational role'],
  ]), { maxWidth: 260 });
```

### Marker classes

| Class | Color | Used For |
|---|---|---|
| `marker-usa` | Blue `#00aaff` | US military assets |
| `marker-israel` | Yellow `#ffcc00` | IDF assets |
| `marker-iran` | Orange `#ff8800` | IRGC / Iran assets |
| `marker-saudi` | Red `#ff3333` | Saudi RSAF assets |
| `marker-russia` | Purple `#cc44ff` | Russian assets |
| `marker-uae` | Green `#00ff88` | UAE assets |
| `marker-nuke` | Yellow dashed | Nuclear facilities |
| `marker-carrier` | Blue dashed | Carrier strike groups |
| `marker-conflict` | Red pulsing | Active conflict zones |

### Update country asset data

In `app.js`, edit the `COUNTRY_DATA` object. Each country entry has a `title`, `color`, and `sections` array:

```javascript
var COUNTRY_DATA = {
  usa: {
    title: 'UNITED STATES',
    color: '#00aaff',
    sections: [
      { title: 'AIR ASSETS', items: [
        { name: 'F-35A Lightning II', count: '450+', pct: 90 },
        // add more items...
      ]},
    ]
  },
  // add more countries...
};
```

---

## 🎨 Theming

All colors are defined as CSS variables in `style.css`:

```css
:root {
  --green:  #00ff88;
  --red:    #ff3333;
  --yellow: #ffcc00;
  --blue:   #00aaff;
  --orange: #ff8800;
  --purple: #cc44ff;
  --bg:     #020c0e;   /* main background */
  --panel:  #041418;   /* panel background */
  --border: #0a3040;   /* border color */
  --text:   #7ecfdf;   /* primary text */
  --dim:    #2a5560;   /* secondary/muted text */
}
```

---

## 📋 Roadmap / Possible Enhancements

- [ ] Add toggle buttons to show/hide marker categories (bases, nukes, conflicts)
- [ ] Add country comparison mode side-by-side
- [ ] Add real-time news feed via RSS/API for the intel ticker
- [ ] Mobile responsive layout
- [ ] Add historical timeline slider for conflict data
- [ ] Add satellite imagery layer toggle
- [ ] Export map view as PNG/PDF

---

## ⚠️ Disclaimer

This project is built entirely from **open-source, publicly available, and declassified information**. It is intended for **educational and informational purposes only**.

- No classified or sensitive government data is used
- Military figures are estimates from publicly available think-tank reports
- This is not affiliated with any government, military organization, or intelligence agency
- Data may not reflect the most current situation on the ground

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- Map tiles by [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
- Country GeoJSON by [datasets/geo-countries](https://github.com/datasets/geo-countries)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Interactive map by [Leaflet.js](https://leafletjs.com/)

---

<div align="center">
  <sub>Built with open-source intelligence. Data from SIPRI · IISS · FAS · Arms Control Association.</sub>
</div>


---
## Live

[Click here](https://middle-easr-dashboard.netlify.app/)
