console.log(“✅ script.js is loaded and starting initialization”);

// Define the garment styles and their sub-categories
const styles = {
tops: [
{ name: “Hoodie”, value: “hoodie”, img: “images/hoodie.jpg” }
],
bottoms: [],
dresses: [],
fullbody: []
};

// Define hoodie sub-styles for when user clicks on hoodie
const hoodieStyles = [
{ name: “Pullover Hoodie”, value: “hoodiePullover”, img: “images/hoodie-pullover.jpg” },
{ name: “Zip‑Up Hoodie”, value: “hoodieZip”, img: “images/hoodie-zip.jpg” }
];

// Global variable to track the selected style
let selectedStyle = null;

// Function to show style options for a selected category
function showStyles(category) {
console.log(“showStyles called with:”, category);

```
// Hide category section and show style section
document.getElementById('category-section').style.display = 'none';
document.getElementById('style-section').style.display = 'block';

// Get the container where we'll display style options
const container = document.getElementById('style-options');
container.innerHTML = ''; // Clear any existing content

// Get the styles for this category
const categoryStyles = styles[category] || [];

// Create clickable style elements for each style in this category
categoryStyles.forEach(style => {
    const styleDiv = document.createElement('div');
    styleDiv.className = 'style-container';
    
    // Create image element (even though we don't have the actual images, this maintains the structure)
    const img = document.createElement('div');
    img.className = 'style-image';
    img.style.cssText = `
        width: 120px;
        height: 120px;
        background: #e3f2fd;
        border: 2px solid #1976d2;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        margin: 0 auto 10px auto;
    `;
    img.textContent = style.name === 'Hoodie' ? '👕' : '👔';
    
    // Add click handler to this style option
    img.addEventListener('click', () => {
        img.style.background = '#ffeb3b'; // Yellow flash feedback
        setTimeout(() => {
            img.style.background = '#e3f2fd';
            showMeasurements(style.value);
        }, 200);
    });
    
    // Create label for the style
    const label = document.createElement('div');
    label.className = 'style-label';
    label.textContent = style.name;
    label.style.textAlign = 'center';
    label.style.fontWeight = 'bold';
    
    // Assemble the style container
    styleDiv.appendChild(img);
    styleDiv.appendChild(label);
    container.appendChild(styleDiv);
});
```

}

// Function to show hoodie sub-styles when hoodie is selected
function showHoodieSubStyles() {
console.log(“showHoodieSubStyles called”);

```
const container = document.getElementById('style-options');
container.innerHTML = ''; // Clear existing content

// Create clickable elements for each hoodie sub-style
hoodieStyles.forEach(style => {
    const styleDiv = document.createElement('div');
    styleDiv.className = 'style-container';
    
    const img = document.createElement('div');
    img.className = 'style-image';
    img.style.cssText = `
        width: 120px;
        height: 120px;
        background: #e3f2fd;
        border: 2px solid #1976d2;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        margin: 0 auto 10px auto;
    `;
    img.textContent = '👕';
    
    // Add click handler for this hoodie style
    img.addEventListener('click', () => {
        img.style.background = '#ffeb3b';
        setTimeout(() => {
            img.style.background = '#e3f2fd';
            showMeasurements(style.value);
        }, 200);
    });
    
    const label = document.createElement('div');
    label.className = 'style-label';
    label.textContent = style.name;
    label.style.textAlign = 'center';
    label.style.fontWeight = 'bold';
    
    styleDiv.appendChild(img);
    styleDiv.appendChild(label);
    container.appendChild(styleDiv);
});
```

}

// Function to show the measurement form for a selected style
function showMeasurements(styleValue) {
console.log(“showMeasurements called with:”, styleValue);

```
// If user clicked on general "hoodie", show sub-styles instead
if (styleValue === "hoodie") {
    showHoodieSubStyles();
    return;
}

// Store the selected style globally for later use
selectedStyle = styleValue;

// Hide style section and show measurement section
document.getElementById('style-section').style.display = 'none';
document.getElementById('measurement-section').style.display = 'block';

// Generate the measurement form fields
renderMeasurementFields();
```

}

// Navigation functions for moving between sections
function goBackToCategories() {
console.log(“goBackToCategories called”);

```
// Hide all sections except category section
document.getElementById('pattern-output-section').style.display = 'none';
document.getElementById('measurement-section').style.display = 'none';
document.getElementById('style-section').style.display = 'none';
document.getElementById('category-section').style.display = 'block';
```

}

