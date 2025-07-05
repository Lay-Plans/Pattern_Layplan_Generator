console.log(“✅ Enhanced script.js loaded”);

// Global variables
let currentDownloadUrl = null;
let currentStyle = null;
let currentCategory = null;

// Configuration
const API_BASE_URL = window.location.origin; // Adjust for production

// Style data
const styles = {
tops: [
{ name: “Hoodie”, value: “hoodie”, img: “images/hoodie.jpg” }
],
bottoms: [],
dresses: [],
fullbody: []
};

const hoodieStyles = [
{ name: “Pullover Hoodie”, value: “hoodiePullover”, img: “images/hoodie-pullover.jpg” },
{ name: “Zip-Up Hoodie”, value: “hoodieZip”, img: “images/hoodie-zip.jpg” }
];

// Utility functions
function showLoading(show = true) {
const overlay = document.getElementById(‘loading-overlay’);
overlay.style.display = show ? ‘flex’ : ‘none’;
}

function showError(message) {
const container = document.getElementById(‘error-container’);
const textElement = container.querySelector(’.error-text’);
textElement.textContent = message;
container.style.display = ‘block’;

// Auto-hide after 5 seconds
setTimeout(() => hideError(), 5000);
}

function hideError() {
document.getElementById(‘error-container’).style.display = ‘none’;
}

function showSuccess(message) {
const container = document.getElementById(‘success-container’);
const textElement = container.querySelector(’.success-text’);
textElement.textContent = message;
container.style.display = ‘block’;

// Auto-hide after 3 seconds
setTimeout(() => hideSuccess(), 3000);
}

function hideSuccess() {
document.getElementById(‘success-container’).style.display = ‘none’;
}

function validateMeasurement(input) {
const value = parseFloat(input.value);
const name = input.name;
const measureDiv = input.closest(’.measure’);

// Remove existing error styling
measureDiv.classList.remove(‘error’);
const existingError = measureDiv.querySelector(’.error-message-text’);
if (existingError) {
existingError.remove();
}

// Define validation rules
const rules = {
chest: { min: 60, max: 150, label: ‘Chest’ },
shoulder: { min: 30, max: 60, label: ‘Shoulder’ },
armLength: { min: 40, max: 80, label: ‘Arm Length’ },
bicep: { min: 20, max: 50, label: ‘Bicep’ },
wrist: { min: 12, max: 25, label: ‘Wrist’ },
hoodieLength: { min: 50, max: 100, label: ‘Hoodie Length’ },
waist: { min: 50, max: 120, label: ‘Waist’ },
hip: { min: 60, max: 140, label: ‘Hip’ },
neck: { min: 30, max: 50, label: ‘Neck’ },
neckHeight: { min: 5, max: 15, label: ‘Neck Height’ },
headHeight: { min: 15, max: 35, label: ‘Head Height’ }
};

const rule = rules[name];
if (!rule) return true;

if (isNaN(value) || value < rule.min || value > rule.max) {
measureDiv.classList.add(‘error’);
const errorMsg = document.createElement(‘div’);
errorMsg.className = ‘error-message-text’;
errorMsg.textContent = `${rule.label} must be between ${rule.min}-${rule.max} cm`;
measureDiv.appendChild(errorMsg);
return false;
}

return true;
}

// Navigation functions
function showStyles(category) {
currentCategory = category;
hideAllSections();
document.getElementById(‘style-section’).style.display = ‘block’;

const container = document.getElementById(‘style-options’);
container.innerHTML = ‘’;

const categoryStyles = styles[category];
if (!categoryStyles || categoryStyles.length === 0) {
container.innerHTML = ‘<p class="no-styles">No styles available for this category yet. More coming soon!</p>’;
return;
}

categoryStyles.forEach(style => {
const div = document.createElement(‘div’);
div.className = ‘style-container’;

```
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
```

});
}

function showHoodieSubStyles() {
hideAllSections();
document.getElementById(‘style-section’).style.display = ‘block’;

const container = document.getElementById(‘style-options’);
container.innerHTML = ‘’;

hoodieStyles.forEach(style => {
const div = document.createElement(‘div’);
div.className = ‘style-container’;

```
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
```

});
}

