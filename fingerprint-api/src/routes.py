from email import message
from src import app, User
from flask import request, Response, jsonify
import json

@app.route('/authenticate', methods=['POST'])
def auth():
    try:
        if not 'image' in request.json:
            raise Exception('you need to provide an image')
        
        image_base64 = request.json.image
        
        return Response(json.dumps({
            'status': True,
            'message': 'there is an image',
            'image': image_base64
        }), 200)
        
    except Exception as error:
        if error == 'you need to provide an image':
            return Response(json.dumps({
                'status': False,
                'message': str(error)
            }), 404)