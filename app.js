/* ============================================================
   CENTCOM // Middle East Military Intelligence Dashboard
   app.js  -  Leaflet real map + all dashboard logic
   ============================================================ */

/* UTC Clock */
function updateClock() {
  var n = new Date();
  var pad = function(v) { return String(v).padStart(2,'0'); };
  document.getElementById('clock').textContent =
    pad(n.getUTCHours())+':'+pad(n.getUTCMinutes())+':'+pad(n.getUTCSeconds())+' UTC';
}
setInterval(updateClock, 1000);
updateClock();

/* Country asset data */
var COUNTRY_DATA = {
  usa: {
    title: 'UNITED STATES', color: '#00aaff',
    sections: [
      { title: 'AIR ASSETS', items: [
        { name: 'F-35A/B/C Lightning II', count: '450+', pct: 90 },
        { name: 'F-15E/SA Strike Eagle', count: '200+', pct: 60 },
        { name: 'B-52H Stratofortress', count: '76', pct: 40 },
        { name: 'B-2 Spirit Stealth', count: '20', pct: 15 },
        { name: 'MQ-9 Reaper Drone', count: '300+', pct: 70 },
      ]},
      { title: 'NAVAL ASSETS', items: [
        { name: 'Aircraft Carriers (CVN)', count: '11', pct: 85 },
        { name: 'Destroyers (Arleigh Burke)', count: '90+', pct: 75 },
        { name: 'SSN Attack Submarines', count: '50+', pct: 65 },
        { name: 'SSBN Ballistic Submarines', count: '14', pct: 50 },
      ]},
      { title: 'NUCLEAR / MISSILES', items: [
        { name: 'Nuclear Warheads (total)', count: '5,500', pct: 95 },
        { name: 'Deployed Warheads', count: '1,700', pct: 55 },
        { name: 'Tomahawk LACM', count: '4,000+', pct: 80 },
        { name: 'Patriot PAC-3 Batteries', count: '15+', pct: 60 },
      ]},
    ]
  },
  israel: {
    title: 'ISRAEL (IDF)', color: '#ffcc00',
    sections: [
      { title: 'AIR FORCE', items: [
        { name: 'F-35I Adir', count: '36', pct: 55 },
        { name: 'F-15I Raam', count: '25', pct: 40 },
        { name: 'F-16I Sufa', count: '175', pct: 75 },
        { name: 'Heron / Hermes Drones', count: '200+', pct: 70 },
      ]},
      { title: 'NUCLEAR (ESTIMATED)', items: [
        { name: 'Nuclear Warheads (est.)', count: '~90', pct: 45 },
        { name: 'Jericho III ICBM', count: 'Classified', pct: 30 },
        { name: 'Dolphin-class SSK', count: '6', pct: 35 },
        { name: 'Arrow 3 ABM System', count: 'Active', pct: 60 },
      ]},
    ]
  },
  iran: {
    title: 'IRAN (IRGC)', color: '#ff8800',
    sections: [
      { title: 'BALLISTIC MISSILES', items: [
        { name: 'Shahab-3 MRBM', count: '300+', pct: 70 },
        { name: 'Emad / Ghadr', count: '100+', pct: 45 },
        { name: 'Khorramshahr MRBM', count: 'Active', pct: 40 },
        { name: 'Fateh-110 SRBM', count: '500+', pct: 80 },
        { name: 'Shahed-136 Kamikaze Drone', count: '2,000+', pct: 90 },
      ]},
      { title: 'NUCLEAR PROGRAM', items: [
        { name: 'Enrichment Level', count: '60%', pct: 60 },
        { name: 'Enriched Uranium (kg)', count: '~6,200', pct: 85 },
        { name: 'Advanced Centrifuges', count: 'IR-6/9', pct: 70 },
        { name: 'Breakout Time (est.)', count: '~1 week', pct: 90 },
      ]},
      { title: 'PROXY FORCES', items: [
        { name: 'Hezbollah (Lebanon)', count: '~150k rockets', pct: 85 },
        { name: 'Houthis (Yemen)', count: 'Active', pct: 60 },
        { name: 'PMF (Iraq)', count: '130k fighters', pct: 75 },
        { name: 'Hamas (Gaza)', count: 'Degraded', pct: 30 },
      ]},
    ]
  },
  saudi: {
    title: 'SAUDI ARABIA', color: '#ff3333',
    sections: [
      { title: 'AIR FORCE', items: [
        { name: 'F-15SA Advanced Eagle', count: '84', pct: 60 },
        { name: 'Eurofighter Typhoon', count: '72', pct: 55 },
        { name: 'F-15C/D Eagle', count: '70+', pct: 50 },
        { name: 'Tornado IDS', count: '50+', pct: 35 },
      ]},
      { title: 'MISSILE DEFENSE', items: [
        { name: 'Patriot PAC-2/3', count: '9 batteries', pct: 65 },
        { name: 'THAAD System', count: '1 battery', pct: 20 },
        { name: 'DF-21 MRBM (CN origin)', count: 'Deployed', pct: 50 },
        { name: 'CSS-5 Ballistic', count: 'Est. 60', pct: 40 },
      ]},
    ]
  },
  uae: {
    title: 'UNITED ARAB EMIRATES', color: '#00ff88',
    sections: [
      { title: 'AIR FORCE', items: [
        { name: 'F-16E/F Block 60 Desert Falcon', count: '79', pct: 70 },
        { name: 'Mirage 2000-9', count: '63', pct: 55 },
        { name: 'F-35A (on order)', count: '50 order', pct: 30 },
        { name: 'MALE Drones', count: 'Active', pct: 50 },
      ]},
      { title: 'DEFENSE SYSTEMS', items: [
        { name: 'Patriot PAC-3', count: '3 batteries', pct: 45 },
        { name: 'THAAD (US-deployed)', count: '1', pct: 20 },
        { name: 'Sky Hunter ABM', count: 'Active', pct: 30 },
      ]},
    ]
  },
  russia: {
    title: 'RUSSIA (SYRIA OPS)', color: '#cc44ff',
    sections: [
      { title: 'DEPLOYED IN SYRIA', items: [
        { name: 'Su-35S Flanker-E', count: '12', pct: 40 },
        { name: 'Su-34 Fullback', count: '8', pct: 30 },
        { name: 'Tu-22M3 Backfire', count: 'Rotational', pct: 25 },
        { name: 'S-400 Triumf SAM', count: '1 battery', pct: 60 },
      ]},
      { title: 'TOTAL ARSENAL', items: [
        { name: 'Nuclear Warheads', count: '6,257', pct: 100 },
        { name: 'Deployed Warheads', count: '1,558', pct: 58 },
        { name: 'Iskander SRBM Launchers', count: '100+', pct: 70 },
      ]},
    ]
  }
};