function showMeasurements(styleValue) {
if (styleValue === “hoodie”) {
showHoodieSubStyles();
return;
}

currentStyle = styleValue;
hideAllSections();
document.getElementById(‘measurement-section’).style.display = ‘block’;
renderMeasurementFields();
}

function hideAllSections() {
const sections = [‘category-section’, ‘style-section’, ‘measurement-section’, ‘pattern-output-section’];
sections.forEach(id => {
document.getElementById(id).style.display = ‘none’;
});
}

function goBackToCategories() {
hideAllSections();
document.getElementById(‘category-section’).style.display = ‘block’;
currentCategory = null;
currentStyle = null;
}

function goBackToStyles() {
if (currentCategory) {
showStyles(currentCategory);
} else {
goBackToCategories();
}
}

function goBackToMeasurements() {
hideAllSections();
document.getElementById(‘measurement-section’).style.display = ‘block’;
}

function startOver() {
goBackToCategories();
// Clear any stored data
currentDownloadUrl = null;
currentStyle = null;
currentCategory = null;
}

function renderMeasurementFields() {
const fields = {
neck: “Neck Circumference (cm)”,
shoulder: “Shoulder Length (cm)”,
chest: “Chest Circumference (cm)”,
armLength: “Arm Length (cm)”,
bicep: “Bicep Circumference (cm)”,
wrist: “Wrist Circumference (cm)”,
hoodieLength: “Hoodie Length (cm)”,
waist: “Waist Circumference (cm)”,
hip: “Hip Circumference (cm)”,
neckHeight: “Neck Height (cm)”,
headHeight: “Head Height (cm)”
};

const container = document.getElementById(‘measurement-fields’);
container.innerHTML = ‘’;

Object.entries(fields).forEach(([id, label]) => {
const div = document.createElement(‘div’);
div.className = ‘measure’;

```
const labelElement = document.createElement('label');
labelElement.setAttribute('for', id);
labelElement.textContent = label;

const input = document.createElement('input');
input.type = 'number';
input.id = id;
input.name = id;
input.required = true;
input.step = '0.1';
input.min = '0';
input.placeholder = 'Enter measurement';

// Add real-time validation
input.addEventListener('blur', () => validateMeasurement(input));
input.addEventListener('input', () => {
  // Remove error styling on input
  const measureDiv = input.closest('.measure');
  measureDiv.classList.remove('error');
  const existingError = measureDiv.querySelector('.error-message-text');
  if (existingError) {
    existingError.remove();
  }
});

div.appendChild(labelElement);
div.appendChild(input);
container.appendChild(div);
```

});
}

// Pattern generation and API calls
async function generatePattern(measurements, customerName) {
try {
showLoading(true);

```
const requestData = {
  measurements: measurements,
  user_name: customerName || "Customer",
  garment_style: getGarmentStyleName(currentStyle)
};

console.log("Sending request:", requestData);

const response = await fetch(`${API_BASE_URL}/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestData)
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || `Server error: ${response.status}`);
}

if (data.status === 'success') {
  currentDownloadUrl = data.download_url;
  displayPatternResults(data.pattern_data, measurements);
  showSuccess('Pattern generated successfully!');
} else {
  throw new Error(data.message || 'Failed to generate pattern');
}
```

} catch (error) {
console.error(‘Error generating pattern:’, error);
showError(`Failed to generate pattern: ${error.message}`);
} finally {
showLoading(false);
}
}

function getGarmentStyleName(styleValue) {
const styleNames = {
‘hoodiePullover’: ‘Pullover Hoodie’,
‘hoodieZip’: ‘Zip-Up Hoodie’
};
return styleNames[styleValue] || ‘Pullover Hoodie’;
}

function displayPatternResults(patternData, measurements = null) {
hideAllSections();
document.getElementById(‘pattern-output-section’).style.display = ‘block’;

// Update table
const tbody = document.querySelector(’#pattern-table tbody’);
tbody.innerHTML = ‘’;

patternData.forEach(piece => {
const row = document.createElement(‘tr’);
row.innerHTML = `<td><strong>${piece['Pattern Piece']}</strong></td> <td>${piece['Dimensions']}</td> <td>${piece['Cutting Notes']}</td> <td>${piece['Grainline']}</td> <td>${piece['Notches']}</td>`;
tbody.appendChild(row);
});

// Use enhanced pattern drawing if measurements are available
if (measurements) {
drawEnhancedPattern(patternData, measurements);
} else {
drawSimplePattern(patternData);
}
}

function drawSimplePattern(patternData) {
const svg = document.getElementById(‘pattern-svg’);
svg.innerHTML = `<defs> <marker id="arrowStart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse"> <path d="M0,5 L10,0 L10,10 Z" fill="#000"/> </marker> <marker id="arrowEnd" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"> <path d="M0,0 L10,5 L0,10 Z" fill="#000"/> </marker> </defs>`;

