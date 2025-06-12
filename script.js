// Confirm script is running
console.log("script.js is running");

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

// Show main categories and styles
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

// Show hoodie substyle options
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

// Display measurement form
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

// Render fields for hoodie measurements
function renderMeasurementFields(style) {
  const fields = {
    neck: "Neck Circumference (cm)",
    shoulder: "Shoulder Width (cm)",
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
    "neck",
    "shoulder",
    "chest",
    "armLength",
    "bicep",
    "wrist",
    "hoodieLength",
    "waist",
    "hip",
    "neckHeight",
    "headHeight"
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

// Handle form submission
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert(`Generating pattern for: ${window.selectedStyle}`);
});

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const measurements = {};

  formData.forEach((value, key) => {
    measurements[key] = value;
  });

  fetch('http://localhost:5000/generate-pattern', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(measurements)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Pattern:', data);
    alert('Pattern generated successfully. Check console for details.');
    // You can update your UI to display the result in a table here
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error generating the pattern.');
  });
});
