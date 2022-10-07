import os
import cv2
import numpy as np
import base64

def stringToImage(base64_string):
    decoded = base64.b64decode(base64_string)
    np_data = np.fromstring(decoded, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    return img
