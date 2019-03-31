from flask import Flask
from flask import request
import sys
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!, debug modee'

@app.route('/image', methods=['POST'])
def parse_request():
    if request.method == 'POST':
        request_data = request.get_json()
        print(request_data['name'])
