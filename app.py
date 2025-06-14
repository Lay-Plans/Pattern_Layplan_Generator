
            "Pattern Piece": "Sleeve",
            "Dimensions": f"{data.get('armLength', 0)} x {data.get('bicep', 0)} cm",
            "Cutting Notes": "Cut 2",
            "Grainline": "Along arm",
            "Notches": "Armhole"
        }
    ]
    return jsonify(pattern_data)

if __name__ == '__main__':
    app.run(debug=True)
