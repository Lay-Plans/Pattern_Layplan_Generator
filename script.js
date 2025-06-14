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
  console.log("Category selected:", category);
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

  const hoodieMeasurements = [
    "neck", "shoulder", "chest", "armLength", "bicep",
    "wrist", "hoodieLength", "waist", "hip", "neckHeight", "headHeight"
  ];

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

// FORM HANDLER (no Flask)
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
      {
        "Pattern Piece": "Front Panel",
        "Dimensions": `${measurements.chest || 0} x ${measurements.hoodieLength || 0} cm`,
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Shoulder, Side Seam"
      },
      {
        "Pattern Piece": "Sleeve",
        "Dimensions": `${measurements.armLength || 0} x ${measurements.bicep || 0} cm`,
        "Cutting Notes": "Cut 2",
        "Grainline": "Along arm",
        "Notches": "Armhole"
      }
    ];

    document.getElementById('measurement-section').style.display = 'none';
    document.getElementById('pattern-output-section').style.display = 'block';

    const tbody = document.querySelector('#pattern-table tbody');
    tbody.innerHTML = '';

    data.forEach(piece => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${piece["Pattern Piece"]}</td>
        <td>${piece["Dimensions"]}</td>
        <td>${piece["Cutting Notes"]}</td>
        <td>${piece["Grainline"]}</td>
        <td>${piece["Notches"]}</td>
      `;
      tbody.appendChild(row);
    });
  });
});