const scale = 3; // Reduced scale for better fit
let x = 20;
let y = 20;
let rowHeight = 0;
const maxWidth = 1400;

patternData.forEach((piece, index) => {
// Extract dimensions
const dimensions = piece[‘Dimensions’];
const match = dimensions.match(/(\d+.?\d*)\s*x\s*(\d+.?\d*)/);

```
if (!match) return;

const width = parseFloat(match[1]) * scale;
const height = parseFloat(match[2]) * scale;

// Check if we need a new row
if (x + width + 20 > maxWidth) {
  x = 20;
  y += rowHeight + 40;
  rowHeight = 0;
}

// Draw rectangle
const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect.setAttribute("x", x);
rect.setAttribute("y", y);
rect.setAttribute("width", width);
rect.setAttribute("height", height);
rect.setAttribute("fill", index % 2 === 0 ? "#e3f2fd" : "#f3e5f5");
rect.setAttribute("stroke", "#333");
rect.setAttribute("stroke-width", "1");

// Add label
const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
text.setAttribute("x", x + 5);
text.setAttribute("y", y - 8);
text.setAttribute("font-family", "Arial, sans-serif");
text.setAttribute("font-size", "12");
text.setAttribute("fill", "#333");
text.textContent = piece['Pattern Piece'];

// Add dimensions label
const dimText = document.createElementNS("http://www.w3.org/2000/svg", "text");
dimText.setAttribute("x", x + 5);
dimText.setAttribute("y", y + 15);
dimText.setAttribute("font-family", "Arial, sans-serif");
dimText.setAttribute("font-size", "10");
dimText.setAttribute("fill", "#666");
dimText.textContent = dimensions;

svg.appendChild(rect);
svg.appendChild(text);
svg.appendChild(dimText);

// Update position
x += width + 20;
rowHeight = Math.max(rowHeight, height);
```

});

// Update SVG viewBox to fit content
const totalHeight = y + rowHeight + 40;
svg.setAttribute(“viewBox”, `0 0 ${maxWidth} ${totalHeight}`);
svg.setAttribute(“height”, Math.min(totalHeight, 600));
}

async function downloadPattern() {
if (!currentDownloadUrl) {
showError(‘No pattern available for download’);
return;
}

try {
showLoading(true);

```
const response = await fetch(`${API_BASE_URL}${currentDownloadUrl}`);

if (!response.ok) {
  throw new Error(`Download failed: ${response.status}`);
}

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = `pattern_${new Date().getTime()}.pdf`;
document.body.appendChild(a);
a.click();

window.URL.revokeObjectURL(url);
document.body.removeChild(a);

showSuccess('Pattern downloaded successfully!');
```

} catch (error) {
console.error(‘Download error:’, error);
showError(`Download failed: ${error.message}`);
} finally {
showLoading(false);
}
}

