def generate_hoodie_pattern(measurements):
    import pandas as pd

    pattern_data = [
        {
            "Pattern Piece": "Front Bodice",
            "Dimensions (W x H, cm)": f"{round(measurements['chest'] / 2 + 4, 1)} x {measurements['hoodieLength']}"
        },
        ...
    ]

    return pd.DataFrame(pattern_data)
