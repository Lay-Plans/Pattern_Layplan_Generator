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

  if (garment === 'hoodie') {
    console.log('Generating hoodie pattern...');
  } else if (garment === 'trousers') {
    console.log('Generating trousers pattern...');
  } else if (garment === 'shirt') {
    console.log('Generating shirt pattern...');
  }
});
function updateVisibleFields() {
  const garment = document.getElementById('garment').value;

  // Hide all fields first
  document.getElementById('chest').parentElement.style.display = 'none';
  document.getElementById('waist').parentElement.style.display = 'none';
  document.getElementById('hip').parentElement.style.display = 'none';
  document.getElementById('armLength').parentElement.style.display = 'none';

  // Show only needed fields
  if (garment === 'hoodie') {
    document.getElementById('chest').parentElement.style.display = '';
    document.getElementById('hip').parentElement.style.display = '';
    document.getElementById('armLength').parentElement.style.display = '';
  } else if (garment === 'trousers') {
    document.getElementById('waist').parentElement.style.display = '';
    document.getElementById('hip').parentElement.style.display = '';
  } else if (garment === 'shirt') {
    document.getElementById('chest').parentElement.style.display = '';
    document.getElementById('waist').parentElement.style.display = '';
    document.getElementById('armLength').parentElement.style.display = '';
  }
}

// Run when page loads and when dropdown changes
document.getElementById('garment').addEventListener('change', updateVisibleFields);
window.addEventListener('load', updateVisibleFields);
