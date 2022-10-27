import os
import cv2
import imghdr
import tensorflow as tf
import numpy
from matplotlib import pyplot as plt

image_extensions = ['jpeg', 'jpg', 'bmp', 'png']
data_dir = 'data'

# Looping through the dataset
for image_class in os.listdir(data_dir):
    dataset = os.listdir(os.path.join(data_dir, image_class))

    for image in dataset:
        image_path = os.path.join(data_dir, image_class, image) # data/fingerprint/left_hand.bmp
        try:
            img = cv2.imread(image_path) # read the image as numpy array
            tip = imghdr.what(image_path)
            
            # Verify image's extension
            if tip not in image_extensions:
                print('Image not in extension list {}'.format(image_path))
                os.remove(image_path)
        except Exception as error:
            print('Issue with the image {}'.format(image_path))

data = tf.keras.utils.image_dataset_from_directory('data') # Pre-process the images, data pipeline, dataset
data_iterator = data.as_numpy_iterator() # Allowing accessing the data pipeline, looping through it
batch = data_iterator.next() # Actually accessing the data pipeline, grabbing one batch back

# batch[0] - brings the images as numpy arrays
# batch[1] - brings the labels, 0 is equal to a fingerprint

fig, ax = plt.subplots(ncols=4, figsize=(20,20))
for i, img in enumerate(batch[0][:4]):
    ax[i].imshow(img.astype(int))
    ax[i].title.set_text(batch[1][i])