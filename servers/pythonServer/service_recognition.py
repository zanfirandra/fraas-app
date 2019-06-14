from io import BytesIO
import base64
from flask import Flask
from flask import request
from flask import Response
from PIL import Image
import numpy as np
import dlib
import _pickle as cPickle
from jwt_auth import generate_auth_token
from jwt_auth import validate_auth_token
import requests
from flask_cors import CORS
import json
from liveness_detection import detect_spoofed_image

app = Flask(__name__)
CORS(app)

enrolled_people = {}
# Load face detector and trained models
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("models/shape_predictor_5_face_landmarks.dat")
face_rec = dlib.face_recognition_model_v1("models/dlib_face_recognition_resnet_model_v1.dat")

def pil_to_array(img):
    return np.array(img.getdata(),
                    np.uint8).reshape(img.size[1], img.size[0], 3)

@app.route('/liveness', methods=['POST'])
def detect_spoofing():
        request_data = request.json
        filebase64 = request_data['image']
        image = decode_image(filebase64, 'liveness')
        getting_bounding_box = get_bounding_boxes(image)
        if(getting_bounding_box.get('bounding_boxes')):
                liveness_result = detect_spoofed_image()
                print(liveness_result)
                if(liveness_result == 'fake'):
                        repsonse = {'error': "Failed liveness detection! Please do not try to impersonate someone!"}
                        return Response(json.dumps(repsonse), mimetype="application/json")
                else:
                        repsonse = {'success': "Passed liveness detection! You can now go to the next step."}
                        return Response(json.dumps(repsonse), mimetype="application/json")
        else:
                return Response(json.dumps(getting_bounding_box), mimetype="application/json")

@app.route('/image', methods=['POST'])
def parse_request():
    if request.method == 'POST':
        request_data = request.json
        filebase64 = request_data['image_data']
        user_name = request_data['user_name']
        image = decode_image(filebase64, user_name)
        getting_bounding_box = get_bounding_boxes(image)
        if(getting_bounding_box.get('bounding_boxes')):
                dets = getting_bounding_box.get('bounding_boxes')
                result = recognize_person(image, dets)
                if result.get('error') == None:
                        print('----parse Request: no error: generate token')
                        auth_token = generate_auth_token(user_name)
                        enrolled_people[user_name] = {}
                        enrolled_people[user_name]['token'] = auth_token
                        enrolled_people[user_name]['label'] = result.get('success')
                        print(enrolled_people[user_name])
                        return Response(json.dumps(enrolled_people[user_name]), mimetype="application/json")
                return Response(json.dumps(result), mimetype="application/json")

        else:
                return Response(json.dumps(getting_bounding_box), mimetype="application/json")

def get_bounding_boxes(image):
        bounding_boxes = face_detector(image, 1)
        print("Number of faces detected: {}".format(len(bounding_boxes)))
        if(len(bounding_boxes) > 1):
                return {'error': 'Multiple faces not allowed.'}
        if(len(bounding_boxes) == 0):
                return {'error': 'None face detected.'}
        return {'bounding_boxes': bounding_boxes}

def recognize_person(image, dets):
        for k, box in enumerate(dets):
                print("Detection {}: Left: {} Top: {} Right: {} Bottom: {}".format(
                k, box.left(), box.top(), box.right(), box.bottom()))
                # Get the landmarks/parts for the face in bounding box.
                shape = shape_predictor(image, box)
                print("Computing descriptor ...")
                
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

        img = pil_to_array(decode_img)

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
                result = {'error': 'Face not recognized. Please try again'}
        else:
                result = {'success': labels[argmin]}

        print('----check euclidian distance')
        print(result)
        return result

@app.route('/third-party', methods=['POST'])
def validate_token():
        auth_token = request.json
        token = auth_token.get('auth_token')
        payload = validate_auth_token(token)
        print('---- validate token')
        print(token)
        print(payload)
        user_info = enrolled_people.get(payload)
        if(user_info != None):
                response = {'success': user_info}
        else:
                response = {'error': payload}
        return Response(json.dumps(response), mimetype="application/json")


