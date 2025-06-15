// script.js

console.log("script.js is running");

const styles = {
  tops: [
    { name: "Hoodie", value: "hoodie", img: "images/hoodie.jpg" },
    { name: "T-Shirt", value: "tshirt", img: "images/tshirt.jpg" },
    { name: "Blouse", value: "blouse", img: "images/blouse.jpg" }
  ],
  bottoms: [
    { name: "Trousers", value: "trousers", img: "images/trousers.jpg" }
  ],
  dresses: [],
  fullbody: []
};

const hoodieStyles = [
  { name: "Pullover Hoodie", value: "hoodiePullover", img: "images/hoodie-pullover.jpg" },
  { name: "Zip-Up Hoodie", value: "hoodieZip", img: "images/hoodie-zip.jpg" },
  { name: "Oversized Hoodie", value: "hoodieOversized", img: "images/hoodie-oversized.jpg" }
];

function showStyles(category) {
  document.getElementById('category-section').style.display = 'none';

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

    const label = document.createElement('div');
    label.className = 'style-label';
    label.textContent = style.name;

    div.appendChild(img);
    div.appendChild(label);
    container.appendChild(div);
  });

  document.getElementById('style-section').style.display = 'block';
}

function showHoodieSubStyles() {
  const container = document.getElementById('style-options');
  container.innerHTML = '';

  hoodieStyles.forEach(style => {
    const div = document.createElement('div');
    div.className = 'style-container';

    const img = document.createElement('img');
    img.src = style.img;
    img.alt = style.name;
    img.className = 'style-image';
    img.onclick = () => showMeasurements(style.value);

    const label = document.createElement('div');
    label.className = 'style-label';
    label.textContent = style.name;

    div.appendChild(img);
    div.appendChild(label);
    container.appendChild(div);
  });

  document.getElementById('style-section').style.display = 'block';
}

function showMeasurements(styleValue) {
  if (styleValue === "hoodie") {
    showHoodieSubStyles();
    return;
  }

  document.getElementById('style-section').style.display = 'none';
  document.getElementById('measurement-section').style.display = 'block';
  window.selectedStyle = styleValue;

  renderMeasurementFields(styleValue);
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

function renderMeasurementFields(style) {
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
    headHeight: "Head Height(cm)"
  };

  const hoodieMeasurements = Object.keys(fields);
  const container = document.getElementById('measurement-fields');
  container.innerHTML = '';

  if (style.startsWith("hoodie")) {
    hoodieMeasurements.forEach(id => {
      const div = document.createElement('div');
      div.className = 'measure';
      div.innerHTML = `
        <label for="${id}">${fields[id]}</label>
        <input type="number" id="${id}" name="${id}" required>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = `<p>Measurement fields for ${style} not yet implemented.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formElements = document.querySelectorAll('#measurement-fields input');
    const measurements = {};
    formElements.forEach(input => {
      const key = input.name;
      const value = parseFloat(input.value);
      if (!isNaN(value)) {
        measurements[key] = value;
      }
    });

    const data = [
      { Pattern: "Front Panel", W: measurements.chest, H: measurements.hoodieLength },
      { Pattern: "Back Panel", W: measurements.chest, H: measurements.hoodieLength },
      { Pattern: "Sleeve", W: measurements.armLength, H: measurements.bicep },
      { Pattern: "Cuff", W: (measurements.wrist || 0) * 0.9, H: 8 },
      { Pattern: "Waistband", W: (measurements.hip || 0) * 0.9, H: 10 },
      { Pattern: "Hood Side", W: (measurements.neckHeight || 0) * 2, H: measurements.headHeight },
      { Pattern: "Hood Centre", W: 10, H: measurements.headHeight },
      { Pattern: "Pocket", W: (measurements.chest || 0) * 0.6, H: 20 }
    ];

    const tbody = document.querySelector('#pattern-table tbody');
    tbody.innerHTML = '';
    data.forEach(piece => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${piece.Pattern}</td>
        <td>${piece.W.toFixed(1)} x ${piece.H.toFixed(1)} cm</td>
        <td>See notes</td>
        <td>-</td>
        <td>-</td>
      `;
      tbody.appendChild(row);
    });

    document.getElementById('measurement-section').style.display = 'none';
    document.getElementById('pattern-output-section').style.display = 'block';
    drawPattern(data);
  });
});

function drawPattern(data) {
  const svg = document.getElementById('pattern-svg');
  svg.innerHTML = '';

  const svgWidth = 841;
  const svgHeight = 1189;
  const padding = 10;
  const rowHeight = 200;
  const scale = 3.5;

  let xOffset = padding;
  let yOffset = 40;

  data.forEach(piece => {
    const width = piece.W * scale;
    const height = piece.H * scale;

    if (xOffset + width + padding > svgWidth) {
      xOffset = padding;
      yOffset += rowHeight;
    }

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", xOffset);
    rect.setAttribute("y", yOffset);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "#d8eaff");
    rect.setAttribute("stroke", "#000");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", xOffset + 5);
    label.setAttribute("y", yOffset - 5);
    label.setAttribute("font-size", "12");
    label.textContent = piece.Pattern;

    svg.appendChild(rect);
    svg.appendChild(label);

    xOffset += width + padding;
  });
}
