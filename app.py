from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, ValidationError
import os
import tempfile
import uuid
import logging
from datetime import datetime
from dotenv import load_dotenv
from pattern_generator import HoodiePatternGenerator

# Load environment variables

load_dotenv()

# Configure logging

logging.basicConfig(
level=logging.INFO,
format=’%(asctime)s - %(name)s - %(levelname)s - %(message)s’
)
logger = logging.getLogger(**name**)

app = Flask(**name**)
CORS(app)

# Configuration

class Config:
SECRET_KEY = os.environ.get(‘SECRET_KEY’, ‘dev-secret-key-change-in-production’)
DEBUG = os.environ.get(‘DEBUG’, ‘True’).lower() == ‘true’
PATTERNS_FOLDER = os.environ.get(‘PATTERNS_FOLDER’, ‘patterns’)
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
RATELIMIT_STORAGE_URL = os.environ.get(‘REDIS_URL’, ‘memory://’)

app.config.from_object(Config)

# Initialize rate limiter

limiter = Limiter(
app=app,
key_func=get_remote_address,
storage_uri=app.config[‘RATELIMIT_STORAGE_URL’],
default_limits=[“200 per day”, “50 per hour”]
)

# Ensure patterns directory exists

os.makedirs(app.config[‘PATTERNS_FOLDER’], exist_ok=True)

# Input validation schema

class MeasurementSchema(Schema):
chest = fields.Float(required=True, validate=lambda x: 60 <= x <= 150,
error_messages={“validator_failed”: “Chest must be between 60-150 cm”})
shoulder = fields.Float(required=True, validate=lambda x: 30 <= x <= 60,
error_messages={“validator_failed”: “Shoulder must be between 30-60 cm”})
armLength = fields.Float(required=True, validate=lambda x: 40 <= x <= 80,
error_messages={“validator_failed”: “Arm length must be between 40-80 cm”})
bicep = fields.Float(required=True, validate=lambda x: 20 <= x <= 50,
error_messages={“validator_failed”: “Bicep must be between 20-50 cm”})
wrist = fields.Float(required=True, validate=lambda x: 12 <= x <= 25,
error_messages={“validator_failed”: “Wrist must be between 12-25 cm”})
hoodieLength = fields.Float(required=True, validate=lambda x: 50 <= x <= 100,
error_messages={“validator_failed”: “Hoodie length must be between 50-100 cm”})
waist = fields.Float(required=True, validate=lambda x: 50 <= x <= 120,
error_messages={“validator_failed”: “Waist must be between 50-120 cm”})
hip = fields.Float(required=True, validate=lambda x: 60 <= x <= 140,
error_messages={“validator_failed”: “Hip must be between 60-140 cm”})
neck = fields.Float(required=True, validate=lambda x: 30 <= x <= 50,
error_messages={“validator_failed”: “Neck must be between 30-50 cm”})
neckHeight = fields.Float(required=True, validate=lambda x: 5 <= x <= 15,
error_messages={“validator_failed”: “Neck height must be between 5-15 cm”})
headHeight = fields.Float(required=True, validate=lambda x: 15 <= x <= 35,
error_messages={“validator_failed”: “Head height must be between 15-35 cm”})

class PatternRequestSchema(Schema):
measurements = fields.Nested(MeasurementSchema, required=True)
user_name = fields.Str(missing=“Customer”, validate=lambda x: len(x) <= 100)
garment_style = fields.Str(missing=“Pullover Hoodie”, validate=lambda x: len(x) <= 50)

# Error handlers

@app.errorhandler(ValidationError)
def handle_validation_error(e):
logger.warning(f”Validation error: {e.messages}”)
return jsonify({
“status”: “error”,
“message”: “Invalid input data”,
“errors”: e.messages
}), 400

@app.errorhandler(429)
def handle_rate_limit_exceeded(e):
logger.warning(f”Rate limit exceeded: {request.remote_addr}”)
return jsonify({
“status”: “error”,
“message”: “Rate limit exceeded. Please try again later.”
}), 429

@app.errorhandler(413)
def handle_file_too_large(e):
return jsonify({
“status”: “error”,
“message”: “File too large. Maximum size is 16MB.”
}), 413

@app.errorhandler(500)
def handle_internal_error(e):
logger.error(f”Internal error: {str(e)}”)
return jsonify({
“status”: “error”,
“message”: “Internal server error. Please try again later.”
}), 500

# Routes

@app.route(’/’)
def home():
“”“Health check and basic info endpoint”””
return jsonify({
“status”: “success”,
“message”: “Lay Plan Generator Backend is Running”,
“version”: “1.0.0”,
“endpoints”: {
“generate”: “/generate”,
“download”: “/download/<filename>”,
“health”: “/health”
}
})

@app.route(’/health’)
def health_check():
“”“Detailed health check”””
try:
# Check if patterns directory is writable
test_file = os.path.join(app.config[‘PATTERNS_FOLDER’], ‘test’)
with open(test_file, ‘w’) as f:
f.write(‘test’)
os.remove(test_file)

```
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "patterns_folder": app.config['PATTERNS_FOLDER'],
        "patterns_folder_writable": True
    })
except Exception as e:
    logger.error(f"Health check failed: {str(e)}")
    return jsonify({
        "status": "unhealthy",
        "error": str(e)
    }), 500
```

@app.route(’/generate’, methods=[‘POST’])
@limiter.limit(“10 per minute”)
def generate_pattern():
“”“Generate a garment pattern”””
try:
# Validate request
if not request.is_json:
return jsonify({
“status”: “error”,
“message”: “Request must be JSON”
}), 400

```
    # Parse and validate input
    schema = PatternRequestSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({
            "status": "error",
            "message": "Invalid input data",
            "errors": e.messages
        }), 400

    measurements = data['measurements']
    user_name = data['user_name']
    garment_style = data['garment_style']

    logger.info(f"Generating pattern for {user_name} - {garment_style}")
    logger.debug(f"Measurements: {measurements}")

    # Generate pattern
    generator = HoodiePatternGenerator()
    result = generator.generate_hoodie_pattern(
        measurements=measurements,
        user_name=user_name,
        garment_style=garment_style,
        output_dir=app.config['PATTERNS_FOLDER']
    )

    if result['success']:
        response_data = {
            "status": "success",
            "message": result['message'],
            "pattern_data": result['pattern_data'],
            "download_url": f"/download/{result['filename']}",
            "generated_at": datetime.now().isoformat()
        }
        
        logger.info(f"Pattern generated successfully: {result['filename']}")
        return jsonify(response_data)
    else:
        logger.error(f"Pattern generation failed: {result['error']}")
        return jsonify({
            "status": "error",
            "message": result['message'],
            "error": result['error']
        }), 500

except Exception as e:
    logger.error(f"Unexpected error in generate_pattern: {str(e)}")
    return jsonify({
        "status": "error",
        "message": "An unexpected error occurred",
        "error": str(e)
    }), 500
```

@app.route(’/download/<filename>’)
@limiter.limit(“20 per minute”)
def download_pattern(filename):
“”“Download generated pattern PDF”””
try:
# Validate filename (security check)
if not filename.endswith(’.pdf’) or ‘..’ in filename or ‘/’ in filename:
return jsonify({
“status”: “error”,
“message”: “Invalid filename”
}), 400

```
    file_path = os.path.join(app.config['PATTERNS_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        return jsonify({
            "status": "error",
            "message": "File not found"
        }), 404

    logger.info(f"Serving file: {filename}")
    return send_file(
        file_path,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )

except Exception as e:
    logger.error(f"Error serving file {filename}: {str(e)}")
    return jsonify({
        "status": "error",
        "message": "Error downloading file"
    }), 500
```

@app.route(’/patterns’, methods=[‘GET’])
@limiter.limit(“30 per minute”)
def list_patterns():
“”“List available patterns (for development/admin use)”””
try:
patterns = []
pattern_dir = app.config[‘PATTERNS_FOLDER’]

```
    if os.path.exists(pattern_dir):
        for filename in os.listdir(pattern_dir):
            if filename.endswith('.pdf'):
                file_path = os.path.join(pattern_dir, filename)
                stat = os.stat(file_path)
                patterns.append({
                    'filename': filename,
                    'size': stat.st_size,
                    'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    'download_url': f'/download/{filename}'
                })
    
    return jsonify({
        "status": "success",
        "patterns": patterns,
        "total": len(patterns)
    })

except Exception as e:
    logger.error(f"Error listing patterns: {str(e)}")
    return jsonify({
        "status": "error",
        "message": "Error listing patterns"
    }), 500
```

# Development route to serve the frontend (remove in production)

@app.route(’/app’)
def serve_app():
“”“Serve the frontend application (development only)”””
return render_template(‘index.html’)

if **name** == ‘**main**’:
# Development server
app.run(
debug=app.config[‘DEBUG’],
host=‘0.0.0.0’,
port=int(os.environ.get(‘PORT’, 5000))
)
