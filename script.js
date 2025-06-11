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

function showMeasurements(styleValue) {
  document.getElementById('style-section').style.display = 'none';
  document.getElementById('measurement-section').style.display = 'block';
  window.selectedStyle = styleValue;

  renderMeasurementFields(styleValue);
}

function goBackToCategories() {
  document.getElementById('measurement-section').style.display = 'none';
  document.getElementById('style-section').style.display = 'none';
  document.getElementById('category-section').style.display = 'block';
}

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
    ankle: "Ankle Circumference (cm)",
    neck: "Neck Circumference (cm)"
  };

  const upper = ["chest", "shoulder", "armLength", "waist", "neck"];
  const lower = ["waist", "hip", "thigh", "calf", "ankle", "inseam"];
  const full = [...upper, ...lower];

  const noInseam = ["shortDress", "longDress"];
  const noAnkleForShortDress = ["shortDress"];
  const bottomsOnly = ["trousers", "shorts"];

  let result = [];

  if (["hoodie", "tshirt", "blouse"].includes(style)) {
    result = [...upper];
  } else if (["trousers", "shorts"].includes(style)) {
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

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert(`Generating pattern for: ${window.selectedStyle}`);
});
