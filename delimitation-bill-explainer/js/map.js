// ─── India Choropleth Map (TopoJSON) ───────────────────────────
(function() {
  const TOPO_URL = 'india-states.topojson';
  const container = document.getElementById('map-container');
  const loading = document.getElementById('map-loading');
  const tooltip = document.getElementById('map-tooltip') || document.createElement('div');

  if (!container || !window.DATA) return;

  // Name mapping: TopoJSON names → our data IDs
  const NAME_MAP = {
    'Andhra Pradesh': 'AP', 'Telengana': 'TG', 'Telangana': 'TG',
    'Arunachal Pradesh': 'AR', 'Assam': 'AS', 'Bihar': 'BR',
    'Chhattishgarh': 'CT', 'Chhattisgarh': 'CT', 'Goa': 'GA',
    'Gujarat': 'GJ', 'Haryana': 'HR', 'Himachal Pradesh': 'HP',
    'Jharkhand': 'JH', 'Karnataka': 'KA', 'Kerala': 'KL',
    'Madhya Pradesh': 'MP', 'Maharashtra': 'MH', 'Manipur': 'MN',
    'Meghalaya': 'ML', 'Mizoram': 'MZ', 'Nagaland': 'NL',
    'Odisha': 'OD', 'Punjab': 'PB', 'Rajasthan': 'RJ',
    'Sikkim': 'SK', 'Tamilnadu': 'TN', 'Tamil Nadu': 'TN',
    'Tripura': 'TR', 'Uttar Pradesh': 'UP', 'Uttarakhand': 'UT',
    'West Bengal': 'WB',
    'Andaman & Nicobar': 'AN', 'Andaman and Nicobar Islands': 'AN',
    'Chandigarh': 'CH',
    'Daman and Diu and Dadra and Nagar Haveli': 'DN',
    'Dadra and Nagar Haveli and Daman and Diu': 'DN',
    'Delhi': 'DL', 'Jammu and Kashmir': 'JK', 'Ladakh': 'LA',
    'Lakshadweep': 'LD', 'Puducherry': 'PY'
  };

  let svg, pathG, geoData;
  let resultMap = {};

  // Color by SHARE DELTA (relative representation change), not absolute seats
  function getColor(shareDelta) {
    if (shareDelta > 1.0) return '#1a6b3c';
    if (shareDelta > 0.3) return '#40916c';
    if (shareDelta > 0.05) return '#95d5b2';
    if (shareDelta >= -0.05) return '#e0ddd5';
    if (shareDelta >= -0.3) return '#e8a598';
    if (shareDelta >= -1.0) return '#e07a5f';
    return '#9b2226';
  }

  function getStateId(name) {
    return NAME_MAP[name] || NAME_MAP[name.trim()] || null;
  }

  async function init() {
    // Load D3 + topojson-client
    await loadScript('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js');

    let topoData;
    try {
      const resp = await fetch(TOPO_URL);
      if (!resp.ok) throw new Error('Failed to load map data');
      topoData = await resp.json();
    } catch (e) {
      loading.textContent = 'Map unavailable. See table for data.';
      loading.style.cssText = 'animation:none';
      return;
    }

    loading.style.display = 'none';

    // Convert TopoJSON to GeoJSON
    const objKey = Object.keys(topoData.objects)[0];
    geoData = topojson.feature(topoData, topoData.objects[objKey]);

    buildMap();
  }

  function buildMap() {
    // Remove old SVG if exists
    if (svg) svg.remove();

    const width = container.clientWidth - 16;
    const height = container.clientHeight - 16;
    if (width < 50 || height < 50) return;

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = '100%';
    container.appendChild(svg);

    const projection = d3.geoMercator().fitSize([width - 8, height - 8], geoData);
    const path = d3.geoPath().projection(projection);

    pathG = d3.select(svg).selectAll('path')
      .data(geoData.features)
      .enter().append('path')
      .attr('d', path)
      .attr('fill', '#e0ddd5')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        const name = d.properties.State_Name || '';
        const id = getStateId(name);
        const info = id ? resultMap[id] : null;
        if (info) {
          const change = info.newSeats - info.seats;
          const sign = change > 0 ? '+' : '';
          const currentTotal = window.DATA.STATES.reduce((s, st) => s + st.seats, 0);
          const curShare = ((info.seats / currentTotal) * 100).toFixed(2);
          const newShare = ((info.newSeats / info._totalSeats) * 100).toFixed(2);
          const shareDelta = (newShare - curShare).toFixed(2);
          const sSign = +shareDelta > 0 ? '+' : '';
          const cls = +shareDelta > 0 ? '#52b788' : +shareDelta < 0 ? '#e07a5f' : '#999';
          const scaledShare = Math.round(info.seats * info._totalSeats / currentTotal);
          const gainLoss = info.newSeats - scaledShare;
          const glSign = gainLoss > 0 ? '+' : '';
          const glCls = gainLoss > 0 ? '#52b788' : gainLoss < 0 ? '#e07a5f' : '#999';
          tooltip.innerHTML = `<div style="font-size:.85rem;font-weight:700;margin-bottom:4px;font-family:Georgia,serif">${info.state}</div>` +
            `Seats: ${info.seats} → ${info.newSeats} (${sign}${change})<br>` +
            `Share: ${curShare}% → ${newShare}%<br>` +
            `<span style="color:${glCls};font-weight:700;font-size:.75rem">Gain/Loss: ${glSign}${gainLoss} seats</span>`;
        } else {
          tooltip.innerHTML = `<strong>${name}</strong>`;
        }
        tooltip.style.opacity = 1;
        d3.select(this).attr('stroke', '#1a1a2e').attr('stroke-width', 1.5);
      })
      .on('mousemove', function(event) {
        // Position tooltip using fixed viewport coords — renders over everything
        let x = event.clientX + 16;
        let y = event.clientY - 80;
        // Flip left if too close to right edge
        if (x + 220 > window.innerWidth) x = event.clientX - 230;
        // Flip down if too close to top
        if (y < 10) y = event.clientY + 16;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
      })
      .on('mouseleave', function() {
        tooltip.style.opacity = 0;
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 0.5);
      });

    // Apply colors
    if (Object.keys(resultMap).length) {
      colorize();
    } else if (window.getSimResults) {
      window.updateMap(window.getSimResults());
    }
  }

  // Expose resize for sidebar toggle
  window.resizeMap = function() {
    if (geoData) buildMap();
  };

  function colorize() {
    if (!pathG) return;
    const currentTotal = window.DATA.STATES.reduce((s, st) => s + st.seats, 0);
    pathG.transition().duration(400)
      .attr('fill', d => {
        const name = d.properties.State_Name || '';
        const id = getStateId(name);
        const info = id ? resultMap[id] : null;
        if (!info) return '#e0ddd5';
        const curShare = (info.seats / currentTotal) * 100;
        const newShare = (info.newSeats / info._totalSeats) * 100;
        return getColor(newShare - curShare);
      });
  }

  window.updateMap = function(results) {
    const totalSeats = results.reduce((s, d) => s + d.newSeats, 0);
    resultMap = {};
    results.forEach(d => { resultMap[d.id] = { ...d, _totalSeats: totalSeats }; });
    colorize();
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => { console.warn('Failed to load: ' + src); resolve(); };
      document.head.appendChild(s);
    });
  }

  init();
})();
