from flask import Flask
from flask import request
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!, debug modee'

@app.route('/image', methods=['POST'])
def parse_request():
    if request.method == 'POST':
        request_data = request.json
        print(request_data)
        return 'got reponse'