function renderAssetPanel(id) {
  var d = COUNTRY_DATA[id];
  if (!d) return;
  var panel = document.getElementById('assetPanel');
  var html = '<div class="ap-country-name" style="color:'+d.color+'">'+d.title+'</div>';
  d.sections.forEach(function(sec) {
    html += '<div class="ap-section"><div class="ap-section-title">'+sec.title+'</div>';
    sec.items.forEach(function(item) {
      html += '<div class="ap-row"><span class="ap-name">'+item.name+'</span><span class="ap-count">'+item.count+'</span></div>';
      html += '<div class="ap-bar"><div class="ap-fill" style="background:'+d.color+'" data-w="'+item.pct+'"></div></div>';
    });
    html += '</div>';
  });
  panel.innerHTML = html;
  setTimeout(function() {
    panel.querySelectorAll('.ap-fill').forEach(function(el) { el.style.width = el.dataset.w + '%'; });
  }, 60);
}

function selectCountry(id) {
  document.querySelectorAll('.country-card').forEach(function(c) { c.classList.remove('active'); });
  var card = document.querySelector('.card-'+id);
  if (card) card.classList.add('active');
  renderAssetPanel(id);
}

renderAssetPanel('usa');

setTimeout(function() {
  document.querySelectorAll('.sbar-fill').forEach(function(el) { el.style.width = el.dataset.w + '%'; });
}, 400);

