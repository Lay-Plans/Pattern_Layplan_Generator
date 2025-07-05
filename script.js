// ==========================================
// GARMENT PATTERN GENERATOR - FIXED VERSION
// ==========================================

console.log(“🚀 Pattern Generator Script Loading…”);

// Configuration object to hold all our application data
const PatternConfig = {
// Define garment categories and their available styles
categories: {
tops: [
{ name: “Hoodie”, value: “hoodie”, icon: “👕” }
],
bottoms: [
// Empty for now - can be expanded later
],
dresses: [
// Empty for now - can be expanded later
],
fullbody: [
// Empty for now - can be expanded later
]
},

```
// Hoodie sub-styles that appear when user selects "hoodie"
hoodieStyles: [
    { name: "Pullover Hoodie", value: "hoodiePullover", icon: "👕" },
    { name: "Zip-Up Hoodie", value: "hoodieZip", icon: "🧥" }
],

// Measurement fields required for hoodie patterns
measurements: {
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
    headHeight: "Head Height (cm)"
}
```

};

// Application state to track where the user is in the process
const AppState = {
currentSection: ‘category’,
selectedCategory: null,
selectedStyle: null,
measurements: {},
debugMode: true // Set to false in production
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**

- Show a specific section and hide all others
- @param {string} sectionName - The ID of the section to show (without the -section suffix)
  */
  function showSection(sectionName) {
  console.log(`📱 Switching to section: ${sectionName}`);
  
  // List of all possible sections
  const sections = [‘category’, ‘style’, ‘measurement’, ‘pattern-output’];
  
  // Hide all sections first
  sections.forEach(section => {
  const element = document.getElementById(`${section}-section`);
  if (element) {
  element.style.display = ‘none’;
  }
  });
  
  // Show the requested section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
  targetSection.style.display = ‘block’;
  AppState.currentSection = sectionName;
  updateDebugInfo(`Current section: ${sectionName}`);
  } else {
  console.error(`❌ Section not found: ${sectionName}-section`);
  }
  }

/**

- Update the debug information displayed to the user
- @param {string} message - The message to display
- @param {string} type - The type of message (info, success, error)
  */
  function updateDebugInfo(message, type = ‘info’) {
  if (!AppState.debugMode) return;
  
  const statusDiv = document.getElementById(‘debug-status’);
  if (statusDiv) {
  statusDiv.textContent = message;
  
  ```
   // Color coding based on message type
   switch(type) {
       case 'success':
           statusDiv.style.backgroundColor = '#4caf50';
           break;
       case 'error':
           statusDiv.style.backgroundColor = '#f44336';
           break;
       case 'warning':
           statusDiv.style.backgroundColor = '#ff9800';
           break;
       default:
           statusDiv.style.backgroundColor = '#2196f3';
   }
  ```
  
  }
  
  console.log(`📊 ${message}`);
  }

/**

- Create a visual feedback effect when buttons are clicked
- @param {HTMLElement} button - The button element to animate
- @param {Function} callback - Function to call after animation
  */
  function animateButtonClick(button, callback) {
  // Save original styles
  const originalBg = button.style.backgroundColor;
  const originalTransform = button.style.transform;
  
  // Apply click animation
  button.style.backgroundColor = ‘#ffeb3b’;
  button.style.transform = ‘scale(0.95)’;
  button.style.transition = ‘all 0.2s ease’;
  
  // Restore original styles and execute callback
  setTimeout(() => {
  button.style.backgroundColor = originalBg;
  button.style.transform = originalTransform;
  if (callback) callback();
  }, 200);
  }

// ==========================================
// SECTION NAVIGATION FUNCTIONS
// ==========================================

