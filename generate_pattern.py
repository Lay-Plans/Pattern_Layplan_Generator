import pandas as pd
from fpdf import FPDF

# User and garment metadata
user_name = "Jamila Henry"
garment_style = "Pullover Hoodie"

# Example user measurements in cm
measurements = {
    "chest": 96,
    "shoulder": 42,
    "armLength": 60,
    "bicep": 32,
    "wrist": 18,
    "hoodieLength": 68,
    "waist": 80,
    "hip": 92,
    "neck": 38,
    "neckHeight": 8,
    "headHeight": 24
}

# Define pattern piece calculations and notes
pattern_data = [
    {
        "Pattern Piece": "Front Bodice",
        "Dimensions": f"{round(measurements['chest'] / 2 + 4, 1)} x {measurements['hoodieLength']} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Shoulder, side seam"
    },
    {
        "Pattern Piece": "Back Bodice",
        "Dimensions": f"{round(measurements['chest'] / 2 + 4, 1)} x {measurements['hoodieLength']} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Shoulder, side seam"
    },
    {
        "Pattern Piece": "Sleeve",
        "Dimensions": f"{measurements['bicep'] + 8} x {measurements['armLength'] + 4} cm",
        "Cutting Notes": "Cut 2",
        "Grainline": "Vertical",
        "Notches": "Front, back, elbow"
    },
    {
        "Pattern Piece": "Cuff (x2)",
        "Dimensions": f"{measurements['wrist'] + 4} x 8 cm",
        "Cutting Notes": "Cut 2 on fold",
        "Grainline": "Horizontal",
        "Notches": "Centre"
    },
    {
        "Pattern Piece": "Waistband",
        "Dimensions": f"{measurements['hip'] + 10} x 12 cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Horizontal",
        "Notches": "Centre front, sides"
    },
    {
        "Pattern Piece": "Hood (x2)",
        "Dimensions": f"{round(measurements['neck'] / 2 + 3, 1)} x {measurements['headHeight'] + 2} cm",
        "Cutting Notes": "Cut 2",
        "Grainline": "Curved (follows hood shape)",
        "Notches": "Neck seam"
    },
    {
        "Pattern Piece": "Hood Panel (Centre)",
        "Dimensions": f"10 x {measurements['headHeight'] + 2} cm",
        "Cutting Notes": "Cut 1 on fold",
        "Grainline": "Vertical",
        "Notches": "Top, bottom"
    },
    {
        "Pattern Piece": "Kangaroo Pocket",
        "Dimensions": f"{round(measurements['chest'] / 2, 1)} x 20 cm",
        "Cutting Notes": "Cut 1",
        "Grainline": "Horizontal",
        "Notches": "Pocket opening"
    }
]

# Convert to DataFrame
df = pd.DataFrame(pattern_data)

# Generate PDF output
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", "B", 16)
pdf.cell(0, 10, f"{garment_style} Pattern Specification", ln=True, align="C")

pdf.set_font("Arial", "", 12)
pdf.cell(0, 10, f"Generated for: {user_name}", ln=True)
pdf.ln(5)

# Table headers
pdf.set_font("Arial", "B", 10)
pdf.cell(45, 10, "Pattern Piece", border=1)
pdf.cell(35, 10, "Dimensions", border=1)
pdf.cell(40, 10, "Cutting Notes", border=1)
pdf.cell(35, 10, "Grainline", border=1)
pdf.cell(35, 10, "Notches", border=1)
pdf.ln()

# Table rows
pdf.set_font("Arial", "", 10)
for item in pattern_data:
    pdf.cell(45, 10, item["Pattern Piece"], border=1)
    pdf.cell(35, 10, item["Dimensions"], border=1)
    pdf.cell(40, 10, item["Cutting Notes"], border=1)
    pdf.cell(35, 10, item["Grainline"], border=1)
    pdf.cell(35, 10, item["Notches"], border=1)
    pdf.ln()

# Save to file
pdf_filename = "/mnt/data/pullover_hoodie_pattern_specification.pdf"
pdf.output(pdf_filename)

# Show DataFrame (for debugging or frontend display)
df
