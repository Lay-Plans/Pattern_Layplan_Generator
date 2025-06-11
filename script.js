document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();

  const garment = document.getElementById('garment').value;
  const chest = parseFloat(document.getElementById('chest').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const hip = parseFloat(document.getElementById('hip').value);
  const armLength = parseFloat(document.getElementById('armLength').value);

  alert(`Generating a ${garment} pattern for:
Chest: ${chest} cm
Waist: ${waist} cm
Hip: ${hip} cm
Arm Length: ${armLength} cm`);
});

added new script.js file
