let map, currentPolyline;
const driverWhatsAppNumber = "00393476308563";

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleButton(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggleButton(newTheme);
}

function updateThemeToggleButton(theme) {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

const locations = {
  "Airport": { lat: 51.4700, lng: -0.4543 },
  "City Center": { lat: 51.5074, lng: -0.1278 },
  "Hotel Zone": { lat: 51.5150, lng: -0.1420 },
  "Olbia via Marina, Sardegna": { lat: 40.9294, lng: 9.5145 }
};

const priceTable = [
  { from: "Airport", to: "City Center", price: 40 },
  { from: "Airport", to: "Hotel Zone", price: 55 },
  { from: "City Center", to: "Hotel Zone", price: 25 },
  { from: "City Center", to: "Airport", price: 40 },
  { from: "Hotel Zone", to: "Airport", price: 55 },
  { from: "Hotel Zone", to: "City Center", price: 25 }
];

const travelTimes = {
  "Airport-City Center": { duration: "35 mins", distance: "24 km" },
  "Airport-Hotel Zone": { duration: "42 mins", distance: "28 km" },
  "City Center-Hotel Zone": { duration: "15 mins", distance: "8 km" },
  "City Center-Airport": { duration: "38 mins", distance: "24 km" },
  "Hotel Zone-Airport": { duration: "40 mins", distance: "28 km" },
  "Hotel Zone-City Center": { duration: "18 mins", distance: "8 km" }
};

function initMap() {
  const olbiaLoc = locations["Olbia via Marina, Sardegna"];
  map = L.map('map', {
    center: [olbiaLoc.lat, olbiaLoc.lng],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const olbiaIcon = L.divIcon({
    className: 'custom-marker olbia-marker',
    html: `<div class="marker-pin olbia"><span class="marker-icon">   </span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
  
  L.marker([olbiaLoc.lat, olbiaLoc.lng], { icon: olbiaIcon })
    .addTo(map)
    .bindPopup(`<div class="custom-popup"><strong>Olbia</strong><br>via Marina, Sardegna</div>`);
}

window.onload = function() {
  initTheme();
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  initMap();
  setDateConstraints();
  populateTimeOptions();
  attachAutoRecalcListeners();
  computeAndRenderQuote({ silent: true, sendWhatsApp: false });
};

function setDateConstraints() {
  const dateInput = document.getElementById("date");
  if (!dateInput) return;

  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const iso = tomorrow.toISOString().slice(0, 10);

  dateInput.min = iso;
  if (!dateInput.value) {
    dateInput.value = iso;
  }
}

function populateTimeOptions() {
  const timeSelect = document.getElementById("time");
  if (!timeSelect) return;

  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const hh = hour.toString().padStart(2, "0");
      const mm = minute.toString().padStart(2, "0");
      options.push(`${hh}:${mm}`);
    }
  }

  timeSelect.innerHTML = options
    .map(t => `<option value="${t}">${t}</option>`)
    .join("");
}

function computeAndRenderQuote({ silent = true, sendWhatsApp = false } = {}) {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  
  if (!from || !to) {
    setTotalDirect(0);
    return null;
  }
  
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const people = document.getElementById("people").value;
  const children = document.getElementById("children").value;
  const extraTimeSelect = document.getElementById("extraTime");
  const extraTime = Number(extraTimeSelect.value);
  const extraTimeLabel = extraTimeSelect.options[extraTimeSelect.selectedIndex]?.text || "None";

  const route = priceTable.find(r => r.from === from && r.to === to);
  const basePrice = route?.price || 0;

  if (!basePrice) {
    if (!silent) {
      const msg = from === to
        ? "Please choose different pickup and drop-off locations to get a price."
        : "This route is not priced. Please select another combination.";
      alert(msg);
    }
    animateValue("total", getCurrentTotal(), 0, 400);
    setTotalDirect(0);
    calculateRoute(from, to);
    return null;
  }

  let extras = 0;
  const extraNames = [];
  document.querySelectorAll(".extra:checked").forEach(e => {
    extras += Number(e.value);
    const label = e.closest(".checkbox-label");
    if (label) extraNames.push(label.innerText.trim());
  });

  const total = basePrice + extras + extraTime;
  animateValue("total", getCurrentTotal(), total, 800);
  setTotalDirect(total);

  calculateRoute(from, to);

  if (sendWhatsApp) {
    sendToWhatsApp({
      from,
      to,
      date,
      time,
      people,
      children,
      basePrice,
      extras,
      extraNames,
      extraTimeLabel,
      extraTime,
      total
    });
  }

  return { from, to, date, time, people, children, basePrice, extras, extraNames, extraTimeLabel, extraTime, total };
}

function onGetQuoteClick() {
  computeAndRenderQuote({ silent: false, sendWhatsApp: true });
}

function debounce(fn, wait = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}

function attachAutoRecalcListeners() {
  const debounced = debounce(() => computeAndRenderQuote({ silent: true, sendWhatsApp: false }), 200);

  const ids = ["from", "to", "date", "time", "people", "children", "extraTime"]; 
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = (id === "people" || id === "children") ? "input" : "change";
    el.addEventListener(evt, debounced);
  });

  document.querySelectorAll('.extra').forEach(cb => {
    cb.addEventListener('change', debounced);
  });
}

let pickupMarker, dropoffMarker;

function calculateRoute(from, to) {
  if (currentPolyline) {
    map.removeLayer(currentPolyline);
  }
  if (pickupMarker) map.removeLayer(pickupMarker);
  if (dropoffMarker) map.removeLayer(dropoffMarker);

  const routeKey = `${from}-${to}`;
  const routeData = travelTimes[routeKey];
  
  if (routeData && locations[from] && locations[to]) {
    const fromLoc = locations[from];
    const toLoc = locations[to];
    
    const pickupIcon = L.divIcon({
      className: 'custom-marker pickup-marker',
      html: `<div class="marker-pin pickup"><span class="marker-icon"></span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    
    const dropoffIcon = L.divIcon({
      className: 'custom-marker dropoff-marker',
      html: `<div class="marker-pin dropoff"><span class="marker-icon"></span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    
    pickupMarker = L.marker([fromLoc.lat, fromLoc.lng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(`<div class="custom-popup"><strong>Pickup</strong><br>${from}</div>`);
    
    dropoffMarker = L.marker([toLoc.lat, toLoc.lng], { icon: dropoffIcon })
      .addTo(map)
      .bindPopup(`<div class="custom-popup"><strong>Drop-off</strong><br>${to}</div>`);
    
    currentPolyline = L.polyline([
      [fromLoc.lat, fromLoc.lng],
      [toLoc.lat, toLoc.lng]
    ], {
      color: '#667eea',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10',
      className: 'route-line'
    }).addTo(map);

    map.fitBounds(currentPolyline.getBounds(), { 
      padding: [80, 80],
      maxZoom: 13
    });

    const journeySection = document.querySelector('.journey-section');
    const routeDetailsDiv = document.getElementById('routeDetails');
    if (routeDetailsDiv) {
      routeDetailsDiv.innerHTML = `
        <div class="journey-card">
          <div class="journey-stats-container">
            <div class="journey-stat">
              <div class="stat-content">
                <div class="stat-label">Estimated Travel Time</div>
                <div class="stat-value">${routeData.duration}</div>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="journey-stat">
              <div class="stat-content">
                <div class="stat-label">Distance</div>
                <div class="stat-value">${routeData.distance}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      if (journeySection) {
        journeySection.classList.add('active');
      }
    }


    document.getElementById("travelTime").innerHTML =
      `<span style="color: #667eea;"></span> ${routeData.duration} <span style="color: #cbd5e0;">•</span> ${routeData.distance}`;
  }
}

function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      clearInterval(timer);
      element.innerText = Math.round(end);
    } else {
      element.innerText = Math.round(current);
    }
  }, 16);
}

function getCurrentTotal() {
  const el = document.getElementById("total");
  const val = Number(el?.innerText || 0);
  return Number.isFinite(val) ? val : 0;
}

function setTotalDirect(total) {
  const el = document.getElementById("total");
  if (el) {
    el.innerText = Math.round(total);
  }
}

function sendToWhatsApp({
  from,
  to,
  date,
  time,
  people,
  children,
  basePrice,
  extras,
  extraNames,
  extraTimeLabel,
  extraTime,
  total
}) {
  if (!driverWhatsAppNumber) {
    return;
  }

  const extrasText = extraNames.length ? extraNames.join(", ") : "None";
  const message = `New booking request\nFrom: ${from}\nTo: ${to}\nDate: ${date} ${time}\nPassengers: ${people} (Children: ${children})\nExtras: ${extrasText}\nExtra time: ${extraTimeLabel} (\u20ac${extraTime})\nBase price: \u20ac${basePrice}\nExtras total: \u20ac${extras}\nTotal quote: \u20ac${total}`;

  const url = `https://wa.me/${driverWhatsAppNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
