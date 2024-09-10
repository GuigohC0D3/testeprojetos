from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import psycopg2 
from psycopg2 import sql
from routes import main_bp

def create_app():
    app = Flask(__name__)
    
    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(main_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)