/**

- Handle category selection and navigate to style selection
- @param {string} category - The selected category (tops, bottoms, etc.)
  */
  function selectCategory(category) {
  console.log(`👕 Category selected: ${category}`);
  updateDebugInfo(`Category selected: ${category}`, ‘success’);
  
  AppState.selectedCategory = category;
  
  // Check if this category has styles available
  const availableStyles = PatternConfig.categories[category];
  
  if (!availableStyles || availableStyles.length === 0) {
  updateDebugInfo(`No styles available for ${category} yet`, ‘warning’);
  alert(`${category.charAt(0).toUpperCase() + category.slice(1)} patterns are coming soon!`);
  return;
  }
  
  // Show the style selection section
  showSection(‘style’);
  renderStyleOptions(category);
  }

/**

- Handle style selection and navigate to measurements or sub-styles
- @param {string} styleValue - The selected style value
  */
  function selectStyle(styleValue) {
  console.log(`🎨 Style selected: ${styleValue}`);
  updateDebugInfo(`Style selected: ${styleValue}`, ‘success’);
  
  // Special case: if user selected general “hoodie”, show hoodie sub-styles
  if (styleValue === ‘hoodie’) {
  renderHoodieSubStyles();
  return;
  }
  
  // Store the selected style and move to measurements
  AppState.selectedStyle = styleValue;
  showSection(‘measurement’);
  renderMeasurementFields();
  }

/**

- Navigate back to category selection
  */
  function goBackToCategories() {
  console.log(‘⬅️ Returning to categories’);
  updateDebugInfo(‘Returning to categories’);
  
  // Reset application state
  AppState.selectedCategory = null;
  AppState.selectedStyle = null;
  AppState.measurements = {};
  
  showSection(‘category’);
  }

/**

- Navigate back to style selection
  */
  function goBackToStyles() {
  console.log(‘⬅️ Returning to styles’);
  updateDebugInfo(‘Returning to styles’);
  
  // Keep category selection but reset style
  AppState.selectedStyle = null;
  AppState.measurements = {};
  
  showSection(‘style’);
  if (AppState.selectedCategory) {
  renderStyleOptions(AppState.selectedCategory);
  }
  }

/**

- Navigate back to measurements
  */
  function goBackToMeasurements() {
  console.log(‘⬅️ Returning to measurements’);
  updateDebugInfo(‘Returning to measurements’);
  
  showSection(‘measurement’);
  renderMeasurementFields();
  }

/**

- Start over from the beginning
  */
  function startOver() {
  console.log(‘🔄 Starting over’);
  updateDebugInfo(‘Starting over’);
  
  goBackToCategories();
  }

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

/**

- Render the available style options for a selected category
- @param {string} category - The category to render styles for
  */
  function renderStyleOptions(category) {
  const container = document.getElementById(‘style-options’);
  if (!container) {
  console.error(‘❌ Style options container not found’);
  return;
  }
  
  container.innerHTML = ‘’; // Clear existing content
  
  const styles = PatternConfig.categories[category];
  
  if (!styles || styles.length === 0) {
  container.innerHTML = ‘<p>No styles available for this category yet.</p>’;
  return;
  }
  
  styles.forEach(style => {
  const styleCard = createStyleCard(style);
  container.appendChild(styleCard);
  });
  }

/**

- Render hoodie sub-style options
  */
  function renderHoodieSubStyles() {
  const container = document.getElementById(‘style-options’);
  if (!container) return;
  
  container.innerHTML = ‘’; // Clear existing content
  
  PatternConfig.hoodieStyles.forEach(style => {
  const styleCard = createStyleCard(style);
  container.appendChild(styleCard);
  });
  }

