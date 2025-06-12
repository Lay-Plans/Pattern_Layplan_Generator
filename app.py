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
