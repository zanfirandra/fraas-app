import jwt
import datetime

secret = 'secret_key'

def generate_auth_token(user_name):
    try:
        #JWT Claims
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=900), #expire in 15 minutes
            'iat': datetime.datetime.utcnow(),
            'sub': user_name
        }
        encoded_token_bytes = jwt.encode(
            payload,
            secret,
            algorithm='HS256'
        )
        encoded_token_str = encoded_token_bytes.decode("utf-8") # need to be string when sending json to client
        return encoded_token_str
    except Exception as e:
        return e

def validate_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, secret)
        print(payload)
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'