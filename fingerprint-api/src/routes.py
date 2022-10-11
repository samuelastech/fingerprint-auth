from email import message
from src import app, User
from flask import request, Response, jsonify
import json,base64, numpy as np, cv2

@app.route('/authenticate', methods=['POST'])
def auth():
    try:
        if not 'image' in request.json:
            raise Exception('you need to provide an image')
        
        image_base64 = request.json['image']
        image = string_to_image(image_base64)
        look_for_matches(image)
        
        return Response(json.dumps({
            'status': True,
            'message': 'there is an image',
            'image': 'image_base64'
        }), 200)

    except Exception as error:
        if error == 'you need to provide an image':
            return Response(json.dumps({
                'status': False,
                'message': str(error)
            }), 404)

def string_to_image(base64_string):
    decoded = base64.b64decode(base64_string)
    np_data = np.frombuffer(decoded, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    return img

def look_for_matches(image):
    image_auth = cv2.imread(image)
    best_score = 0
    for user in User.find():
        # Getting the image and converting it
        image_database_base64 = user['fingerprint']
        image_database = string_to_image(image_database_base64)
        image_database = cv2.imread(image_database)

        # Getting the keypoints from the two images
        sift = cv2.SIFT_create()
        keypoints_auth, descriptors_auth = sift.detectAndCompute(image_auth, None)
        keypoints_db, descriptors_db = sift.detectAndCompute(image_database, None)