function goBackToStyles() {
console.log(“goBackToStyles called”);

```
// Hide measurement section and show style section
document.getElementById('measurement-section').style.display = 'none';
document.getElementById('style-section').style.display = 'block';
```

}

function goBackToMeasurements() {
console.log(“goBackToMeasurements called”);

```
// Hide pattern output and show measurement section
document.getElementById('pattern-output-section').style.display = 'none';
document.getElementById('measurement-section').style.display = 'block';
```

}

function startOver() {
console.log(“startOver called”);

```
// Reset everything and go back to categories
selectedStyle = null;
goBackToCategories();
```

}

// Function to handle pattern download (placeholder for now)
function downloadPattern() {
console.log(“downloadPattern called - PDF would download here”);
// In a full implementation, this would trigger the actual PDF download
alert(“Pattern download would happen here. Connect this to your Flask backend when ready.”);
}

// Utility functions for showing and hiding messages
function hideError() {
const container = document.getElementById(‘error-container’);
if (container) {
container.style.display = ‘none’;
}
}

function hideSuccess() {
const container = document.getElementById(‘success-container’);
if (container) {
container.style.display = ‘none’;
}
}

// Function to create measurement input fields dynamically
function renderMeasurementFields() {
// Define all the measurements we need for a hoodie pattern
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

```
const container = document.getElementById('measurement-fields');
container.innerHTML = ''; // Clear any existing fields

// Create a styled input field for each measurement
Object.entries(fields).forEach(([fieldId, label]) => {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'measure';
    fieldDiv.innerHTML = `
        <label for="${fieldId}">${label}</label>
        <input type="number" id="${fieldId}" name="${fieldId}" 
               min="1" max="200" step="0.1" required
               placeholder="Enter measurement"
               style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%;">
    `;
    container.appendChild(fieldDiv);
});
```

}

// Enhanced pattern drawing function with better visual design
function drawFrontBodice(svg, x, y, scale, measurements) {
// Calculate proportional dimensions based on actual measurements
const neckWidth = measurements.chest * 0.25 * scale;
const shoulderLength = measurements.shoulder * scale;
const shoulderDrop = shoulderLength * 0.15;
const armholeHeight = measurements.armLength * 0.6 * scale;
const bodiceLength = measurements.hoodieLength * scale;

```
// Create the path for the front bodice using SVG path commands
const pathCommands = [
    `M ${x},${y + bodiceLength}`,                                    // Start at bottom left
    `L ${x},${y + shoulderDrop}`,                                    // Line up to shoulder level
    `c 0,-${shoulderDrop/2} ${neckWidth},-10 ${neckWidth + shoulderLength},-${shoulderDrop}`, // Curved neckline
    `l ${shoulderLength},${shoulderDrop}`,                           // Shoulder line
    `c ${-shoulderLength},${armholeHeight} ${-shoulderLength - neckWidth},${armholeHeight} ${-neckWidth},${armholeHeight}`, // Armhole curve
    `L ${x},${y + bodiceLength}`,                                    // Line back to start
    `z`                                                              // Close path
].join(' ');

// Create and style the path element
const path = document.createElementNS(svg.namespaceURI, "path");
path.setAttribute("d", pathCommands);
path.setAttribute("fill", "#e3f2fd");
path.setAttribute("stroke", "#1976d2");
path.setAttribute("stroke-width", "2");
svg.appendChild(path);

// Add a measurement line to show the bodice length
const centerX = x + neckWidth / 2;
const measurementLine = document.createElementNS(svg.namespaceURI, "line");
measurementLine.setAttribute("x1", centerX);
measurementLine.setAttribute("y1", y + 10);
measurementLine.setAttribute("x2", centerX);
measurementLine.setAttribute("y2", y + bodiceLength - 10);
measurementLine.setAttribute("stroke", "#666");
measurementLine.setAttribute("stroke-width", "1");
measurementLine.setAttribute("marker-start", "url(#arrowStart)");
measurementLine.setAttribute("marker-end", "url(#arrowEnd)");
svg.appendChild(measurementLine);
```

}

