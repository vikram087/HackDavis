import cv2 
import firebase_admin
from firebase_admin import credentials, storage
from pytesseract import pytesseract 
from flask import Flask, jsonify, request
from flask_cors import CORS
from pyzbar.pyzbar import decode 
import time
import subprocess
import os
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'hackdavis-6f410.appspot.com/images'
})

app = Flask(__name__)
CORS(app)


# /api/image   
@app.route("/api/image", methods=['POST'])
def capture_image_with_countdown():
    if 'image' not in request.files:
        return 'No file part', 400

    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400

    if file:
        file.save(os.path.join('images', 'hello.png'))
    #    return 'File uploaded successfully', 200
  #  result = subprocess.run(['python3', 'script.py'], capture_output=True, text=True)

    img = cv2.imread(f'images/hello.png')
    
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
    print(allergies)
    # allergiesList = allergies.split(',')
    # print(allergies)
 #   insert_documents(name, allergies, userName, barcode)
    
    return jsonify({"message": "User created successfully", "allergies": allergies})
if __name__ == "__main__":
    app.run(debug=True, port=8080)