/* Intel feed */
var FEED_ITEMS = [
  { type: 'critical', time: '00:04', text: 'IRAN: Fordow enrichment at 60% — IAEA confirms IR-6 centrifuge cascade operational' },
  { type: 'warning',  time: '00:12', text: 'HOUTHI: Ballistic missile launch detected Red Sea corridor — USS Gravely intercept' },
  { type: 'info',     time: '00:18', text: 'USA: USS Gerald R. Ford CSG entered Arabian Sea — 6 escort vessels, F/A-18 deployed' },
  { type: 'warning',  time: '00:31', text: 'IRAN: IRGC Navy swarm exercise — Strait of Hormuz, 200+ vessels observed' },
  { type: 'info',     time: '00:44', text: 'ISRAEL: Arrow 3 intercept test successful — ICBM-range target neutralized' },
  { type: 'critical', time: '01:02', text: 'IRAN: Breakout timeline under 2 weeks if enrichment reaches 90% — US Intel' },
  { type: 'info',     time: '01:15', text: 'USA: B-52H sortie departed Diego Garcia — Indian Ocean training mission' },
  { type: 'warning',  time: '01:28', text: 'HOUTHI: Anti-ship ballistic missile targeted commercial tanker — intercept successful' },
  { type: 'info',     time: '01:47', text: 'SAUDI: RSAF F-15SA intercept drone southern border — Houthi-attributed UAV' },
  { type: 'critical', time: '02:03', text: 'RUSSIA: Su-35S sortie rate increased over northern Syria — Latakia monitored' },
  { type: 'info',     time: '02:19', text: 'USA: 2 additional Patriot PAC-3 batteries redeploying to Al Udeid, Qatar' },
  { type: 'warning',  time: '02:34', text: 'IRAN: Satellite imagery confirms underground facility expansion at Natanz' },
  { type: 'info',     time: '02:51', text: 'UAE: F-35A negotiations advanced — 50-unit order pending US congressional approval' },
  { type: 'critical', time: '03:10', text: 'INTEL: Iran proxy network activated across 4 countries — coordinated posture suspected' },
  { type: 'warning',  time: '03:28', text: 'ISRAEL: IDF Northern Command elevated to ALPHA — Hezbollah border activity' },
];

var feedViewport = document.createElement('div');
feedViewport.className = 'feed-viewport';
document.getElementById('feedTrack').appendChild(feedViewport);

FEED_ITEMS.forEach(function(item) {
  var div = document.createElement('div');
  div.className = 'feed-item fi-'+item.type;
  div.innerHTML = '<span class="fi-time">'+item.time+'</span><span class="fi-text">'+item.text+'</span>';
  feedViewport.appendChild(div);
});

var feedOffset = 0;
var feedTrack = document.getElementById('feedTrack');
setInterval(function() {
  feedOffset += 0.5;
  var maxScroll = feedViewport.scrollHeight - feedTrack.clientHeight;
  if (feedOffset >= maxScroll) feedOffset = 0;
  feedViewport.style.transform = 'translateY(-'+feedOffset+'px)';
}, 30);

