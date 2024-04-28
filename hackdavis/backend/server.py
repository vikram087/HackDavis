from flask import Flask, jsonify, request
from flask_cors import CORS
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from cachetools import TTLCache
import cv2 
from pytesseract import pytesseract 

client = Elasticsearch(
  "https://0d6359fa06e64215b54cdc773ff82d56.us-central1.gcp.cloud.es.io:443",
  api_key="ZU9FZEk0OEJyckE0ZVY1OGtPOGc6SUJMazBRc3hTemFUOGlBTFVHb1lhQQ=="
)
print(client.info())

# client = Elasticsearch("http://localhost:9200")

app = Flask(__name__)
CORS(app)
model = SentenceTransformer('all-MiniLM-L6-v2')

def getEmbedding(text):
    return model.encode(text)

cache = TTLCache(maxsize=100, ttl=3600)
def get_cached_results(cache_key):
    return cache.get(cache_key)

def cache_results(cache_key, data):
    cache[cache_key] = data
    
def make_cache_key(query, sorting):
    key = f"{query}_{sorting}"
    return key

def insert_documents(name, document, userName):
    allergens = document.split(",")
    operations = []
    
    operations.append({'create': {'_index': 'allergies', "_id": name} })
    operations.append({
        **allergens,
        "embedding": getEmbedding(document),
    })
    
    operations.append({
        'update': {
            '_index': 'users',
            '_id': userName,
            '_op_type': 'update'  # Specify update operation
        }
    })
    operations.append({
        'script': {
            'source': 'if (ctx._source.containsKey("pastScans")) { ctx._source.pastScans.addAll(params.name); } else { ctx._source.pastScans = params.name; }',
            'lang': 'painless',
            'params': {
                'pastScans': [name]
            }
        },
        'upsert': {
            'pastScans': [name]  # If document does not exist, create a new one with these pastScans
        }
    })
    
    return client.bulk(operations=operations)

# cache.clear()
# print("Cleared cache")

# /api/userid
@app.route("/api/userid", methods=['GET'])
def getId():
    data = request.get_json()
    userName = str(data.get("userName", ""))

# /api/pastscans
@app.route("/api/pastscans", methods=['GET'])
def getScans():
    data = request.get_json()
    pastScans = str(data.get("pastScans", ""))

@app.route("/api/getItem", methods=['POST'])
def getItem():
    data = request.get_json()
    barcodes = data.get("barcodes", "")
    document = client.get(index="allergies", id=barcodes)

    return jsonify({ "document": document })


# ZU9FZEk0OEJyckE0ZVY1OGtPOGc6SUJMazBRc3hTemFUOGlBTFVHb1lhQQ==

# /api/allergies
@app.route("/api/allergies", methods=['POST'])
def search():
    data = request.get_json()
    query = str(data.get('query', ""))
    sorting = str(data.get('sorting', ""))
    
    cache_key = make_cache_key(query, sorting)
    cached = get_cached_results(cache_key)
    if cached:
        return jsonify({ "papers": cached[0], "total": cached[1], "accuracy": cached[2] })

    size = client.search(query={"match_all": {}}, index="allergies")['hits']['total']['value']
        
    results = client.search(
        knn={
            'field': 'embedding',
            'query_vector': getEmbedding(query),
            'num_candidates': size,
            'k': 20,
        },
        from_=0,
        size=size,
        sort=[{'_score': {'order': 'desc'}}],
        index="allergies"
    )
        
    hits = results['hits']['hits']
    results = []
    accuracy = {}
    
    for hit in hits:
        results.append(hit['_source'])
        accuracy[hit['_source']['doi']] = hit['_score']
        
    if results:
        cache_results(cache_key, ( results, accuracy ))
        return jsonify({ "allergies": results, "accuracy": accuracy })
    else:
        return jsonify({"error": "No results found"}), 404    

# /api/create-user
@app.route("/api/create-user", methods=['POST'])
def update_allergens():
    data = request.get_json()
    userName = str(data.get('userName', ''))  
    allergens = str(data.get('allergens', ''))  

    operations = []
    operations.append({
        'update': {
            '_index': 'users',
            '_id': userName,
            '_op_type': 'update'  # Specify update operation
        }
    })
    operations.append({
        'script': {
            'source': 'ctx._source.pastScans = params.allergens;',
            'lang': 'painless',
            'params': {
                'allergens': [allergens]
            }
        },
        'upsert': {
            'allergens': [allergens]  # If document does not exist, create a new one with these pastScans
        }
    })
    
    client.bulk(operations=operations)
    
    return jsonify({"message": "User created successfully", "id": userName}), 201

# /api/create-user
@app.route("/api/create-user", methods=['POST'])
def create_user():
    data = request.get_json()
    userName = str(data.get('userName', ''))

    if not userName:
        return jsonify({"error": "Username is required"}), 400

    document = {
        "allergens": [], 
        "pastScans": []  
    }

    try:
        response = client.index(
            index='users',
            id=userName,  
            body=document 
        )

        if response['result'] in ['created', 'updated']:
            return jsonify({"message": "User created/updated successfully", "id": userName}), 201
        else:
            return jsonify({"error": "Failed to create/update user"}), 500
    except Exception as e:
        # Handle exceptions from Elasticsearch
        return jsonify({"error": str(e)}), 500

# /api/image
@app.route("/api/image", methods=['POST'])
def imageReader():
    data = request.get_json()
    image = str(data.get('image', '')) 
    name = str(data.get('name', ''))
    userName = str(data.get('userName', ''))
       
    img = cv2.imread(image)
    
    # Convert image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Scale the image (200% zoom)
    width, height = gray.shape[::-1]
    gray = cv2.resize(gray, (2*width, 2*height), interpolation=cv2.INTER_CUBIC)
    
    # Apply Gaussian blur to remove noise (optional)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply thresholding to the image
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Set tesseract command path
    pytesseract.tesseract_cmd = r"/opt/homebrew/bin/tesseract"
    
    # Convert image to string
    text = pytesseract.image_to_string(thresh)
    
    allergies = text[:-1]
    # allergiesList = allergies.split(',')
    # print(allergies)
    insert_documents(name, allergies, userName)
    
    return jsonify({"message": "User created successfully", "id": userName}), 201

if __name__ == "__main__":
    app.run(debug=True, port=8080)