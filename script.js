// Confirm script is running
console.log("script.js is running");

// Handle unexpected errors
window.onerror = function(message, source, lineno, colno, error) {
  alert("JavaScript error: " + message + "\nAt line: " + lineno);
};

// STYLES PER GARMENT CATEGORY
const styles = {
  tops: [
    { name: "Hoodie", value: "hoodie", img: "images/hoodie.jpg" },
    { name: "T-Shirt", value: "tshirt", img: "images/tshirt.jpg" },
    { name: "Blouse", value: "blouse", img: "images/blouse.jpg" }
  ],
  bottoms: [
    { name: "Trousers", value: "trousers", img: "images/trousers.jpg" },
    { name: "Shorts", value: "shorts", img: "images/shorts.jpg" }
  ],
  dresses: [
    { name: "Short Dress", value: "shortDress", img: "images/shortdress.jpg" },
    { name: "Long Dress", value: "longDress", img: "images/longdress.jpg" }
  ],
  fullbody: [
    { name: "Overalls", value: "overalls", img: "images/overalls.jpg" },
    { name: "Playsuit", value: "playsuit", img: "images/playsuit.jpg" },
    { name: "Suit", value: "suit", img: "images/suit.jpg" }
  ]
};

// Hoodie Substyles
const hoodieStyles = [
  { name: "Pullover Hoodie", value: "hoodiePullover", img: "images/hoodie-pullover.jpg" },
  { name: "Zip-Up Hoodie", value: "hoodieZip", img: "images/hoodie-zip.jpg" },
  { name: "Oversized Hoodie", value: "hoodieOversized", img: "images/hoodie-oversized.jpg" }
];

// Show main categories
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

// Show hoodie-specific styles
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

// Show measurement form
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

// Return to category screen
function goBackToCategories() {
  document.getElementById('measurement-section').style.display = 'none';
  document.getElementById('style-section').style.display = 'none';
  document.getElementById('category-section').style.display = 'block';
}

// Measurement logic
function renderMeasurementFields(style) {
  // Define all fields
  const fields = {
    neck: "Neck Circumference (cm)",
    shoulder: "Shoulder Width (cm)",
    chest: "Chest Circumference (cm)",
    armLength: "Arm Length (cm)",
    bicep: "Bicep Circumference (cm)",
    wrist: "Wrist Circumference (cm)",
    hoodieLength: "Hoodie Length (cm)",
    waist: "Waist Circumference (cm)", // optional
    hip: "Hip Circumference (cm)"      // optional
  };

  // Pullover hoodie measurement set
  const hoodieMeasurements = [
    "neck",
    "shoulder",
    "chest",
    "armLength",
    "bicep",
    "wrist",
    "hoodieLength",
    "waist",   // optional
    "hip"      // optional
  ];

  if (
    style === "hoodiePullover" ||
    style === "hoodieZip" ||
    style === "hoodieOversized"
  ) {
    const container = document.getElementById('measurement-fields');
    container.innerHTML = '';

    hoodieMeasurements.forEach(id => {
      const div = document.createElement('div');
      div.className = 'measure';
      div.innerHTML = `
        <label for="${id}">${fields[id]}</label>
        <input type="number" id="${id}" name="${id}" required>
      `;
      container.appendChild(div);
    });
  }
}

  const upper = ["chest", "shoulder", "armLength", "waist", "neck"];
  const lower = ["waist", "hip", "thigh", "calf", "ankle", "inseam"];
  const full = [...upper, ...lower];

  const bottomsOnly = ["trousers", "shorts"];
  let result = [];

  if (["hoodiePullover", "hoodieZip", "hoodieOversized", "tshirt", "blouse"].includes(style)) {
    result = [...upper];
  } else if (bottomsOnly.includes(style)) {
    result = [...lower];
  } else if (style === "shortDress") {
    result = full.filter(m => m !== "inseam" && m !== "ankle");
  } else if (style === "longDress") {
    result = full.filter(m => m !== "inseam");
  } else {
    result = full;
  }

  if (!bottomsOnly.includes(style) && !result.includes("neck")) {
    result.push("neck");
  }

  const container = document.getElementById('measurement-fields');
  container.innerHTML = '';

  result.forEach(id => {
    const div = document.createElement('div');
    div.className = 'measure';
    div.innerHTML = `
      <label for="${id}">${fields[id]}</label>
      <input type="number" id="${id}" name="${id}">
    `;
    container.appendChild(div);
  });
}

// Handle form submission
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert(`Generating pattern for: ${window.selectedStyle}`);
});