/* ===== Leaflet Map ===== */
var map = L.map('map', {
  center: [27, 48], zoom: 5, minZoom: 3, maxZoom: 10,
  zoomControl: true, attributionControl: false,
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

function mkIcon(cls, icon, size) {
  size = size || 26;
  return L.divIcon({
    className: '',
    html: '<div class="custom-marker '+cls+'" style="width:'+size+'px;height:'+size+'px">'+icon+'</div>',
    iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -(size/2+4)],
  });
}

function mkPopup(name, color, rows) {
  var html = '<div class="popup-name" style="color:'+color+'">'+name+'</div>';
  rows.forEach(function(r) {
    html += '<div class="popup-row"><span class="popup-label">'+r[0]+'</span><span class="popup-val">'+r[1]+'</span></div>';
  });
  return html;
}

/* USA Bases */
[
  { ll:[25.117,51.315], n:'Al Udeid Air Base', r:[['LOCATION','Qatar'],['ASSETS','F-15, F-35, B-52, AWACS'],['PERSONNEL','~10,000'],['NOTES','USCENTCOM Forward HQ']] },
  { ll:[24.248,54.591], n:'Al Dhafra AB', r:[['LOCATION','UAE'],['ASSETS','F-35A, U-2, RQ-4'],['PERSONNEL','~3,500'],['NOTES','5th Fleet air support']] },
  { ll:[29.196,47.941], n:'Camp Arifjan', r:[['LOCATION','Kuwait'],['ASSETS','Abrams, Patriot, AH-64'],['PERSONNEL','~13,000'],['NOTES','Main US Army land hub']] },
  { ll:[26.211,50.595], n:'NSA Bahrain 5th Fleet', r:[['LOCATION','Bahrain'],['ASSETS','Destroyers, littoral ships'],['PERSONNEL','~7,000'],['NOTES','Naval HQ CENTCOM AOR']] },
  { ll:[11.547,43.145], n:'Camp Lemonnier', r:[['LOCATION','Djibouti'],['ASSETS','MQ-9, P-8, JSOC'],['PERSONNEL','~4,000'],['NOTES','Horn of Africa ops']] },
  { ll:[36.985,35.426], n:'Incirlik AB', r:[['LOCATION','Turkey'],['ASSETS','F-16, ~50 B61 nukes'],['PERSONNEL','~1,500'],['NOTES','NATO nuclear sharing']] },
  { ll:[23.614,58.591], n:'Masirah Island AB', r:[['LOCATION','Oman'],['ASSETS','ISR, drones, maritime patrol'],['NOTES','Indian Ocean access node']] },
  { ll:[29.342,47.659], n:'Ali Al Salem AB', r:[['LOCATION','Kuwait'],['ASSETS','A-10, F-16, C-17'],['PERSONNEL','~2,000'],['NOTES','Tactical air operations']] },
].forEach(function(b) {
  L.marker(b.ll, { icon: mkIcon('marker-usa','&#9992;',28) }).addTo(map)
    .bindPopup(mkPopup(b.n,'#00aaff',b.r),{maxWidth:260});
});

/* Carrier groups */
[
  { ll:[22.0,62.0], n:'CSG — Arabian Sea',    r:[['ASSETS','CVN, 2xDDG, CG, SSN, F/A-18'],['PERSONNEL','~6,500'],['NOTES','Rapid strike deterrence']] },
  { ll:[34.8,28.0], n:'CSG — E. Mediterranean', r:[['ASSETS','CVN, DDG squadron'],['PERSONNEL','~6,500'],['NOTES','Med power projection']] },
].forEach(function(b) {
  L.marker(b.ll, { icon: mkIcon('marker-carrier','&#10022;',34) }).addTo(map)
    .bindPopup(mkPopup(b.n,'#00aaff',b.r),{maxWidth:260});
});

/* Israel */
[
  { ll:[31.208,34.666], n:'Nevatim Air Base',              icon:mkIcon('marker-israel','&#9992;',26), r:[['LOCATION','Negev, Israel'],['ASSETS','F-35I Adir, F-15I Raam'],['NOTES','Primary strike base']] },
  { ll:[30.603,35.013], n:'Negev Nuclear Research Center', icon:mkIcon('marker-nuke','&#9762;',28),   r:[['LOCATION','Dimona, Israel'],['ASSETS','Plutonium reactor'],['NOTES','~90 est. warheads']] },
  { ll:[31.666,34.583], n:'Tel Nof Air Base',              icon:mkIcon('marker-israel','&#9992;',26), r:[['LOCATION','Central Israel'],['ASSETS','F-16I Sufa, helicopters'],['NOTES','Air superiority']] },
  { ll:[33.078,35.683], n:'IDF Northern Command',          icon:mkIcon('marker-israel','&#128737;',26), r:[['LOCATION','Northern Israel'],['ASSETS','Iron Dome, Davids Sling'],['NOTES','Hezbollah border response']] },
].forEach(function(b) {
  L.marker(b.ll, { icon: b.icon }).addTo(map)
    .bindPopup(mkPopup(b.n,'#ffcc00',b.r),{maxWidth:260});
});

/* Iran */
[
  { ll:[34.649,50.726], n:'Fordow Enrichment',    icon:mkIcon('marker-nuke','&#9762;',28),   r:[['LOCATION','Qom, Iran'],['ASSETS','IR-6 centrifuges, 60% U-235'],['NOTES','Underground hardened']] },
  { ll:[33.724,51.728], n:'Natanz Nuclear',        icon:mkIcon('marker-nuke','&#9762;',28),   r:[['LOCATION','Isfahan, Iran'],['ASSETS','Advanced centrifuges'],['NOTES','Primary enrichment site']] },
  { ll:[35.700,51.337], n:'IRGC Aerospace HQ',    icon:mkIcon('marker-iran','&#9650;',26),    r:[['LOCATION','Tehran'],['ASSETS','Shahab-3, Emad, Shahed-136'],['PERSONNEL','~15,000']] },
  { ll:[27.185,56.261], n:'Bandar Abbas Naval',    icon:mkIcon('marker-iran','&#9875;',26),    r:[['LOCATION','Hormozgan'],['ASSETS','Frigates, Kilo subs, speedboats'],['NOTES','Strait of Hormuz control']] },
  { ll:[31.326,48.669], n:'Dezful Missile Base',   icon:mkIcon('marker-iran','&#9650;',24),    r:[['LOCATION','Khuzestan'],['ASSETS','Fateh-110, Zolfaghar SRBM'],['NOTES','Underground silo complex']] },
  { ll:[15.369,44.191], n:'Houthi Ops — Yemen',    icon:mkIcon('marker-iran','&#9889;',28),    r:[['LOCATION','Sanaa, Yemen'],['ASSETS','Ballistic missiles, Shahed drones'],['PERSONNEL','~200,000 fighters']] },
  { ll:[33.510,36.291], n:'Hezbollah — Damascus',  icon:mkIcon('marker-iran','&#9889;',26),    r:[['LOCATION','Syria/Lebanon'],['ASSETS','~150,000 rockets & missiles'],['NOTES','Primary proxy vs Israel']] },
].forEach(function(b) {
  L.marker(b.ll, { icon: b.icon }).addTo(map)
    .bindPopup(mkPopup(b.n,'#ff8800',b.r),{maxWidth:260});
});

/* Saudi */
[
  { ll:[23.819,49.014], n:'Prince Sultan AB',       r:[['LOCATION','Al Kharj'],['ASSETS','F-15SA, Patriot, THAAD'],['PERSONNEL','~3,000 US']] },
  { ll:[21.709,39.180], n:'King Abdul Aziz AB',     r:[['LOCATION','Jeddah'],['ASSETS','Eurofighter Typhoon, C-130'],['NOTES','Western sector defense']] },
  { ll:[26.265,50.155], n:'Dhahran RSAF Base',      r:[['LOCATION','Eastern Province'],['ASSETS','F-15C/D, Patriot PAC-3'],['NOTES','Gulf sector HQ']] },
].forEach(function(b) {
  L.marker(b.ll, { icon: mkIcon('marker-saudi','&#9733;',26) }).addTo(map)
    .bindPopup(mkPopup(b.n,'#ff3333',b.r),{maxWidth:260});
});

/* UAE */
L.marker([24.248,54.591], { icon: mkIcon('marker-uae','&#9670;',24) }).addTo(map)
  .bindPopup(mkPopup('Al Dhafra AB','#00ff88',[['LOCATION','Abu Dhabi'],['ASSETS','F-16E/F Block 60, F-35A future'],['NOTES','F-35 integration in progress']]),{maxWidth:260});

/* Russia */
[
  { ll:[35.401,35.948], n:'Hmeimim AB',      r:[['LOCATION','Latakia, Syria'],['ASSETS','Su-35S, Su-34, Tu-22M3, S-400'],['PERSONNEL','~4,000'],['NOTES','Russia ME air HQ']] },
  { ll:[34.890,35.869], n:'Tartus Naval Base', r:[['LOCATION','Tartus, Syria'],['ASSETS','Frigates, submarines'],['NOTES',"Russia only Med naval base"]] },
].forEach(function(b) {
  L.marker(b.ll, { icon: mkIcon('marker-russia','R',26) }).addTo(map)
    .bindPopup(mkPopup(b.n,'#cc44ff',b.r),{maxWidth:260});
});

/* Conflict zones */
[
  { ll:[31.5,34.45],  n:'CONFLICT — Gaza',    r:[['STATUS','Active warfare'],['PARTIES','IDF vs Hamas'],['INTENSITY','HIGH']] },
  { ll:[15.5,44.2],   n:'CONFLICT — Yemen',   r:[['STATUS','Active warfare'],['PARTIES','Saudi coalition vs Houthis'],['INTENSITY','HIGH']] },
  { ll:[33.3,36.3],   n:'TENSION — Syria',    r:[['STATUS','Fragmented conflict'],['INTENSITY','MEDIUM'],['NOTES','Israeli IRGC strikes frequent']] },
  { ll:[33.2,43.8],   n:'TENSION — Iraq',     r:[['STATUS','PMF / militia activity'],['INTENSITY','MEDIUM'],['NOTES','Rocket drone attacks ongoing']] },
].forEach(function(z) {
  L.marker(z.ll, { icon: mkIcon('marker-conflict','!',30) }).addTo(map)
    .bindPopup(mkPopup(z.n,'#ff3333',z.r),{maxWidth:260});
});

/* Range circles */
L.circle([35.7,51.4], { radius:2000000, color:'#ff8800', weight:1, opacity:.35, fillColor:'#ff8800', fillOpacity:.03, dashArray:'6 6' }).addTo(map)
  .bindTooltip('IRAN MRBM ~2,000km',{className:'range-tooltip'});
L.circle([35.7,51.4], { radius:3200000, color:'#ff8800', weight:0.5, opacity:.15, fillColor:'#ff8800', fillOpacity:.01, dashArray:'3 9' }).addTo(map);
L.circle([31.5,34.9], { radius:2500000, color:'#ffcc00', weight:1, opacity:.28, fillColor:'#ffcc00', fillOpacity:.02, dashArray:'6 6' }).addTo(map)
  .bindTooltip('IDF JERICHO III ~5,500km',{className:'range-tooltip'});
L.circle([25.3,55.0], { radius:3500000, color:'#00aaff', weight:0.6, opacity:.15, fillColor:'#00aaff', fillOpacity:.01, dashArray:'4 8' }).addTo(map)
  .bindTooltip('USCENTCOM AOR',{className:'range-tooltip'});

/* GeoJSON country highlights */
var HIGHLIGHTS = {
  'Iran':                 { color:'#ff8800', fillOpacity:0.14 },
  'Israel':               { color:'#ffcc00', fillOpacity:0.18 },
  'Saudi Arabia':         { color:'#ff3333', fillOpacity:0.12 },
  'United Arab Emirates': { color:'#00ff88', fillOpacity:0.14 },
  'Iraq':                 { color:'#7ecfdf', fillOpacity:0.07 },
  'Syria':                { color:'#cc44ff', fillOpacity:0.10 },
  'Yemen':                { color:'#ff5555', fillOpacity:0.10 },
  'Kuwait':               { color:'#00aaff', fillOpacity:0.12 },
  'Qatar':                { color:'#00aaff', fillOpacity:0.12 },
  'Bahrain':              { color:'#00aaff', fillOpacity:0.14 },
  'Oman':                 { color:'#7ecfdf', fillOpacity:0.07 },
  'Jordan':               { color:'#7ecfdf', fillOpacity:0.06 },
  'Lebanon':              { color:'#ff8800', fillOpacity:0.10 },
  'Turkey':               { color:'#00aaff', fillOpacity:0.07 },
  'Egypt':                { color:'#7ecfdf', fillOpacity:0.06 },
  'Pakistan':             { color:'#3a5060', fillOpacity:0.06 },
  'Afghanistan':          { color:'#3a5060', fillOpacity:0.06 },
  'Sudan':                { color:'#3a5060', fillOpacity:0.05 },
  'Ethiopia':             { color:'#3a5060', fillOpacity:0.05 },
  'Somalia':              { color:'#3a5060', fillOpacity:0.04 },
  'Libya':                { color:'#3a5060', fillOpacity:0.05 },
};

var countryMap = { 'Iran':'iran','Israel':'israel','Saudi Arabia':'saudi','United Arab Emirates':'uae','Syria':'russia' };

fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
  .then(function(r){ return r.json(); })
  .then(function(data) {
    L.geoJSON(data, {
      style: function(f) {
        var h = HIGHLIGHTS[f.properties.ADMIN];
        if (h) return { color:h.color, weight:1.5, opacity:.6, fillColor:h.color, fillOpacity:h.fillOpacity };
        return { color:'#0a3040', weight:.5, opacity:.3, fillColor:'#031218', fillOpacity:.55 };
      },
      onEachFeature: function(f, layer) {
        var name = f.properties.ADMIN;
        var h = HIGHLIGHTS[name];
        if (!h) return;
        layer.on('mouseover', function(){ this.setStyle({ fillOpacity: h.fillOpacity * 2.2 }); });
        layer.on('mouseout',  function(){ this.setStyle({ fillOpacity: h.fillOpacity }); });
        var cid = countryMap[name];
        if (cid) layer.on('click', function(){ selectCountry(cid); });
      }
    }).addTo(map);
  })
  .catch(function(){ console.warn('GeoJSON load failed - markers still functional'); });

map.fitBounds([[10,25],[42,78]]);