// Form submission handler
document.addEventListener(“DOMContentLoaded”, () => {
const form = document.getElementById(‘measurement-form’);

form.addEventListener(‘submit’, async (e) => {
e.preventDefault();

```
// Clear previous errors
hideError();

// Validate all measurements
const inputs = document.querySelectorAll('#measurement-fields input');
const measurements = {};
let hasErrors = false;

inputs.forEach(input => {
  if (!validateMeasurement(input)) {
    hasErrors = true;
  } else {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      measurements[input.name] = value;
    }
  }
});

// Check if all required measurements are provided
const requiredFields = [
  'neck', 'shoulder', 'chest', 'armLength', 'bicep', 
  'wrist', 'hoodieLength', 'waist', 'hip', 'neckHeight', 'headHeight'
];

const missingFields = requiredFields.filter(field => !(field in measurements));

if (missingFields.length > 0) {
  showError(`Please provide all required measurements: ${missingFields.join(', ')}`);
  hasErrors = true;
}

if (hasErrors) {
  return;
}

// Get customer name
const customerName = document.getElementById('customer-name').value.trim();

console.log("📏 Validated measurements:", measurements);

// Generate pattern
await generatePattern(measurements, customerName);
```

});
});

// Advanced pattern drawing functions (enhanced from original)
function drawFrontBodice(svg, x, y, scale, measurements) {
console.log(“Drawing front bodice with measurements:”, measurements);

const neckWidth = measurements.chest * 0.25 * scale;
const shoulderLength = measurements.shoulder * scale;
const shoulderDrop = shoulderLength * 0.15;
const armholeHeight = measurements.armLength * 0.6 * scale;
const bodyLength = measurements.hoodieLength * scale;

const pathData = [
`M ${x},${y + bodyLength}`,
`L ${x},${y + shoulderDrop}`,
`c 0,-${shoulderDrop/2} ${neckWidth},-10 ${neckWidth + shoulderLength},-${shoulderDrop}`,
`l ${shoulderLength},${shoulderDrop}`,
`c ${-shoulderLength},${armholeHeight} ${-shoulderLength - neckWidth},${armholeHeight} ${-neckWidth},${armholeHeight}`,
`L ${x},${y + bodyLength}`,
`z`
].join(’ ’);

const path = document.createElementNS(svg.namespaceURI, “path”);
path.setAttribute(“d”, pathData);
path.setAttribute(“fill”, “#e3f2fd”);
path.setAttribute(“stroke”, “#333”);
path.setAttribute(“stroke-width”, “2”);
svg.appendChild(path);

// Add grainline
const centerX = x + neckWidth / 2;
const grainline = document.createElementNS(svg.namespaceURI, “line”);
grainline.setAttribute(“x1”, centerX);
grainline.setAttribute(“y1”, y + 10);
grainline.setAttribute(“x2”, centerX);
grainline.setAttribute(“y2”, y + bodyLength - 10);
grainline.setAttribute(“stroke”, “#666”);
grainline.setAttribute(“stroke-width”, “1”);
grainline.setAttribute(“stroke-dasharray”, “5,5”);
grainline.setAttribute(“marker-start”, “url(#arrowStart)”);
grainline.setAttribute(“marker-end”, “url(#arrowEnd)”);
svg.appendChild(grainline);

// Add label
const label = document.createElementNS(svg.namespaceURI, “text”);
label.setAttribute(“x”, x + neckWidth/2);
label.setAttribute(“y”, y - 10);
label.setAttribute(“text-anchor”, “middle”);
label.setAttribute(“font-family”, “Arial, sans-serif”);
label.setAttribute(“font-size”, “12”);
label.setAttribute(“font-weight”, “bold”);
label.textContent = “Front Bodice”;
svg.appendChild(label);
}

// Enhanced pattern drawing that integrates with the simple layout
function drawEnhancedPattern(patternData, measurements) {
const svg = document.getElementById(‘pattern-svg’);
svg.innerHTML = `<defs> <marker id="arrowStart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse"> <path d="M0,5 L10,0 L10,10 Z" fill="#666"/> </marker> <marker id="arrowEnd" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"> <path d="M0,0 L10,5 L0,10 Z" fill="#666"/> </marker> </defs>`;

const scale = 2;
let x = 20;
let y = 20;

// Draw the enhanced front bodice first
if (measurements) {
drawFrontBodice(svg, x, y, scale, measurements);
x += (measurements.chest * 0.25 + measurements.shoulder) * scale + 60;
}

// Draw remaining pattern pieces as rectangles
let rowHeight = 0;
const maxWidth = 1400;

patternData.forEach((piece, index) => {
// Skip front bodice as we’ve already drawn it enhanced
if (piece[‘Pattern Piece’] === ‘Front Bodice’) return;

```
const dimensions = piece['Dimensions'];
const match = dimensions.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/);

if (!match) return;

const width = parseFloat(match[1]) * scale;
const height = parseFloat(match[2]) * scale;

if (x + width + 20 > maxWidth) {
  x = 20;
  y += rowHeight + 60;
  rowHeight = 0;
}

// Draw rectangle
const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect.setAttribute("x", x);
rect.setAttribute("y", y);
rect.setAttribute("width", width);
rect.setAttribute("height", height);
rect.setAttribute("fill", index % 2 === 0 ? "#f3e5f5" : "#e8f5e8");
rect.setAttribute("stroke", "#333");
rect.setAttribute("stroke-width", "1");

// Add pattern piece label
const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
text.setAttribute("x", x + width/2);
text.setAttribute("y", y - 8);
text.setAttribute("text-anchor", "middle");
text.setAttribute("font-family", "Arial, sans-serif");
text.setAttribute("font-size", "11");
text.setAttribute("font-weight", "bold");
text.textContent = piece['Pattern Piece'];

// Add dimensions
const dimText = document.createElementNS("http://www.w3.org/2000/svg", "text");
dimText.setAttribute("x", x + width/2);
dimText.setAttribute("y", y + height/2);
dimText.setAttribute("text-anchor", "middle");
dimText.setAttribute("font-family", "Arial, sans-serif");
dimText.setAttribute("font-size", "9");
dimText.setAttribute("fill", "#666");
dimText.textContent = dimensions;

svg.appendChild(rect);
svg.appendChild(text);
svg.appendChild(dimText);

x += width + 30;
rowHeight = Math.max(rowHeight, height);
```

});

// Update SVG size
const totalHeight = y + rowHeight + 40;
svg.setAttribute(“viewBox”, `0 0 ${maxWidth} ${totalHeight}`);
svg.setAttribute(“height”, Math.min(totalHeight, 600));
}

// Keyboard shortcuts
document.addEventListener(‘keydown’, (e) => {
// Escape key to go back
if (e.key === ‘Escape’) {
const currentSection = document.querySelector(‘section[style*=“block”]’);
if (currentSection) {
const sectionId = currentSection.id;
switch (sectionId) {
case ‘style-section’:
goBackToCategories();
break;
case ‘measurement-section’:
goBackToStyles();
break;
case ‘pattern-output-section’:
goBackToMeasurements();
break;
}
}
}

// Enter key to proceed (when appropriate)
if (e.key === ‘Enter’ && e.ctrlKey) {
const generateBtn = document.querySelector(‘button[type=“submit”]’);
if (generateBtn && generateBtn.style.display !== ‘none’) {
generateBtn.click();
}
}
});

// Auto-save measurements to localStorage (optional feature)
function saveToLocalStorage() {
const inputs = document.querySelectorAll(’#measurement-fields input’);
const measurements = {};

inputs.forEach(input => {
if (input.value) {
measurements[input.name] = input.value;
}
});

if (Object.keys(measurements).length > 0) {
localStorage.setItem(‘saved_measurements’, JSON.stringify(measurements));
}
}

function loadFromLocalStorage() {
try {
const saved = localStorage.getItem(‘saved_measurements’);
if (saved) {
const measurements = JSON.parse(saved);
Object.entries(measurements).forEach(([name, value]) => {
const input = document.getElementById(name);
if (input) {
input.value = value;
}
});
}
} catch (e) {
console.warn(‘Could not load saved measurements:’, e);
}
}

// Add auto-save functionality to measurement inputs
document.addEventListener(“DOMContentLoaded”, () => {
// Load saved measurements after a brief delay to ensure form is rendered
setTimeout(loadFromLocalStorage, 100);

// Auto-save on input changes
document.addEventListener(‘input’, (e) => {
if (e.target.closest(’#measurement-fields’)) {
// Debounce the save operation
clearTimeout(window.autoSaveTimeout);
window.autoSaveTimeout = setTimeout(saveToLocalStorage, 500);
}
});
});

console.log(“✅ Enhanced script.js fully loaded with all features”);
