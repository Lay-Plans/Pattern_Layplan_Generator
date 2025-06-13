from flask import Flask, render_template, request, jsonify
from generate_pattern import generate_hoodie_pattern  # Your custom function

app = Flask(__name__)

# Homepage route
@app.route('/')
def home():
    return render_template('index.html')

# API route to generate pattern data
@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()

    try:
        # Convert input values to floats
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

        # Generate pattern DataFrame
        pattern_df = generate_hoodie_pattern(measurements)

        # Return JSON version of the DataFrame
        return jsonify(pattern_df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
