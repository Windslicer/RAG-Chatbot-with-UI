from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from langchain_chroma import Chroma  # Import CORS
from get_embedding_function import get_embedding_function
from query_data import query_rag
from werkzeug.utils import secure_filename
import os
import threading
import json

app = Flask(__name__)

# Enable CORS for all routes (for all origins)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['UPLOAD_FOLDER'] = 'data'
CHROMA_PATH = 'chroma'

def populate_database_async():
    from populate_database import main as populate_db_main
    populate_db_main()

@app.route('/query', methods=['POST', 'OPTIONS'])
def chat():
    # Handle OPTIONS preflight request
    if request.method == 'OPTIONS':
        return '', 200  # No content, status 200 OK for preflight

    # Handle POST request
    data = request.get_json()
    query_text = data.get('query')
    response_text, sources = query_rag(query_text)
    return jsonify({'response': response_text, 'sources': sources})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Populate the database asynchronously
        threading.Thread(target=populate_database_async).start()

        return jsonify({'status': 'File uploaded and database population started', 'file_path': file_path}), 200

@app.route('/pdf/<filename>', methods=['GET'])
def serve_pdf(filename):
    try:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    except Exception as e:
        return str(e), 404

    

@app.route('/chunk', methods=['POST'])
def get_chunk():
    data = request.get_json()
    chunk_id = data.get('id') 

    if not chunk_id:
        return jsonify({'error': 'Missing chunk ID'}), 400

    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    try:
        results = db.get(include=[chunk_id])
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    if results and len(results["documents"]) > 0:
        chunk_text = results["documents"][0].page_content
        return jsonify({'chunk_text': chunk_text})
    else:
        return jsonify({'error': 'Chunk not found'}), 404

# Fix for handling OPTIONS request globally if needed
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(host='0.0.0.0', port=5000, debug=True)