// Function to draw the complete pattern layout
function drawPattern(patternData, measurements) {
const svg = document.getElementById(‘pattern-svg’);
if (!svg) return;

```
// Clear existing content but preserve the marker definitions
const defs = svg.querySelector('defs');
svg.innerHTML = '';
if (defs) {
    svg.appendChild(defs);
}

// Set up scaling and positioning variables
const scale = 2; // Scale factor for fitting patterns on screen
let x = 20;      // Current X position for drawing
let y = 20;      // Current Y position for drawing
let rowHeight = 0; // Height of current row for proper spacing
const maxWidth = 1400; // Maximum width before wrapping to next row

// Draw the detailed front bodice first
drawFrontBodice(svg, x, y, scale, measurements);

// Move X position for the next pattern piece
x += (measurements.chest * 0.25 + measurements.shoulder) * scale + 40;

// Draw each pattern piece as a labeled rectangle
patternData.forEach((piece, index) => {
    // Extract width and height from dimensions string (e.g., "45.5 x 75.0 cm")
    const width = piece.W * scale;
    const height = piece.H * scale;
    
    // Check if we need to wrap to the next row
    if (x + width > maxWidth) {
        x = 20;
        y += rowHeight + 40;
        rowHeight = 0;
    }
    
    // Create rectangle for this pattern piece
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "#f3e5f5");
    rect.setAttribute("stroke", "#7b1fa2");
    rect.setAttribute("stroke-width", "2");
    
    // Create label for pattern piece name
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + 5);
    label.setAttribute("y", y - 5);
    label.setAttribute("font-family", "Arial, sans-serif");
    label.setAttribute("font-size", "12");
    label.setAttribute("font-weight", "bold");
    label.setAttribute("fill", "#7b1fa2");
    label.textContent = piece.Pattern;
    
    // Create dimensions label
    const dimLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    dimLabel.setAttribute("x", x + 5);
    dimLabel.setAttribute("y", y + 15);
    dimLabel.setAttribute("font-family", "Arial, sans-serif");
    dimLabel.setAttribute("font-size", "10");
    dimLabel.setAttribute("fill", "#666");
    dimLabel.textContent = `${piece.W.toFixed(1)} × ${piece.H.toFixed(1)} cm`;
    
    // Add all elements to the SVG
    svg.appendChild(rect);
    svg.appendChild(label);
    svg.appendChild(dimLabel);
    
    // Update position for next piece
    x += width + 20;
    rowHeight = Math.max(rowHeight, height);
});

// Adjust SVG height based on actual content
const finalHeight = y + rowHeight + 40;
svg.setAttribute("height", finalHeight);
svg.setAttribute("viewBox", `0 0 1470 ${finalHeight}`);
```

}