/**

- Create a clickable style card element
- @param {Object} style - Style object with name, value, and icon
- @returns {HTMLElement} The created style card element
  */
  function createStyleCard(style) {
  // Create main container
  const styleDiv = document.createElement(‘div’);
  styleDiv.className = ‘style-container’;
  styleDiv.style.cssText = `text-align: center; cursor: pointer; padding: 15px; margin: 10px; border: 2px solid #ddd; border-radius: 8px; transition: all 0.3s ease; max-width: 150px;`;
  
  // Create icon/image placeholder
  const iconDiv = document.createElement(‘div’);
  iconDiv.className = ‘style-image’;
  iconDiv.style.cssText = `width: 100px; height: 100px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 2px solid #2196f3; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 10px auto; cursor: pointer;`;
  iconDiv.textContent = style.icon || ‘👕’;
  
  // Create label
  const label = document.createElement(‘div’);
  label.className = ‘style-label’;
  label.style.cssText = `font-weight: bold; color: #333; font-size: 14px;`;
  label.textContent = style.name;
  
  // Add hover effects
  styleDiv.addEventListener(‘mouseenter’, () => {
  styleDiv.style.borderColor = ‘#2196f3’;
  styleDiv.style.transform = ‘translateY(-2px)’;
  styleDiv.style.boxShadow = ‘0 4px 8px rgba(0,0,0,0.1)’;
  });
  
  styleDiv.addEventListener(‘mouseleave’, () => {
  styleDiv.style.borderColor = ‘#ddd’;
  styleDiv.style.transform = ‘translateY(0)’;
  styleDiv.style.boxShadow = ‘none’;
  });
  
  // Add click handler with animation
  styleDiv.addEventListener(‘click’, () => {
  animateButtonClick(styleDiv, () => {
  selectStyle(style.value);
  });
  });
  
  // Assemble the card
  styleDiv.appendChild(iconDiv);
  styleDiv.appendChild(label);
  
  return styleDiv;
  }

/**

- Render the measurement input fields
  */
  function renderMeasurementFields() {
  const container = document.getElementById(‘measurement-fields’);
  if (!container) {
  console.error(‘❌ Measurement fields container not found’);
  return;
  }
  
  container.innerHTML = ‘’; // Clear existing fields
  
  // Create input fields for each measurement
  Object.entries(PatternConfig.measurements).forEach(([fieldId, label]) => {
  const fieldContainer = document.createElement(‘div’);
  fieldContainer.className = ‘measure’;
  fieldContainer.style.cssText = `margin-bottom: 15px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px; background: #fafafa;`;
  
  ```
   // Create label
   const labelElement = document.createElement('label');
   labelElement.setAttribute('for', fieldId);
   labelElement.textContent = label;
   labelElement.style.cssText = `
       display: block;
       margin-bottom: 5px;
       font-weight: 600;
       color: #333;
   `;
   
   // Create input
   const input = document.createElement('input');
   input.type = 'number';
   input.id = fieldId;
   input.name = fieldId;
   input.required = true;
   input.min = '1';
   input.max = '200';
   input.step = '0.1';
   input.placeholder = 'Enter measurement';
   input.style.cssText = `
       width: 100%;
       padding: 8px 12px;
       border: 2px solid #ddd;
       border-radius: 4px;
       font-size: 14px;
       transition: border-color 0.3s ease;
   `;
   
   // Add validation styling on input
   input.addEventListener('input', () => {
       const value = parseFloat(input.value);
       if (isNaN(value) || value <= 0) {
           input.style.borderColor = '#f44336';
           input.style.backgroundColor = '#ffebee';
       } else {
           input.style.borderColor = '#4caf50';
           input.style.backgroundColor = '#e8f5e9';
       }
   });
   
   // Assemble field
   fieldContainer.appendChild(labelElement);
   fieldContainer.appendChild(input);
   container.appendChild(fieldContainer);
  ```
  
  });
  }

// ==========================================
// FORM HANDLING
// ==========================================

