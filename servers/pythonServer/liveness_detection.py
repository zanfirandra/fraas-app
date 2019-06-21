from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np
import imutils
import pickle
import cv2
import dlib
import tensorflow as tf

# Tensorflow Docker: Failed to get a convolutional algorithm. This is probably because cuDNN failed to initialize https://github.com/tensorflow/tensorflow/issues/27715
config = tf.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.Session(config=config)

print("[INFO] loading trained model liveness detector...")
model_path = './models/liveness_model.h5'
model = load_model(model_path)
# Tensor (“something”) is not an element of this graph.’ Error in Keras using Tensorflow backend on Flask Web Server https://kobkrit.com/tensor-something-is-not-an-element-of-this-graph-error-in-keras-on-flask-web-server-4173a8fe15e1
graph = tf.get_default_graph()

#load face detector
hog_detector = dlib.get_frontal_face_detector()

# read image saved to disk because there are slightly differences between values from loaded image and directly decoded one
imagePath = './faces/liveness.jpg'
def detect_spoofed_image():
        print("[INFO] detecting fake or spoofed image...")
        image = dlib.load_rgb_image(imagePath)
        dets = hog_detector(image, 1)
        for i, d in enumerate(dets):
                face_crop = image[d.top():d.bottom(), d.left():d.right()]
                face_crop = cv2.resize(face_crop, (64,64))
                face = img_to_array(face_crop)
                face = np.expand_dims(face, axis=0)
                print(face)
                global graph
                with graph.as_default():
                        preds = model.predict(face)
                predicted_class_indices = np.argmax(preds, axis=1)
                label = predicted_class_indices[0]
                if(predicted_class_indices[0] == 1):
                        return 'real'
                else:
                        return 'fake'