// ─── Delimitation Simulator ────────────────────────────────────
(function() {
  if (!window.DATA) return;

  const { STATES, REGION_COLORS, allocateSeats } = window.DATA;

  // State
  let totalSeats = 816;
  let popKey = 'pop2011';
  let formula = 'population';
  let devWeight = 0.3;
  let sortCol = 'shareDelta';
  let sortDir = -1;

  // Elements
  const seatsSlider = document.getElementById('sim-seats');
  const seatsVal = document.getElementById('sim-seats-val');
  const popToggles = document.querySelectorAll('#sim-pop-toggle .sim-toggle');
  const formulaToggles = document.querySelectorAll('#sim-formula-toggle .sim-toggle');
  const weightRow = document.getElementById('sim-weight-row');
  const weightSlider = document.getElementById('sim-weight');
  const weightVal = document.getElementById('sim-weight-val');
  const tbody = document.getElementById('sim-tbody');
  const regionGrid = document.getElementById('region-grid') || document.getElementById('region-strip');
  const summaryDiv = document.getElementById('sim-summary');
  const headers = document.querySelectorAll('#sim-table th[data-sort]');

  if (!seatsSlider) return;

  // Bind events
  seatsSlider.addEventListener('input', () => {
    totalSeats = +seatsSlider.value;
    seatsVal.textContent = totalSeats;
    update();
  });

  popToggles.forEach(btn => btn.addEventListener('click', () => {
    popToggles.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    popKey = btn.dataset.val;
    update();
  }));

  const formulaNote = document.getElementById('sim-formula-note');
  const formulaPct = document.getElementById('formula-pct');
  const formulaDevPct = document.getElementById('formula-dev-pct');

  function updateFormulaUI() {
    const isWeighted = formula === 'weighted';
    weightRow.style.display = isWeighted ? 'flex' : 'none';
    if (formulaNote) formulaNote.style.display = isWeighted ? 'block' : 'none';
    if (formulaPct) formulaPct.textContent = Math.round((1 - devWeight) * 100);
    if (formulaDevPct) formulaDevPct.textContent = Math.round(devWeight * 100);
  }

  formulaToggles.forEach(btn => btn.addEventListener('click', () => {
    formulaToggles.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    formula = btn.dataset.val;
    updateFormulaUI();
    update();
  }));

  if (weightSlider) {
    weightSlider.addEventListener('input', () => {
      devWeight = +weightSlider.value / 100;
      weightVal.textContent = weightSlider.value + '%';
      updateFormulaUI();
      update();
    });
  }

  headers.forEach(th => th.addEventListener('click', () => {
    const col = th.dataset.sort;
    if (sortCol === col) sortDir *= -1;
    else { sortCol = col; sortDir = -1; }
    renderTable(lastResults);
  }));

  let lastResults = [];

  function update() {
    lastResults = allocateSeats(totalSeats, popKey, formula, devWeight);
    renderTable(lastResults);
    renderRegions(lastResults);
    renderSummary(lastResults);
    if (window.updateMap) window.updateMap(lastResults);
  }

  function renderTable(results) {
    const currentTotal = results.reduce((s, d) => s + d.seats, 0);

    const sorted = [...results].sort((a, b) => {
      let va, vb;
      const curShareA = (a.seats / currentTotal) * 100;
      const curShareB = (b.seats / currentTotal) * 100;
      const newShareA = (a.newSeats / totalSeats) * 100;
      const newShareB = (b.newSeats / totalSeats) * 100;
      const glA = a.newSeats - Math.round(a.seats * totalSeats / currentTotal);
      const glB = b.newSeats - Math.round(b.seats * totalSeats / currentTotal);
      switch (sortCol) {
        case 'state': va = a.state; vb = b.state; return sortDir * va.localeCompare(vb);
        case 'region': va = a.region; vb = b.region; return sortDir * va.localeCompare(vb);
        case 'current': va = a.seats; vb = b.seats; break;
        case 'projected': va = a.newSeats; vb = b.newSeats; break;
        case 'change': va = a.newSeats - a.seats; vb = b.newSeats - b.seats; break;
        case 'gainLoss': va = glA; vb = glB; break;
        case 'curShare': va = curShareA; vb = curShareB; break;
        case 'newShare': va = newShareA; vb = newShareB; break;
        case 'shareDelta': va = newShareA - curShareA; vb = newShareB - curShareB; break;
        default: va = 0; vb = 0;
      }
      return sortDir * (va - vb);
    });

    tbody.innerHTML = sorted.map(d => {
      const change = d.newSeats - d.seats;
      const scaledShare = Math.round(d.seats * totalSeats / currentTotal);
      const gainLoss = d.newSeats - scaledShare;
      const curShare = ((d.seats / currentTotal) * 100).toFixed(2);
      const newShare = ((d.newSeats / totalSeats) * 100).toFixed(2);
      const shareDelta = (newShare - curShare).toFixed(2);
      const absCls = change > 0 ? 'change-pos' : change < 0 ? 'change-neg' : 'change-zero';
      const glCls = gainLoss > 0 ? 'change-pos' : gainLoss < 0 ? 'change-neg' : 'change-zero';
      const shrCls = +shareDelta > 0.005 ? 'change-pos' : +shareDelta < -0.005 ? 'change-neg' : 'change-zero';
      const sign = change > 0 ? '+' : '';
      const glSign = gainLoss > 0 ? '+' : '';
      const sSign = +shareDelta > 0 ? '+' : '';
      const color = REGION_COLORS[d.region] || '#999';
      return `<tr>
        <td><span class="region-dot" style="background:${color}"></span>${d.state}</td>
        <td>${d.seats}</td>
        <td>${d.newSeats}</td>
        <td class="${absCls}">${sign}${change}</td>
        <td class="${glCls}" style="font-weight:700">${glSign}${gainLoss}</td>
        <td>${curShare}%</td>
        <td>${newShare}%</td>
        <td class="${shrCls}">${sSign}${shareDelta}%</td>
      </tr>`;
    }).join('');
  }

  function renderSummary(results) {
    if (!summaryDiv) return;
    const currentTotal = results.reduce((s, d) => s + d.seats, 0);
    // Compute gainers vs losers in share terms
    let gainShare = 0, loseShare = 0, gainCount = 0, loseCount = 0;
    results.forEach(d => {
      const curShare = (d.seats / currentTotal) * 100;
      const newShare = (d.newSeats / totalSeats) * 100;
      const delta = newShare - curShare;
      if (delta > 0.005) { gainShare += delta; gainCount++; }
      else if (delta < -0.005) { loseShare += Math.abs(delta); loseCount++; }
    });
    summaryDiv.innerHTML = `
      <div class="stat-box" style="background:var(--green)">
        <span class="stat-number">${gainCount}</span>
        <span class="stat-label">States gain share</span>
      </div>
      <div class="stat-box" style="background:var(--red)">
        <span class="stat-number">${loseCount}</span>
        <span class="stat-label">States lose share</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">${totalSeats}</span>
        <span class="stat-label">Total seats</span>
      </div>
    `;
  }

  function renderRegions(results) {
    if (!regionGrid) return;
    const currentTotal = results.reduce((s, d) => s + d.seats, 0);
    const regions = {};
    results.forEach(d => {
      const r = d.region;
      if (!regions[r]) regions[r] = { current: 0, projected: 0 };
      regions[r].current += d.seats;
      regions[r].projected += d.newSeats;
    });

    const order = ['South','North','East','West','Northeast','UT'];
    regionGrid.innerHTML = order.filter(n => regions[n]).map(name => {
      const data = regions[name];
      const curShare = ((data.current / currentTotal) * 100).toFixed(1);
      const newShare = ((data.projected / totalSeats) * 100).toFixed(1);
      const shareDelta = (newShare - curShare).toFixed(1);
      const sSign = +shareDelta > 0 ? '+' : '';
      const color = REGION_COLORS[name] || '#999';
      const shrCls = +shareDelta > 0 ? 'change-pos' : +shareDelta < 0 ? 'change-neg' : 'change-zero';
      return `<div class="sim-region">
        <div class="sim-region-name" style="color:${color}">${name}</div>
        <div class="sim-region-seats">${data.current} &rarr; ${data.projected}</div>
        <div class="sim-region-share">${curShare}% &rarr; ${newShare}% <span class="${shrCls}">(${sSign}${shareDelta})</span></div>
      </div>`;
    }).join('');
  }

  // Expose for map.js to pull current results after async load
  window.getSimResults = function() { return lastResults; };

  // Initial render
  update();
})();
