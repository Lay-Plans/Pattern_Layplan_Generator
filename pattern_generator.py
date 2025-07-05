from fpdf import FPDF
import pandas as pd
import os
from datetime import datetime
import logging

# Configure logging

logger = logging.getLogger(**name**)

class HoodiePatternGenerator:
def **init**(self):
# Define standard ease amounts (in cm)
self.ease = {
‘chest’: 15,      # Hoodie needs substantial ease for comfort
‘length’: 5,      # Length ease for movement
‘sleeve’: 8,      # Sleeve ease for arm movement
‘cuff’: -2,       # Cuff should be slightly smaller than wrist
‘hood’: 5,        # Hood ease for head movement
‘waist’: 8,       # Waistband ease
‘pocket’: 2       # Pocket ease
}

```
    # Seam allowances (in cm)
    self.seam_allowance = {
        'standard': 1.5,
        'hem': 2.5,
        'cuff': 1.0,
        'neckline': 1.0
    }

def calculate_front_bodice(self, measurements):
    """Calculate front bodice with proper ease and construction"""
    # Width = 1/4 chest + ease + seam allowance
    width = (measurements['chest'] / 4) + (self.ease['chest'] / 4) + self.seam_allowance['standard']
    # Length = hoodie length + ease + hem allowance
    length = measurements['hoodieLength'] + self.ease['length'] + self.seam_allowance['hem']
    
    return {
        "Pattern Piece": "Front Bodice",
        "Dimensions": f"{round(width, 1)} x {round(length, 1)} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Shoulder point, side seam, neckline center"
    }

def calculate_back_bodice(self, measurements):
    """Calculate back bodice - similar to front but slightly wider"""
    # Back is typically 2cm wider than front for better fit
    width = (measurements['chest'] / 4) + (self.ease['chest'] / 4) + self.seam_allowance['standard'] + 1
    length = measurements['hoodieLength'] + self.ease['length'] + self.seam_allowance['hem']
    
    return {
        "Pattern Piece": "Back Bodice",
        "Dimensions": f"{round(width, 1)} x {round(length, 1)} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Shoulder point, side seam, neckline center"
    }

def calculate_sleeve(self, measurements):
    """Calculate sleeve with proper armhole and ease"""
    # Sleeve width should accommodate bicep + ease + seam allowance
    width = measurements['bicep'] + self.ease['sleeve'] + (self.seam_allowance['standard'] * 2)
    # Sleeve length + ease + cuff allowance
    length = measurements['armLength'] + 4 + self.seam_allowance['cuff']
    
    return {
        "Pattern Piece": "Sleeve",
        "Dimensions": f"{round(width, 1)} x {round(length, 1)} cm",
        "Cutting Notes": "Cut 2",
        "Grainline": "Vertical (parallel to center line)",
        "Notches": "Front armhole, back armhole, elbow dart"
    }

def calculate_cuff(self, measurements):
    """Calculate cuff - should be snug but not tight"""
    # Cuff width = wrist + small ease - to create gathered effect
    width = measurements['wrist'] + self.ease['cuff']
    height = 8  # Standard cuff height
    
    return {
        "Pattern Piece": "Cuff",
        "Dimensions": f"{round(width, 1)} x {height} cm",
        "Cutting Notes": "Cut 2 on fold",
        "Grainline": "Horizontal",
        "Notches": "Center fold line"
    }

def calculate_waistband(self, measurements):
    """Calculate waistband with proper ease"""
    # Waistband should be comfortable around hips
    width = measurements['hip'] + self.ease['waist']
    height = 12  # Standard waistband height
    
    return {
        "Pattern Piece": "Waistband",
        "Dimensions": f"{round(width, 1)} x {height} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Horizontal",
        "Notches": "Center front, side seams"
    }

def calculate_hood_side(self, measurements):
    """Calculate hood side pieces"""
    # Hood width based on head circumference + ease
    width = (measurements['neck'] / 2) + self.ease['hood']
    # Hood height from neckline to top of head + ease
    height = measurements['headHeight'] + measurements['neckHeight'] + 3
    
    return {
        "Pattern Piece": "Hood Side",
        "Dimensions": f"{round(width, 1)} x {round(height, 1)} cm",
        "Cutting Notes": "Cut 2",
        "Grainline": "Curved (follows hood contour)",
        "Notches": "Neckline seam, center back seam"
    }

def calculate_hood_center(self, measurements):
    """Calculate hood center panel"""
    width = 12  # Standard center panel width
    height = measurements['headHeight'] + measurements['neckHeight'] + 3
    
    return {
        "Pattern Piece": "Hood Center Panel",
        "Dimensions": f"{width} x {round(height, 1)} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Top point, neckline attachment"
    }

def calculate_pocket(self, measurements):
    """Calculate kangaroo pocket"""
    # Pocket width should be proportional to chest
    width = (measurements['chest'] / 2) + self.ease['pocket']
    height = 22  # Standard pocket height
    
    return {
        "Pattern Piece": "Kangaroo Pocket",
        "Dimensions": f"{round(width, 1)} x {height} cm",
        "Cutting Notes": "Cut 1",
        "Grainline": "Horizontal",
        "Notches": "Pocket opening, side attachments"
    }

def validate_measurements(self, measurements):
    """Validate measurements are within reasonable ranges"""
    validation_rules = {
        'chest': (60, 150, 'cm'),
        'shoulder': (30, 60, 'cm'),
        'armLength': (40, 80, 'cm'),
        'bicep': (20, 50, 'cm'),
        'wrist': (12, 25, 'cm'),
        'hoodieLength': (50, 100, 'cm'),
        'waist': (50, 120, 'cm'),
        'hip': (60, 140, 'cm'),
        'neck': (30, 50, 'cm'),
        'neckHeight': (5, 15, 'cm'),
        'headHeight': (15, 35, 'cm')
    }
    
    errors = []
    for key, (min_val, max_val, unit) in validation_rules.items():
        if key in measurements:
            value = measurements[key]
            if not (min_val <= value <= max_val):
                errors.append(f"{key}: {value}{unit} is outside valid range ({min_val}-{max_val}{unit})")
        else:
            errors.append(f"Missing measurement: {key}")
    
    return errors

def generate_pattern_data(self, measurements):
    """Generate all pattern pieces"""
    # Validate measurements first
    errors = self.validate_measurements(measurements)
    if errors:
        raise ValueError(f"Invalid measurements: {', '.join(errors)}")
    
    return [
        self.calculate_front_bodice(measurements),
        self.calculate_back_bodice(measurements),
        self.calculate_sleeve(measurements),
        self.calculate_cuff(measurements),
        self.calculate_waistband(measurements),
        self.calculate_hood_side(measurements),
        self.calculate_hood_center(measurements),
        self.calculate_pocket(measurements)
    ]

def create_enhanced_pdf(self, pattern_data, measurements, user_name="Customer", garment_style="Pullover Hoodie"):
    """Create enhanced PDF with better formatting"""
    
    class PatternPDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 16)
            self.cell(0, 10, f'{garment_style} Pattern Specification', 0, 1, 'C')
            self.set_font('Arial', '', 10)
            self.cell(0, 5, f'Generated on: {datetime.now().strftime("%Y-%m-%d at %H:%M")}', 0, 1, 'C')
            self.ln(5)
        
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, f'Page {self.page_no()} | Pattern for {user_name}', 0, 0, 'C')
    
    pdf = PatternPDF()
    pdf.add_page()
    
    # Customer and measurement info
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 8, f'Customer: {user_name}', 0, 1)
    pdf.ln(3)
    
    # Measurements summary
    pdf.set_font('Arial', 'B', 11)
    pdf.cell(0, 8, 'Measurements Used:', 0, 1)
    pdf.set_font('Arial', '', 9)
    
    # Display measurements in two columns
    col1_keys = list(measurements.keys())[:6]
    col2_keys = list(measurements.keys())[6:]
    
    for i, key in enumerate(col1_keys):
        pdf.cell(90, 5, f'{key.replace("_", " ").title()}: {measurements[key]} cm', 0, 0)
        if i < len(col2_keys):
            pdf.cell(90, 5, f'{col2_keys[i].replace("_", " ").title()}: {measurements[col2_keys[i]]} cm', 0, 1)
        else:
            pdf.ln()
    
    pdf.ln(8)
    
    # Pattern pieces table
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(0, 8, 'Pattern Pieces:', 0, 1)
    
    # Table headers with better spacing
    pdf.set_font('Arial', 'B', 9)
    pdf.cell(40, 8, 'Pattern Piece', 1, 0, 'C')
    pdf.cell(35, 8, 'Dimensions', 1, 0, 'C')
    pdf.cell(35, 8, 'Cutting Notes', 1, 0, 'C')
    pdf.cell(40, 8, 'Grainline', 1, 0, 'C')
    pdf.cell(40, 8, 'Notches', 1, 1, 'C')
    
    # Table rows
    pdf.set_font('Arial', '', 8)
    for item in pattern_data:
        pdf.cell(40, 8, item["Pattern Piece"], 1, 0)
        pdf.cell(35, 8, item["Dimensions"], 1, 0)
        pdf.cell(35, 8, item["Cutting Notes"], 1, 0)
        pdf.cell(40, 8, item["Grainline"], 1, 0)
        pdf.cell(40, 8, item["Notches"], 1, 1)
    
    # Construction notes
    pdf.ln(8)
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(0, 8, 'Construction Notes:', 0, 1)
    pdf.set_font('Arial', '', 9)
    
    notes = [
        "• All seam allowances are included in dimensions",
        "• Press seams open unless otherwise specified",
        "• Stay-stitch curved seams before assembly",
        "• Attach hood before installing waistband",
        "• Test fit before final assembly"
    ]
    
    for note in notes:
        pdf.cell(0, 5, note, 0, 1)
    
    return pdf

def generate_hoodie_pattern(self, measurements, user_name="Customer", garment_style="Pullover Hoodie", output_dir="patterns"):
    """Main function to generate hoodie pattern"""
    try:
        logger.info(f"Generating pattern for {user_name} with measurements: {measurements}")
        
        # Generate pattern data
        pattern_data = self.generate_pattern_data(measurements)
        
        # Create DataFrame
        df = pd.DataFrame(pattern_data)
        
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate PDF
        pdf = self.create_enhanced_pdf(pattern_data, measurements, user_name, garment_style)
        
        # Save PDF
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{garment_style.lower().replace(' ', '_')}_pattern_{timestamp}.pdf"
        output_path = os.path.join(output_dir, filename)
        
        pdf.output(output_path)
        
        logger.info(f"Pattern successfully generated: {output_path}")
        
        return {
            'success': True,
            'pattern_data': pattern_data,
            'dataframe': df,
            'pdf_path': output_path,
            'filename': filename,
            'message': f'Pattern generated successfully for {user_name}'
        }
        
    except Exception as e:
        logger.error(f"Error generating pattern: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to generate pattern'
        }
```

# Legacy function for backward compatibility

def generate_hoodie_pattern(measurements, user_name=“Jamila Henry”, garment_style=“Pullover Hoodie”):
“”“Legacy function for backward compatibility”””
generator = HoodiePatternGenerator()
result = generator.generate_hoodie_pattern(measurements, user_name, garment_style)

```
if result['success']:
    print(f"✅ Pattern generated: {result['pdf_path']}")
    return result['dataframe']
else:
    print(f"❌ Error: {result['message']}")
    raise Exception(result['error'])
```

# Example usage

if **name** == “**main**”:
# Test measurements
test_measurements = {
‘chest’: 100,
‘shoulder’: 45,
‘armLength’: 65,
‘bicep’: 35,
‘wrist’: 18,
‘hoodieLength’: 70,
‘waist’: 85,
‘hip’: 105,
‘neck’: 38,
‘neckHeight’: 8,
‘headHeight’: 25
}

```
# Generate pattern
generator = HoodiePatternGenerator()
result = generator.generate_hoodie_pattern(test_measurements, "Test User", "Pullover Hoodie")

if result['success']:
    print("Pattern generated successfully!")
    print(result['dataframe'])
else:
    print(f"Error: {result['message']}")
```