// MAIN INITIALIZATION - Enhanced for iPad compatibility with visual feedback
document.addEventListener(“DOMContentLoaded”, () => {
console.log(”=== DOM LOADED - STARTING ENHANCED BUTTON SETUP ===”);

```
// Create visual status indicator at the top of the page
const statusDiv = document.createElement('div');
statusDiv.id = 'debug-status';
statusDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #333;
    color: white;
    padding: 10px;
    font-size: 14px;
    z-index: 1000;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;
statusDiv.textContent = 'Initializing pattern generator...';
document.body.insertBefore(statusDiv, document.body.firstChild);

// Add padding to body so status bar doesn't cover content
document.body.style.paddingTop = '60px';

// Diagnostic information about what buttons exist on the page
const allButtons = document.querySelectorAll('button');
console.log(`Found ${allButtons.length} total buttons on the page`);

// Create diagnostic panel to show button information
const diagDiv = document.createElement('div');
diagDiv.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f5;
    border-top: 2px solid #ddd;
    padding: 10px;
    font-size: 11px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 999;
`;

const diagnosticInfo = [`Total buttons: ${allButtons.length}`];
allButtons.forEach((btn, index) => {
    diagnosticInfo.push(`Button ${index}: "${btn.textContent.trim()}" (class: "${btn.className}")`);
});
diagDiv.innerHTML = diagnosticInfo.join('<br>');
document.body.appendChild(diagDiv);

// Find and connect the main category buttons
const categoryButtons = document.querySelectorAll('.category-btn');
statusDiv.textContent = `Found ${categoryButtons.length} category buttons. Setting up connections...`;

if (categoryButtons.length === 0) {
    statusDiv.textContent = 'ERROR: No category buttons found! Check HTML structure.';
    statusDiv.style.background = '#f44336'; // Red error color
    console.error("No buttons found with class 'category-btn'");
    return;
}

// Connect each category button with enhanced iPad-friendly event handling
categoryButtons.forEach((button, index) => {
    const categories = ['tops', 'bottoms', 'dresses', 'fullbody'];
    const category = categories[index];
    
    // Visual indicator that this button has been processed
    button.style.border = '3px solid #4caf50';
    button.style.transition = 'all 0.2s ease';
    
    console.log(`Setting up category button ${index} for: ${category}`);
    
    // Enhanced click handler with visual feedback
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent any default button behavior
        console.log(`Category button clicked: ${category}`);
        
        // Immediate visual feedback
        button.style.background = '#ffeb3b';
        button.style.transform = 'scale(0.95)';
        statusDiv.textContent = `Category selected: ${category}`;
        statusDiv.style.background = '#4caf50';
        
        // Execute the navigation after visual feedback
        setTimeout(() => {
            button.style.background = '';
            button.style.transform = '';
            showStyles(category);
        }, 300);
    });
    
    // Enhanced touch events for better iPad responsiveness
    button.addEventListener('touchstart', (event) => {
        button.style.background = '#e0e0e0';
        button.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('touchend', (event) => {
        setTimeout(() => {
            if (button.style.background === '#e0e0e0') {
                button.style.background = '';
                button.style.transform = '';
            }
        }, 100);
    });
});

// Connect navigation buttons with visual feedback
const backToCategoriesBtn = document.getElementById('back-to-categories-btn');
if (backToCategoriesBtn) {
    backToCategoriesBtn.style.border = '2px solid #2196f3';
    backToCategoriesBtn.addEventListener('click', () => {
        statusDiv.textContent = "Returning to categories...";
        backToCategoriesBtn.style.background = '#ffeb3b';
        setTimeout(() => {
            backToCategoriesBtn.style.background = '';
            goBackToCategories();
        }, 200);
    });
}

const backToStylesBtn = document.getElementById('back-to-styles-btn');
if (backToStylesBtn) {
    backToStylesBtn.style.border = '2px solid #2196f3';
    backToStylesBtn.addEventListener('click', () => {
        statusDiv.textContent = "Returning to styles...";
        backToStylesBtn.style.background = '#ffeb3b';
        setTimeout(() => {
            backToStylesBtn.style.background = '';
            goBackToStyles();
        }, 200);
    });
}

const backToMeasurementsBtn = document.getElementById('back-to-measurements-btn');
if (backToMeasurementsBtn) {
    backToMeasurementsBtn.style.border = '2px solid #2196f3';
    backToMeasurementsBtn.addEventListener('click', () => {
        statusDiv.textContent = "Returning to measurements...";
        backToMeasurementsBtn.style.background = '#ffeb3b';
        setTimeout(() => {
            backToMeasurementsBtn.style.background = '';
            goBackToMeasurements();
        }, 200);
    });
}

const startOverBtn = document.getElementById('start-over-btn');
if (startOverBtn) {
    startOverBtn.style.border = '2px solid #ff9800';
    startOverBtn.addEventListener('click', () => {
        statusDiv.textContent = "Starting over...";
        startOverBtn.style.background = '#ffeb3b';
        setTimeout(() => {
            startOverBtn.style.background = '';
            startOver();
        }, 200);
    });
}

const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
    downloadBtn.style.border = '2px solid #9c27b0';
    downloadBtn.addEventListener('click', () => {
        statusDiv.textContent = "Preparing download...";
        downloadBtn.style.background = '#ffeb3b';
        setTimeout(() => {
            downloadBtn.style.background = '';
            downloadPattern();
        }, 200);
    });
}

// Connect error and success message close buttons
const errorCloseBtn = document.querySelector('.error-close');
if (errorCloseBtn) {
    errorCloseBtn.addEventListener('click', hideError);
}

const successCloseBtn = document.querySelector('.success-close');
if (successCloseBtn) {
    successCloseBtn.addEventListener('click', hideSuccess);
}

// Set up the measurement form with enhanced validation and feedback
const form = document.getElementById('measurement-form');
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("Measurement form submitted");
        
        statusDiv.textContent = "Processing measurements...";
        statusDiv.style.background = '#2196f3'; // Blue for processing
        
        // Collect and validate measurements
        const measurements = {};
        const inputs = document.querySelectorAll('#measurement-fields input');
        let hasErrors = false;
        
        inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (isNaN(value) || value <= 0) {
                hasErrors = true;
                input.style.borderColor = '#f44336'; // Red for errors
                input.style.background = '#ffebee'; // Light red background
            } else {
                measurements[input.name] = value;
                input.style.borderColor = '#4caf50'; // Green for valid
                input.style.background = '#e8f5e8'; // Light green background
            }
        });
        
        if (hasErrors) {
            statusDiv.textContent = "Please check your measurements - some values are missing or invalid";
            statusDiv.style.background = '#f44
```
