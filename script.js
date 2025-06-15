console.log("✅ script.js is loaded");

const styles = {
  tops: [
    { name: "Hoodie", value: "hoodie", img: "images/hoodie.jpg" }
  ],
  bottoms: [], dresses: [], fullbody: []
};

const hoodieStyles = [
  { name: "Pullover Hoodie", value: "hoodiePullover", img: "images/hoodie-pullover.jpg" },
  { name: "Zip‑Up Hoodie", value: "hoodieZip", img: "images/hoodie-zip.jpg" }
];

function showStyles(category) {
  document.getElementById('category-section').style.display = 'none';
  document.getElementById('style-section').style.display = 'block';
  const container = document.getElementById('style-options');
  container.innerHTML = '';
  styles[category].forEach(style => {
    const div = document.createElement('div');
    div.className = 'style-container';
    const img = document.createElement('img');
    img.src = style.img;
    img.alt = style.name;
    img.className = 'style-image';
    img.onclick = () => showMeasurements(style.value);
    div.append(img, (() => { const L = document.createElement('div'); L.className='style-label'; L.textContent=style.name; return L })());
    container.appendChild(div);
  });
}

function showHoodieSubStyles() {
  document.getElementById('style-section').style.display = 'block';
  const container = document.getElementById('style-options');
  container.innerHTML = '';
  hoodieStyles.forEach(style => {
    const div = document.createElement('div');
    div.className = 'style-container';
    const img = document.createElement('img');
    img.src = style.img; img.alt = style.name; img.className = 'style-image';
    img.onclick = () => showMeasurements(style.value);
    div.append(img, (() => { const L = document.createElement('div'); L.className='style-label'; L.textContent=style.name; return L })());
    container.appendChild(div);
  });
}

function showMeasurements(styleValue) {
  if (styleValue === "hoodie") {
    showHoodieSubStyles();
    return;
  }
  document.getElementById('style-section').style.display = 'none';
  document.getElementById('measurement-section').style.display = 'block';
  window.selectedStyle = styleValue;
  renderMeasurementFields();
}

function goBackToCategories() {
  document.getElementById('pattern-output-section').style.display = 'none';
  document.getElementById('measurement-section').style.display = 'none';
  document.getElementById('style-section').style.display = 'none';
  document.getElementById('category-section').style.display = 'block';
}
function goBackToMeasurements() {
  document.getElementById('pattern-output-section').style.display = 'none';
  document.getElementById('measurement-section').style.display = 'block';
}

