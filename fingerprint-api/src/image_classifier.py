import os
os.environ['TF_ENABLE_ONEDNN_OPTS']='0'
os.environ['CUDA_VISIBLE_DEVICES']= "0"

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

# batch[0] - images as numpy arrays
# batch[1] - labels, 0 is equal to a fingerprint

# PRE-PROCESSING
# Scale data
data = data.map(lambda x, y: (x / 255, y))
scaled_iterator = data.as_numpy_iterator()
scaled_batch = scaled_iterator.next()

# Partitioning the dataset
train_size = int(len(data)*.7)
val_size = int(len(data)*.2)+1
test_size = int(len(data)*.1)+1

train = data.take(train_size)
val = data.skip(train_size).take(val_size)
test = data.skip(train_size+val_size).take(test_size)

# Building the Network
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten, Dropout

model = Sequential()

model.add(Conv2D(16, (3,3), 1, activation='relu', input_shape=(256,256,3)))
model.add(MaxPooling2D())
model.add(Conv2D(32, (3,3), 1, activation='relu'))
model.add(MaxPooling2D())
model.add(Conv2D(16, (3,3), 1, activation='relu'))
model.add(MaxPooling2D())
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile('adam', loss=tf.losses.BinaryCrossentropy(), metrics=['accuracy'])
model.summary()

# Training the DNN
# With a GPU it goes faster, but you still able to do this without it
logdir='logs'
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=logdir)
hist = model.fit(train, epochs=1, validation_data=val, callbacks=[tensorboard_callback])

# Evaluate
from tensorflow.keras.metrics import Precision, Recall, BinaryAccuracy

pre = Precision()
re = Recall()
acc = BinaryAccuracy()

for batch in test.as_numpy_iterator(): 
    X, y = batch
    yhat = model.predict(X)
    pre.update_state(y, yhat)
    re.update_state(y, yhat)
    acc.update_state(y, yhat)

print(f'Precision: {pre.result().numpy()},\nRecall: {re.result().numpy()},\nAccuracy: {acc.result().numpy()}')

'''
fig, ax = plt.subplots(ncols=4, figsize=(20,20))
for idx, img in enumerate(scaled_batch[0][:4]):
    ax[idx].imshow(img)
    ax[idx].title.set_text(scaled_batch[1][idx])
'''