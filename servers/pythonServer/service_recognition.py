from flask import Flask
from flask import request
from io import BytesIO
from PIL import Image
import base64
import dlib
import numpy as np
import os
import cv2
import _pickle as cPickle

app = Flask(__name__)

def PIL2array(img):
    return np.array(img.getdata(),
                    np.uint8).reshape(img.size[1], img.size[0], 3)

@app.route('/')
def hello_world():
    return 'Hello, World!, debug modee'

@app.route('/image', methods=['POST'])
def parse_request():
    if request.method == 'POST':
        request_data = request.json
        filebase64 = request_data['image_data']
        user_name = request_data['user_name']
        image = decode_image(filebase64, user_name)
        result = proccess_image(image)
        return result

def proccess_image(image):
        # Load face detector and trained models
        face_detector = dlib.get_frontal_face_detector()
        shape_predictor = dlib.shape_predictor("models/shape_predictor_5_face_landmarks.dat")
        face_rec = dlib.face_recognition_model_v1("models/dlib_face_recognition_resnet_model_v1.dat")
        
        bounding_boxes = face_detector(image, 1)
        print("Number of faces detected: {}".format(len(bounding_boxes)))
        if(len(bounding_boxes) > 1):
                return 'Multiple faces not allowed.'
        for k, box in enumerate(bounding_boxes):
                print("Detection {}: Left: {} Top: {} Right: {} Bottom: {}".format(
                k, box.left(), box.top(), box.right(), box.bottom()))
                # Get the landmarks/parts for the face in bounding box.
                shape = shape_predictor(image, box)
                print("Computing descriptor on aligned image ..")
                
                # Let's generate the aligned image using get_face_chip
                face_chip = dlib.get_face_chip(image, shape)        

                # Now we simply pass this chip (aligned image) to the api => face descriptor
                face_embedding = face_rec.compute_face_descriptor(face_chip)

                loaded_data = load_enrolled_embeddings()
                saved_embeddings = loaded_data.get("embeddings")
                labels = loaded_data.get("labels")
                
                #Euclidian distance
                threshold = 0.6
                label = check_euclidian_distance(saved_embeddings, face_embedding, threshold, labels)

                return label

def decode_image(encoded_image, image_name):
        starter = encoded_image.find(',')
        image_data = encoded_image[starter+1:]
        image_data = bytes(image_data, encoding="ascii")
        decode_img = Image.open(BytesIO(base64.b64decode(image_data)))

        faces_folder_path = './faces/'
        image_path = faces_folder_path + image_name + '.jpg'
        decode_img.save(image_path)

        img = PIL2array(decode_img)

        return img

def load_enrolled_embeddings():
        lb_file = open('./saved_embeddings/labels.cpickle', 'rb')
        labels = cPickle.Unpickler(lb_file).load()
        lb_file.close()
        embeddings = np.load('./saved_embeddings/face_embeddings.npy')
        loaded_data = {"embeddings": embeddings, "labels": labels }
        return loaded_data

def check_euclidian_distance(embeddings, embedding, threshold, labels):
        distances = np.linalg.norm(embeddings - embedding, axis=1)
        argmin = np.argmin(distances)
        minDistance = distances[argmin]

        if minDistance > threshold:
                label = "Unknown person"
        else:
                label = labels[argmin]

        return label




