import os
import cv2
import numpy as np
import base64

def stringToImage(base64_string):
    decoded = base64.b64decode(base64_string)
    np_data = np.frombuffer(decoded, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    return img

sample = stringToImage(image)
stored_image = cv2.imread('sample.bmp')

best_score = 0

sift = cv2.SIFT_create()
keypoints_income, descriptors_income = sift.detectAndCompute(sample, None)
keypoints_stored, descriptors_stored = sift.detectAndCompute(stored_image, None)

# Returns a tuple with the matches
matches = cv2.FlannBasedMatcher({ 
    'algorithm': 1, 'trees': 10
}, {}).knnMatch(descriptors_income, descriptors_stored, k=2)

match_points = []

for p, q in matches:
    # This match is relevant
    if p.distance < 0.1 * q.distance:
        match_points.append(p)

keypoints = 0

# Calculates the score of the match, how good it is
if len(keypoints_income) < len(keypoints_stored):
    keypoints = len(keypoints_income)
else:
    keypoints = len(keypoints_stored)

score = len(match_points) / keypoints * 100
if score > best_score:
    best_score = score

print("SCORE: " + str(best_score))

result = cv2.drawMatches(sample, keypoints_income, stored_image, keypoints_stored, match_points, None)
cv2.imshow('result',result)
cv2.waitKey(0)
cv2.destroyAllWindows()