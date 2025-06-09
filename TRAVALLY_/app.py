from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import bcrypt
from flask_jwt_extended import create_access_token, JWTManager

app = Flask(__name__)
CORS(app)

# Config
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "dev-secret-key")  # Change in production!

# Admin credentials (pre-hashed)
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@travally.com")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", 
    bcrypt.hashpw("admin123".encode(), bcrypt.gensalt()))

jwt = JWTManager(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if (email == ADMIN_EMAIL and 
        bcrypt.checkpw(password.encode(), ADMIN_PASSWORD_HASH.encode())):
        token = create_access_token(identity=email)
        return jsonify(token=token)
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    return jsonify({"error": "Admin signup disabled"}), 403

if __name__ == '__main__':
    app.run(debug=True)