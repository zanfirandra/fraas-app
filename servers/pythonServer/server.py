from flask import Flask
from flask import request
from io import BytesIO
from PIL import Image
import base64

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!, debug modee'

@app.route('/image', methods=['POST'])
def parse_request():
    if request.method == 'POST':
        request_data = request.json
        filebase64 = request_data['image_data']
        user_name = request_data['user_name']
        starter = filebase64.find(',')
        image_data = filebase64[starter+1:]
        image_data = bytes(image_data, encoding="ascii")
        im = Image.open(BytesIO(base64.b64decode(image_data)))
        im.save('image.jpg')
        print(user_name)
        return 'got reponse'
