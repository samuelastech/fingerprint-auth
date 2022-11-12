import base64
import json
import sys
import os

import cv2
import numpy as np
from flask import Response, jsonify, request
from src import User, app

import tensorflow as tf
from tensorflow.keras.models import load_model

predict_score = None

@app.route('/validate', methods=['POST'])
def validate():
    try:
        if not 'image' in request.json:
            raise Exception('you need to provide an image tag')
        
        if not request.json['image']:
            raise Exception('your image cannot be null')

        # Getting the image from rquisition and resizing it
        image_base64 = request.json['image']
        decoded_image = string_to_image(image_base64)
        decoded_image = decoded_image[:,:,:3]
        image_resized = tf.image.resize(decoded_image, (256, 256))

        # Loading the model and predicting
        classificator = load_model('src/models/fingerprint.h5')
        yhat = classificator.predict(np.expand_dims(image_resized/255, 0))
        predict_score = yhat
        
        if yhat > 0.5:
            raise Exception('predicted class is Non-fingerprint')
        else:
            return Response(json.dumps({
                'status': True,
                'message': 'predicted class is Fingerprint',
                'score': str(predict_score)
            }), 200)

    except Exception as error:
        if str(error) == 'you need to provide an image tag':
            handle(error)

        if str(error) == 'your image cannot be null':
            handle(error)
        
        if str(error) == 'Incorrect padding':
            handle(error)

        if str(error) == 'predicted class is Non-fingerprint':
            return Response(json.dumps({
                'status': False,
                'message': str(error),
                'score': str(predict_score)
            }), 400)

        return Response(json.dumps({
            'status': False,
            'message': str(error),
        }), 500)

def handle(error):
    return Response(json.dumps({
        'status': False,
        'message': str(error),
    }), 400)

@app.route('/authenticate', methods=['POST'])
def auth():
    try:
        if not 'image' in request.json:
            raise Exception('you need to provide an image tag')
        
        if not request.json['image']:
            raise Exception('your image cannot be null')
        
        image_base64 = request.json['image']
        image = string_to_image(image_base64)
        result = look_for_matches(image)

        if not result:
            return Response(json.dumps({
                'status': False,
                'message': 'we could not identify this fingerprint'
            }), 404)
        else: 
            response = {
                'status': True,
                'auth': result
            }
            return Response(json.dumps(json.loads(json.dumps(response))), 200)

    except Exception as error:
        if str(error) == 'you need to provide an image tag':
            return Response(json.dumps({
                'status': False,
                'message': str(error)
            }), 404)

        if str(error) == 'your image cannot be null':
            return Response(json.dumps({
                'status': False,
                'message': str(error)
            }), 404)
        
        line = sys.exc_info()[2].tb_lineno
        return Response(json.dumps({
            'status': False,
            'message': str(error),
            'line_number': str(line),
        }), 500)

def string_to_image(base64_string):
    decoded = base64.b64decode(base64_string)
    np_data = np.frombuffer(decoded, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    return img

def look_for_matches(image):
    best_score = 0
    kp1 = None
    kp2 = None
    mp = None
    authUser = None
    for user in User.find():
        # Registered user has not a figerptint
        if not 'fingerprint' in user:
            continue

        # Getting the image and converting it
        image_database = string_to_image(user['fingerprint'])

        # Getting the keypoints from the two images
        sift = cv2.SIFT_create()
        keypoints_auth, descriptors_auth = sift.detectAndCompute(image, None)
        keypoints_db, descriptors_db = sift.detectAndCompute(image_database, None)

        # Getting the matches
        matches = cv2.FlannBasedMatcher({ # Returns a tuple with the matches
            'algorithm': 1, 'trees': 10
        }, {}).knnMatch(descriptors_auth, descriptors_db, k=2)

        match_points = []

        for p, q in matches:
            # This match is relevant
            if p.distance < 0.1 * q.distance:
                match_points.append(p)
        
        keypoints = 0
        if len(keypoints_auth) < len(keypoints_db):
            keypoints = len(keypoints_auth)
        else:
            keypoints = len(keypoints_db)
        
        score = len(match_points) / keypoints * 100
        if score > best_score:
            best_score = score
            kp1, kp2, mp = keypoints_auth, keypoints_db, match_points
            authUser = user

    if best_score < 90:
        return False
    else:
        return {
            'score': best_score,
            'user_id': str(authUser['_id']),
            #'draw_macthes': cv2.drawMatches(image, kp1, image_database, kp2, mp, None)
        }