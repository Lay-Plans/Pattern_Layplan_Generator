console.log("✅ script.js is loaded");

const styles = {
  tops: [
    { name: "Hoodie", value: "hoodie", img: "images/hoodie.jpg" },
    { name: "T-Shirt", value: "tshirt", img: "images/tshirt.jpg" }
  ],
  bottoms: [],
  dresses: [],
  fullbody: []
};

const hoodieStyles = [
  { name: "Pullover Hoodie", value: "hoodiePullover", img: "images/hoodie-pullover.jpg" },
  { name: "Zip-Up Hoodie", value: "hoodieZip", img: "images/hoodie-zip.jpg" }
];

function showStyles(category) {
  console.log("Category selected:", category);
  document.getElementById('category-section').style.display = 'none';
  document.getElementById('style-section').style.display = 'block';

  const container = document.getElementById('style-options');
  container.innerHTML = '';

  const styles = {
    tops: [{ name: "Hoodie", value: "hoodie", img: "images/hoodie.jpg" }],
    bottoms: [{ name: "Trousers", value: "trousers", img: "images/trousers.jpg" }],
    dresses: [],
    fullbody: []
  };

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
}


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
    div.innerHTML = `
      <label for="${id}">${label}</label>
      <input type="number" id="${id}" name="${id}" required>
    `;
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const measurements = {};
    document.querySelectorAll('#measurement-fields input').forEach(input => {
      const value = parseFloat(input.value);
      if (!isNaN(value)) measurements[input.name] = value;
    });

    const data = [
      { Pattern: "Front Panel", W: measurements.chest, H: measurements.hoodieLength },
      { Pattern: "Back Panel", W: measurements.chest, H: measurements.hoodieLength },
      { Pattern: "Side Panel", W: (measurements.hip || 0) * 0.25, H: measurements.hoodieLength, Cutting: "Cut 2", Grainline: "Vertical", Notches: "Side Seam" },
      { Pattern: "Sleeve", W: measurements.armLength, H: measurements.bicep },
      { Pattern: "Cuff", W: (measurements.wrist || 0) * 0.9, H: 8 },
      { Pattern: "Waistband", W: (measurements.hip || 0) * 0.9, H: 10 },
      { Pattern: "Hood Side", W: (measurements.neckHeight || 0) * 2, H: measurements.headHeight },
      { Pattern: "Hood Centre Strip", W: 10, H: measurements.headHeight },
      { Pattern: "Pocket", W: (measurements.chest || 0) * 0.6, H: 20 }
    ];

    document.getElementById('measurement-section').style.display = 'none';
    document.getElementById('pattern-output-section').style.display = 'block';

    const tbody = document.querySelector('#pattern-table tbody');
    tbody.innerHTML = '';

    data.forEach(piece => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${piece.Pattern}</td>
        <td>${piece.W.toFixed(1)} x ${piece.H.toFixed(1)} cm</td>
        <td>${piece.Cutting || "Cut 1"}</td>
        <td>${piece.Grainline || "—"}</td>
        <td>${piece.Notches || "—"}</td>
      `;
      tbody.appendChild(row);
    });

    drawPattern(data);
  });
});

function drawPattern(data) {
  const svg = document.getElementById('pattern-svg');
  svg.innerHTML = ''; // Clear any existing drawings

  const maxRowWidth = 1470; // Fabric width in mm (e.g. 150 cm)
  const padding = 10;       // Space between pattern pieces
  const rowSpacing = 30;    // Vertical space between rows
  const scale = 10;         // Scale: 1 cm = 10 mm in SVG units

  let x = padding;
  let y = 40;
  let rowHeight = 0;

  data.forEach(piece => {
    const width = (piece.W || 0) * scale;
    const height = (piece.H || 0) * scale;

    // Check if the piece fits in the current row
    if (x + width + padding > maxRowWidth) {
      x = padding;                 // Reset x to start of next row
      y += rowHeight + rowSpacing; // Move down to new row
      rowHeight = 0;               // Reset row height tracker
    }

    // Create rectangle for the pattern piece
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "#d8eaff");
    rect.setAttribute("stroke", "#000");

    // Add label above the piece
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + 5);
    label.setAttribute("y", y - 5);
    label.setAttribute("font-size", "12");
    label.textContent = piece.Pattern;

    // Append the elements to the SVG
    svg.appendChild(rect);
    svg.appendChild(label);

    // Advance x for the next piece and update the tallest item in this row
    x += width + padding;
    rowHeight = Math.max(rowHeight, height);
  });
}


    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", "#d8eaff");
    rect.setAttribute("stroke", "#000");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + 4);
    label.setAttribute("y", y - 5);
    label.setAttribute("font-size", "12");
    label.textContent = piece.Pattern;

    svg.appendChild(rect);
    svg.appendChild(label);

    x += w + padding;
  });
}
<script src="script.js"></script>
