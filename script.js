// Garment styles for each category
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

// Show styles for selected category
function showStyles(category) {
  document.getElementById('category-section').style.display = 'none';
  const container = document.getElementById('style-options');
  container.innerHTML = '';

  styles[category].forEach(style => {
    const img = document.createElement('img');
    img.src = style.img;
    img.alt = style.name;
    img.className = 'style-image';
    img.onclick = () => showMeasurements(style.value);
    container.appendChild(img);
  });

  document.getElementById('style-section').style.display = 'block';
}

// Show measurement form for selected style
function showMeasurements(styleValue) {
  document.getElementById('style-section').style.display = 'none';
  document.getElementById('measurement-section').style.display = 'block';
  window.selectedStyle = styleValue;

  renderMeasurementFields(styleValue);
}

// Render relevant fields
function renderMeasurementFields(style) {
  const fields = {
    chest: "Chest (cm)",
    shoulder: "Shoulder Width (cm)",
    armLength: "Arm Length (cm)",
    waist: "Waist (cm)",
    hip: "Hip (cm)",
    inseam: "Inseam (Inside Leg) (cm)",
    thigh: "Thigh Circumference (cm)",
    calf: "Calf Circumference (cm)",
    ankle: "Ankle Circumference (cm)"
  };

  const required = getMeasurementsForStyle(style);
  const container = document.getElementById('measurement-fields');
  container.innerHTML = '';

  required.forEach(id => {
    const div = document.createElement('div');
    div.className = 'measure';
    div.innerHTML = `
      <label for="${id}">${fields[id]}</label>
      <input type="number" id="${id}" name="${id}">
    `;
    container.appendChild(div);
  });
}

// Define logic for which measurements are needed
function getMeasurementsForStyle(style) {
  const upper = ["chest", "shoulder", "armLength"];
  const lower = ["waist", "hip", "thigh", "calf", "ankle", "inseam"];
  const full = [...upper, ...lower];

  const noInseam = ["shortDress", "longDress"];

  if (style === "hoodie" || style === "tshirt" || style === "blouse") return upper;
  if (style === "trousers" || style === "shorts") return lower;
  if (noInseam.includes(style)) return full.filter(f => f !== "inseam");

  return full;
}

// Just an alert example
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert(`Generating pattern for: ${window.selectedStyle}`);
});