function renderMeasurementFields() {
  const fields = {
    neck: "Neck Circumference (cm)",
    shoulder: "Shoulder Length (cm)",
    chest: "Chest Circumference (cm)",
    armLength: "Arm Length (cm)",
    bicep: "Bicep Circumference (cm)",
    wrist: "Wrist Circumference (cm)",
    hoodieLength: "Hoodie Length (cm)",
    waist: "Waist Circumference (cm)",
    hip: "Hip Circumference (cm)",
    neckHeight: "Neck Height (cm)",
    headHeight: "Head Height (cm)"
  };
  const container = document.getElementById('measurement-fields');
  container.innerHTML = '';
  Object.entries(fields).forEach(([id, label]) => {
    const div = document.createElement('div');
    div.className = 'measure';
    div.innerHTML = `<label for="${id}">${label}</label><input type="number" id="${id}" name="${id}" required>`;
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    const measurements = {};
    document.querySelectorAll('#measurement-fields input').forEach(input => {
      const v = parseFloat(input.value);
      if (!isNaN(v)) measurements[input.name] = v;
    });

    const data = [
      { Pattern:"Front Panel", W: measurements.chest, H: measurements.hoodieLength },
      { Pattern:"Back Panel", W: measurements.chest, H: measurements.hoodieLength },
      { Pattern:"Side Panel", W: measurements.hip * .25, H: measurements.hoodieLength, Cutting:"Cut 2", Grainline:"Vertical", Notches:"Side Seam" },
      { Pattern:"Sleeve", W: measurements.armLength, H: measurements.bicep },
      { Pattern:"Cuff", W: measurements.wrist * .9, H: 8 },
      { Pattern:"Waistband", W: measurements.hip * .9, H: 10 },
      { Pattern:"Hood Side", W: measurements.neckHeight * 2, H: measurements.headHeight },
      { Pattern:"Hood Centre Strip", W: 10, H: measurements.headHeight },
      { Pattern:"Pocket", W: measurements.chest * .6, H: 20 }
    ];

    document.getElementById('measurement-section').style.display = 'none';
    document.getElementById('pattern-output-section').style.display = 'block';
    const tbody = document.querySelector('#pattern-table tbody');
    tbody.innerHTML = '';
    data.forEach(piece => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${piece.Pattern}</td><td>${piece.W.toFixed(1)} x ${piece.H.toFixed(1)} cm</td><td>${piece.Cutting||"Cut 1"}</td><td>${piece.Grainline||"—"}</td><td>${piece.Notches||"—"}</td>`;
      tbody.appendChild(row);
    });

    drawPattern(data, measurements);
  });
});

// ——— Custom Draw Functions ———

function drawFrontBodice(svg, x, y, scale, meas) {
  const NW = meas.chest * .25 * scale;
  const SL = meas.shoulder * scale;
  const SD = SL * .15;
  const AH = meas.armLength * .6 * scale;
  const BL = meas.hoodieLength * scale;

  const d = [
    `M ${x},${y + BL}`,
    `L ${x},${y + SD}`,
    `c 0,-${SD/2} ${NW},-10 ${NW + SL},-${SD}`,
    `l ${SL},${SD}`,
    `c ${-SL},${AH} ${-SL - NW},${AH} ${-NW},${AH}`,
    `L ${x},${y + BL}`,
    `z`
  ].join(' ');

  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "#d8eaff");
  path.setAttribute("stroke", "#000");
  svg.appendChild(path);

  const cx = x + NW/2;
  const line = document.createElementNS(svg.namespaceURI, "line");
  line.setAttribute("x1", cx); line.setAttribute("y1", y + 10);
  line.setAttribute("x2", cx); line.setAttribute("y2", y + BL - 10);
  line.setAttribute("stroke", "#000");
  line.setAttribute("marker-start", "url(#arrowStart)");
  line.setAttribute("marker-end", "url(#arrowEnd)");
  svg.appendChild(line);
}

function drawPattern(data, meas) {
  const svg = document.getElementById('pattern-svg');
  svg.querySelectorAll('path,rect,line').forEach(el => {
    if (!el.closest('defs')) el.remove();
  });
  const scale = 10;
  let x = 20, y = 20, rowHeight = 0;
  drawFrontBodice(svg, x, y, scale, meas);
  x += meas.chest * .25 * scale + meas.shoulder * scale + 40;
  let maxW = 1470;

  data.forEach(piece => {
    const w = (piece.W||0) * scale;
    const h = (piece.H||0) * scale;
    if (x + w + 10 > maxW) { x = 20; y += rowHeight + 30; rowHeight = 0; }
    const r = document.createElementNS(svg.namespaceURI,"rect");
    r.setAttribute("x", x); r.setAttribute("y", y);
    r.setAttribute("width", w); r.setAttribute("height", h);
    r.setAttribute("fill", "#d8eaff");
    r.setAttribute("stroke", "#000");
    svg.appendChild(r);
    const l = document.createElementNS(svg.namespaceURI,"text");
    l.setAttribute("x", x+4); l.setAttribute("y", y-4);
    l.setAttribute("font-size","12");
    l.textContent = piece.Pattern;
    svg.appendChild(l);
    x += w + 10;
    rowHeight = Math.max(rowHeight, h);
  });
}
