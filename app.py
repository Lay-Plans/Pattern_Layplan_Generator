from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from fpdf import FPDF
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Lay Plan Generator Backend is Running"

@app.route('/generate', methods=['POST'])
def generate_pattern():
    data = request.get_json()

    # Debug: Print received measurements
    print("✅ Received Measurements:", data)

    # Extract measurements
    chest = data.get("chest")
    shoulder = data.get("shoulder")
    armLength = data.get("armLength")
    bicep = data.get("bicep")
    wrist = data.get("wrist")
    hoodieLength = data.get("hoodieLength")
    waist = data.get("waist")
    hip = data.get("hip")
    neck = data.get("neck")
    neckHeight = data.get("neckHeight")
    headHeight = data.get("headHeight")

    # Pattern data
    pattern_data = [
        {
            "Pattern Piece": "Front Bodice",
            "Dimensions": f"{round(chest / 2 + 4, 1)} x {hoodieLength} cm",
            "Cutting Notes": "Cut 1 on fold",
            "Grainline": "Vertical",
            "Notches": "Shoulder, side seam"
        },
        {
            "Pattern Piece": "Back Bodice",
            "Dimensions": f"{round(chest / 2 + 4, 1)} x {hoodieLength} cm",
            "Cutting Notes": "Cut 1 on fold",
            "Grainline": "Vertical",
            "Notches": "Shoulder, side seam"
        },
        {
            "Pattern Piece": "Sleeve",
            "Dimensions": f"{bicep + 8} x {armLength + 4} cm",
            "Cutting Notes": "Cut 2",
            "Grainline": "Vertical",
            "Notches": "Front, back, elbow"
        },
        {
            "Pattern Piece": "Cuff (x2)",
            "Dimensions": f"{wrist + 4} x 8 cm",
            "Cutting Notes": "Cut 2 on fold",
            "Grainline": "Horizontal",
            "Notches": "Centre"
        },
        {
            "Pattern Piece": "Waistband",
            "Dimensions": f"{hip + 10} x 12 cm",
            "Cutting Notes": "Cut 1 on fold",
            "Grainline": "Horizontal",
            "Notches": "Centre front, sides"
        },
        {
            "Pattern Piece": "Hood (x2)",
            "Dimensions": f"{round(neck / 2 + 3, 1)} x {headHeight + 2} cm",
            "Cutting Notes": "Cut 2",
            "Grainline": "Curved (follows hood shape)",
            "Notches": "Neck seam"
        },
        {
            "Pattern Piece": "Hood Panel (Centre)",
            "Dimensions": f"10 x {headHeight + 2} cm",
            "Cutting Notes": "Cut 1 on fold",
            "Grainline": "Vertical",
            "Notches": "Top, bottom"
        },
        {
            "Pattern Piece": "Kangaroo Pocket",
            "Dimensions": f"{round(chest / 2, 1)} x 20 cm",
            "Cutting Notes": "Cut 1",
            "Grainline": "Horizontal",
            "Notches": "Pocket opening"
        }
    ]

    # Convert to DataFrame
    df = pd.DataFrame(pattern_data)

    # Generate PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Pullover Hoodie Pattern Specification", ln=True, align="C")

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, "Generated for: Jamila Henry", ln=True)
    pdf.ln(5)

    # Table header
    pdf.set_font("Arial", "B", 10)
    headers = ["Pattern Piece", "Dimensions", "Cutting Notes", "Grainline", "Notches"]
    for h in headers:
        pdf.cell(38, 10, h, border=1)
    pdf.ln()

    # Table rows
    pdf.set_font("Arial", "", 10)
    for item in pattern_data:
        pdf.cell(38, 10, item["Pattern Piece"], border=1)
        pdf.cell(38, 10, item["Dimensions"], border=1)
        pdf.cell(38, 10, item["Cutting Notes"], border=1)
        pdf.cell(38, 10, item["Grainline"], border=1)
        pdf.cell(38, 10, item["Notches"], border=1)
        pdf.ln()

    # Save the PDF
    output_path = "/mnt/data/pullover_hoodie_pattern_specification.pdf"
    pdf.output(output_path)

    # Return JSON response (not the PDF for now)
    return jsonify({
        "status": "success",
        "message": "Pattern generated",
        "pattern": pattern_data,
        "pdf_link": output_path
    })

if __name__ == '__main__':
    app.run(debug=True)
