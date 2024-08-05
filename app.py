from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

UNSPLASH_ACCESS_KEY = 'wJ7Pji4MCQOW7L_c7Xl5bHgTw60t5Z0v-gHHvvK62wo'  # Replace with your Unsplash API key

@app.route('/api/images', methods=['GET'])
def get_images():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    response = requests.get(
        'https://api.unsplash.com/search/photos',
        params={'query': query, 'client_id': UNSPLASH_ACCESS_KEY}
    )
    data = response.json()
    images = []
    if 'results' in data:
        for result in data['results']:
            images.append({
                'id': result['id'],
                'url': result['urls']['small'],
                'description': result['description'] or result['alt_description'],
                'user': result['user']['name'],
                'profile_image': result['user']['profile_image']['small'],
            })

    return jsonify(images)

if __name__ == '__main__':
    app.run(debug=True)