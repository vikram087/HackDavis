from flask import Flask, jsonify, request
from flask_cors import CORS
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from cachetools import TTLCache
import cv2 
from pytesseract import pytesseract 
import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'hackdavis-6f410.appspot.com/images'
})

client = Elasticsearch("http://localhost:9200")

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

def insert_documents(name, document, userName, barcode):
    allergens = document.split(",")
    
    operations = []
    operations.append({'create': {'_index': 'allergies', "_id": barcode} })
    operations.append({
        "allergens": allergens,
        "name": name,
        "embedding": getEmbedding(name),
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
                'pastScans': [barcode]
            }
        },
        'upsert': {
            'pastScans': [barcode]  # If document does not exist, create a new one with these pastScans
        }
    })
    
    return client.bulk(operations=operations)

# cache.clear()
# print("Cleared cache")

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

# /api/update-allergens
# LFGGGGGGGGGG THIS WORKS, ALL DONE
@app.route("/api/update-allergens", methods=['POST'])
def update_allergens():
    data = request.get_json()
    userName = str(data.get('userName', ''))  
    allergens = list(data.get('allergens', []))

    print(userName)
    print(allergens)
    
    print(client.get(index="users", id=userName))

    operations = [
        {
            'update': {
                '_index': 'users',
                '_id': userName,
            }
        },
        {
            'script': {
                'source': 'if (ctx._source.allergens != null) { ctx._source.allergens = params.allergens } else { ctx._source.allergens = params.allergens }',
                'lang': 'painless',
                'params': {
                    'allergens': allergens
                }
            },
            'upsert': {
                'pastScans': [],
                'allergens': allergens  # Proper initialization of allergens on creation
            }
        }
    ]
    
    client.bulk(body=operations)
    
    return jsonify({"message": "Allergens created successfully", "id": userName}), 201

# /api/create-user
# THIS WORKS, ALL DONE
@app.route("/api/create-user", methods=['POST'])
def create_user():
    data = request.get_json()
    userName = str(data.get('userName', ''))
    
    if(client.exists(index="users", id=userName)):
        return jsonify({"message": "User already exists", "id": userName}), 201
    
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
        
        size = client.search(query={"match_all": {}}, index="users")
        for doc in size['hits']['hits']:
            print(doc)

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
    print(request.form)
    print(request.files)
    name = request.form.get('name', '')
    userName = request.form.get('userName', '')
    barcode = request.form.get('barcode', '')

    # Retrieve file data
    try:
        bucket = storage.bucket()
        print(bucket)
        blob = bucket.blob(f'{name}.png')  # Use curly braces for string formatting
        print("bloy" + str(blob))
        # Download the image to a temporary file
        temp_file = f'{name}.png'
        blob.download_to_filename(f'images/{name}.png')
        # # Download the file
        # destination_path = f'images/{name}.png'
        # downloaded_blob = blob.download_to_filename(destination_path)
    except:
        print("hello")
    img = cv2.imread(f'IMG_2990.png')
    
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
    insert_documents(name, allergies, userName, barcode)
    
    return jsonify({"message": "User created successfully", "id": userName}), 201

if __name__ == "__main__":
    app.run(debug=True, port=8080)