/**

- Handle measurement form submission
- @param {Event} event - The form submit event
  */
  function handleMeasurementSubmit(event) {
  event.preventDefault();
  console.log(‘📏 Processing measurements…’);
  updateDebugInfo(‘Processing measurements…’, ‘info’);
  
  // Collect measurements from form
  const measurements = {};
  const inputs = document.querySelectorAll(’#measurement-fields input’);
  let hasErrors = false;
  
  inputs.forEach(input => {
  const value = parseFloat(input.value);
  if (isNaN(value) || value <= 0) {
  hasErrors = true;
  input.style.borderColor = ‘#f44336’;
  input.style.backgroundColor = ‘#ffebee’;
  } else {
  measurements[input.name] = value;
  input.style.borderColor = ‘#4caf50’;
  input.style.backgroundColor = ‘#e8f5e9’;
  }
  });
  
  if (hasErrors) {
  updateDebugInfo(‘Please check your measurements - some values are missing or invalid’, ‘error’);
  return;
  }
  
  // Store measurements in app state
  AppState.measurements = measurements;
  
  // Generate pattern data
  const patternData = generatePatternData(measurements);
  
  // Show results
  showSection(‘pattern-output’);
  displayPatternResults(patternData, measurements);
  
  updateDebugInfo(‘Pattern generated successfully!’, ‘success’);
  }

/**

- Generate pattern data based on measurements
- @param {Object} measurements - The user’s measurements
- @returns {Array} Array of pattern pieces with dimensions
  */
  function generatePatternData(measurements) {
  // This is a simplified version - in production you’d use the Flask backend
  return [
  {
  Pattern: “Front Panel”,
  W: measurements.chest * 0.25,
  H: measurements.hoodieLength,
  Cutting: “Cut 1 on fold”,
  Grainline: “Vertical”,
  Notches: “Center front, shoulder points”
  },
  {
  Pattern: “Back Panel”,
  W: measurements.chest * 0.25,
  H: measurements.hoodieLength,
  Cutting: “Cut 1 on fold”,
  Grainline: “Vertical”,
  Notches: “Center back, shoulder points”
  },
  {
  Pattern: “Sleeve”,
  W: measurements.armLength,
  H: measurements.bicep + 8,
  Cutting: “Cut 2”,
  Grainline: “Vertical”,
  Notches: “Front armhole, back armhole”
  },
  {
  Pattern: “Cuff”,
  W: measurements.wrist * 0.9,
  H: 8,
  Cutting: “Cut 2 on fold”,
  Grainline: “Horizontal”,
  Notches: “Center fold”
  },
  {
  Pattern: “Waistband”,
  W: measurements.hip * 0.9,
  H: 10,
  Cutting: “Cut 1 on fold”,
  Grainline: “Horizontal”,
  Notches: “Side seams”
  },
  {
  Pattern: “Hood Side”,
  W: measurements.neckHeight * 2,
  H: measurements.headHeight,
  Cutting: “Cut 2”,
  Grainline: “Curved”,
  Notches: “Neckline seam”
  },
  {
  Pattern: “Hood Center”,
  W: 10,
  H: measurements.headHeight,
  Cutting: “Cut 1 on fold”,
  Grainline: “Vertical”,
  Notches: “Top point”
  },
  {
  Pattern: “Pocket”,
  W: measurements.chest * 0.6,
  H: 20,
  Cutting: “Cut 1”,
  Grainline: “Horizontal”,
  Notches: “Pocket openings”
  }
  ];
  }

/**

- Display the pattern results in the output section
- @param {Array} patternData - Array of pattern pieces
- @param {Object} measurements - The user’s measurements
  */
  function displayPatternResults(patternData, measurements) {
  // Populate the pattern table
  const tbody = document.querySelector(’#pattern-table tbody’);
  if (tbody) {
  tbody.innerHTML = ‘’;
  
  ```
   patternData.forEach(piece => {
       const row = document.createElement('tr');
       row.innerHTML = `
           <td style="font-weight: bold;">${piece.Pattern}</td>
           <td>${piece.W.toFixed(1)} × ${piece.H.toFixed(1)} cm</td>
           <td>${piece.Cutting}</td>
           <td>${piece.Grainline}</td>
           <td>${piece.Notches}</td>
       `;
       tbody.appendChild(row);
   });
  ```
  
  }
  
  // Draw the pattern visualization
  drawPatternVisualization(patternData, measurements);
  }

/**

- Draw the SVG pattern visualization
- @param {Array} patternData - Array of pattern pieces
- @param {Object} measurements - The user’s measurements
  */
  function drawPatternVisualization(patternData, measurements) {
  const svg = document.getElementById(‘pattern-svg’);
  if (!svg) return;
  
  // Clear existing content but preserve marker definitions
  const defs = svg.querySelector(‘defs’);
  svg.innerHTML = ‘’;
  if (defs) {
  svg.appendChild(defs);
  }
  
  // Drawing parameters
  const scale = 2;
  let x = 20;
  let y = 20;
  let rowHeight = 0;
  const maxWidth = 1400;
  
  // Draw each pattern piece
  patternData.forEach((piece, index) => {
  const width = piece.W * scale;
  const height = piece.H * scale;
  
  ```
   // Wrap to next row if needed
   if (x + width > maxWidth) {
       x = 20;
       y += rowHeight + 40;
       rowHeight = 0;
   }
   
   // Create rectangle for pattern piece
   const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
   rect.setAttribute("x", x);
   rect.setAttribute("y", y);
   rect.setAttribute("width", width);
   rect.setAttribute("height", height);
   rect.setAttribute("fill", "#e3f2fd");
   rect.setAttribute("stroke", "#1976d2");
   rect.setAttribute("stroke-width", "2");
   rect.setAttribute("rx", "4"); // Rounded corners
   
   // Create pattern name label
   const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
   label.setAttribute("x", x + 5);
   label.setAttribute("y", y - 5);
   label.setAttribute("font-family", "Arial, sans-serif");
   label.setAttribute("font-size", "12");
   label.setAttribute("font-weight", "bold");
   label.setAttribute("fill", "#1976d2");
   label.textContent = piece.Pattern;
   
   // Create dimensions label
   const dimLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
   dimLabel.setAttribute("x", x + 5);
   dimLabel.setAttribute("y", y + 15);
   dimLabel.setAttribute("font-family", "Arial, sans-serif");
   dimLabel.setAttribute("font-size", "10");
   dimLabel.setAttribute("fill", "#666");
   dimLabel.textContent = `${piece.W.toFixed(1)} × ${piece.H.toFixed(1)} cm`;
   
   // Add elements to SVG
   svg.appendChild(rect);
   svg.appendChild(label);
   svg.appendChild(dimLabel);
   
   // Update position for next piece
   x += width + 20;
   rowHeight = Math.max(rowHeight, height);
  ```
  
  });
  
  // Adjust SVG height to fit content
  const finalHeight = y + rowHeight + 40;
  svg.setAttribute(“height”, finalHeight);
  svg.setAttribute(“viewBox”, `0 0 1470 ${finalHeight}`);
  }

// ==========================================
// INITIALIZATION AND EVENT SETUP
// ==========================================

/**

- Initialize the application when DOM is loaded
  */
  function initializeApp() {
  console.log(‘🎯 Initializing Pattern Generator App…’);
  
  // Create debug status bar if in debug mode
  if (AppState.debugMode) {
  createDebugStatusBar();
  }
  
  // Set up category button event listeners
  setupCategoryButtons();
  
  // Set up navigation button event listeners
  setupNavigationButtons();
  
  // Set up form event listeners
  setupFormHandlers();
  
  // Set up message close buttons
  setupMessageHandlers();
  
  updateDebugInfo(‘App initialized successfully!’, ‘success’);
  console.log(‘✅ App initialization complete’);
  }

/**

- Create a debug status bar for development
  */
  function createDebugStatusBar() {
  const statusDiv = document.createElement(‘div’);
  statusDiv.id = ‘debug-status’;
  statusDiv.style.cssText = `position: fixed; top: 0; left: 0; right: 0; background: #2196f3; color: white; padding: 10px; font-size: 14px; z-index: 1000; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-family: Arial, sans-serif;`;
  statusDiv.textContent = ‘Pattern Generator Ready’;
  
  document.body.insertBefore(statusDiv, document.body.firstChild);
  document.body.style.paddingTop = ‘50px’;
  }

/**

- Set up event listeners for category buttons
  */
  function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll(’.category-btn’);
  console.log(`🔘 Found ${categoryButtons.length} category buttons`);
  
  if (categoryButtons.length === 0) {
  console.error(‘❌ No category buttons found! Check HTML structure.’);
  updateDebugInfo(‘ERROR: No category buttons found!’, ‘error’);
  return;
  }
  
  categoryButtons.forEach((button, index) => {
  // Get category from data attribute or fall back to index-based mapping
  const category = button.getAttribute(‘data-category’) ||
  [‘tops’, ‘bottoms’, ‘dresses’, ‘fullbody’][index];
  
  ```
   console.log(`🔗 Connecting button ${index + 1} to category: ${category}`);
   
   // Visual indicator that button is connected
   button.style.border = '2px solid #4caf50';
   button.style.transition = 'all 0.3s ease';
   
   // Enhanced click handler with animation
   button.addEventListener('click', (event) => {
       event.preventDefault();
       console.log(`🎯 Category button clicked: ${category}`);
       
       animateButtonClick(button, () => {
           selectCategory(category);
       });
   });
   
   // Touch events for mobile/tablet
   button.addEventListener('touchstart', (event) => {
       button.style.backgroundColor = '#e0e0e0';
       button.style.transform = 'scale(0.98)';
   });
   
   button.addEventListener('touchend', (event) => {
       setTimeout(() => {
           button.style.backgroundColor = '';
           button.style.transform = '';
       }, 100);
   });
  ```
  
  });
  }

/**

- Set up event listeners for navigation buttons
  */
  function setupNavigationButtons() {
  // Back to Categories button
  const backToCategoriesBtn = document.getElementById(‘back-to-categories-btn’);
  if (backToCategoriesBtn) {
  backToCategoriesBtn.addEventListener(‘click’, (event) => {
  event.preventDefault();
  animateButtonClick(backToCategoriesBtn, goBackToCategories);
  });
  }
  
  // Back to Styles button  
  const backToStylesBtn = document.getElementById(‘back-to-styles-btn’);
  if (backToStylesBtn) {
  backToStylesBtn.addEventListener(‘click’, (event) => {
  event.preventDefault();
  animateButtonClick(backToStylesBtn, goBackToStyles);
  });
  }
  
  // Back to Measurements button
  const backToMeasurementsBtn = document.getElementById(‘back-to-measurements-btn’);
  if (backToMeasurementsBtn) {
  backToMeasurementsBtn.addEventListener(‘click’, (event) => {
  event.preventDefault();
  animateButtonClick(backToMeasurementsBtn, goBackToMeasurements);
  });
  }
  
  // Start Over button
  const startOverBtn = document.getElementById(‘start-over-btn’);
  if (startOverBtn) {
  startOverBtn.addEventListener(‘click’, (event) => {
  event.preventDefault();
  animateButtonClick(startOverBtn, startOver);
  });
  }
  
  // Download button
  const downloadBtn = document.getElementById(‘download-btn’);
  if (downloadBtn) {
  downloadBtn.addEventListener(‘click’, (event) => {
  event.preventDefault();
  updateDebugInfo(‘Download feature coming soon!’, ‘warning’);
  alert(‘Download feature will be connected to your Flask backend.’);
  });
  }
  }

/**

- Set up form event handlers
  */
  function setupFormHandlers() {
  const form = document.getElementById(‘measurement-form’);
  if (form) {
  form.addEventListener(‘submit’, handleMeasurementSubmit);
  console.log(‘📋 Form handlers connected’);
  }
  }

/**

- Set up message close button handlers
  */
  function setupMessageHandlers() {
  const errorCloseBtn = document.querySelector(’.error-close’);
  if (errorCloseBtn) {
  errorCloseBtn.addEventListener(‘click’, () => {
  document.getElementById(‘error-container’).style.display = ‘none’;
  });
  }
  
  const successCloseBtn = document.querySelector(’.success-close’);
  if (successCloseBtn) {
  successCloseBtn.addEventListener(‘click’, () => {
  document.getElementById(‘success-container’).style.display = ‘none’;
  });
  }
  }

// ==========================================
// APPLICATION STARTUP
// ==========================================

// Wait for DOM to be fully loaded before initializing
if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, initializeApp);
} else {
// DOM is already loaded
initializeApp();
}

console.log(“✅ Pattern Generator Script Loaded Successfully”);
