# Pattern_Layplan_Generator
Generates PDF lay plans and sewing patterns from custom measurements.

Pattern_Layplan_Generator/
├── index.html
├── style.css
├── script.js
├── README.md (optional)

index.html
<!DOCTYPE html>
<html>
<head>
  <title>Lay Plan Generator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Garment Lay Plan</h1>
  <form id="form">
  <label for="garment">Select garment type:</label>
  <select id="garment" name="garment">
    <option value="hoodie">Hoodie</option>
    <option value="trousers">Trousers</option>
    <option value="shirt">Shirt</option>
  </select>
  <br><br>

  <label>Chest (cm):</label>
  <input type="number" id="chest"><br>
  <label>Waist (cm):</label>
  <input type="number" id="waist"><br>
  <label>Hip (cm):</label>
  <input type="number" id="hip"><br>
  <button>Generate</button>
</form>

  <script src="script.js"></script>
</body>
</html>

style.css
body {
  font-family: sans-serif;
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

h1 {
  text-align: center;
}

form label {
  display: block;
  margin-top: 10px;
}

input, select, button {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
}

script.js
document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();

  const garment = document.getElementById('garment').value;
  const chest = parseFloat(document.getElementById('chest').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const hip = parseFloat(document.getElementById('hip').value);
  const arm length = parseFloat(document.getElementById('hip').value);

  alert(`Generating a ${garment} pattern for:
Chest: ${chest} cm
Waist: ${waist} cm
Hip: ${hip} cm`);
Arm Length: ${hip} cm`);

  if (garment === 'hoodie') {
    // Call hoodie pattern generator
    console.log('Generating hoodie pattern...');
  } else if (garment === 'trousers') {
    // Call trousers pattern generator
    console.log('Generating trousers pattern...');
  } else if (garment === 'shirt') {
    // Call shirt pattern generator
    console.log('Generating shirt pattern...');
  }
});
