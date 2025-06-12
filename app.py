from flask import Flask, request, render_template, jsonify
from generate_pattern import generate_hoodie_pattern

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json  # incoming measurements
    pattern = generate_hoodie_pattern(data)  # call your code
    return jsonify(pattern.to_dict(orient="records"))
from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/generate-pattern', methods=['POST'])
def generate_pattern():
    data = request.get_json()

    measurements = {
        "chest": float(data["chest"]),
        "shoulder": float(data["shoulder"]),
        "armLength": float(data["armLength"]),
        "bicep": float(data["bicep"]),
        "wrist": float(data["wrist"]),
        "hoodieLength": float(data["hoodieLength"]),
        "waist": float(data["waist"]),
        "hip": float(data["hip"]),
        "neck": float(data["neck"]),
        "neckHeight": float(data["neckHeight"]),
        "headHeight": float(data["headHeight"])
    }

    pattern_data = [
        {
            "Pattern Piece": "Front Bodice",
            "Dimensions (W x H, cm)": f"{round(measurements['chest'] / 2 + 4, 1)} x {measurements['hoodieLength']}"
        },
        {
            "Pattern Piece": "Back Bodice",
            "Dimensions (W x H, cm)": f"{round(measurements['chest'] / 2 + 4, 1)} x {measurements['hoodieLength']}"
        },
        {
            "Pattern Piece": "Sleeve",
            "Dimensions (W x H, cm)": f"{measurements['bicep'] + 8} x {measurements['armLength'] + 4}"
        },
        {
            "Pattern Piece": "Cuff (x2)",
            "Dimensions (W x H, cm)": f"{measurements['wrist'] + 4} x 8"
        },
        {
            "Pattern Piece": "Waistband",
            "Dimensions (W x H, cm)": f"{measurements['hip'] + 10} x 12"
        },
        {
            "Pattern Piece": "Hood (x2)",
            "Dimensions (W x H, cm)": f"{round(measurements['neck'] / 2 + 3, 1)} x {measurements['headHeight'] + 2}"
        },
        {
            "Pattern Piece": "Hood Panel (Centre)",
            "Dimensions (W x H, cm)": f"10 x {measurements['headHeight'] + 2}"
        },
        {
            "Pattern Piece": "Kangaroo Pocket",
            "Dimensions (W x H, cm)": f"{round(measurements['chest'] / 2, 1)} x 20"
        }
    ]

    return jsonify(pattern_data)

if __name__ == '__main__':
    app.run(debug=True)
