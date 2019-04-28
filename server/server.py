from flask import Flask
from flask import jsonify, request, Response
from flask_cors import CORS
from pymongo import MongoClient
import random
from os import urandom
import json
import hashlib


client = MongoClient('localhost', 27017)
db = client.rides_app_db

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/api/parks", methods=["GET"])
def rides():
    rides_cursor = db.parks.find({}, {'_id': False})
    rides = []
    for ride in rides_cursor:
        rides.append(ride)
    return jsonify(rides)


@app.route("/api/predict", methods=["POST"])
def predict():
    request_json = request.get_json()
    print(request_json)

    return jsonify([
      {
        'name': '8am',
        'value': random.randint(1,101)
      },
      {
        'name': '9am',
        'value': random.randint(1,101)
      },
      {
        'name': '10am',
        'value': random.randint(1,101)
      },
      {
        'name': '11am',
        'value': random.randint(1,101)
      },
      {
        'name': '12pm',
        'value': random.randint(1,101)
      },
      {
        'name': '1pm',
        'value': random.randint(1,101)
      },
      {
        'name': '2pm',
        'value': random.randint(1,101)
      },
      {
        'name': '3pm',
        'value': random.randint(1,101)
      },
      {
        'name': '4pm',
        'value': random.randint(1,101)
      },
      {
        'name': '5pm',
        'value': random.randint(1,101)
      },
      {
        'name': '6pm',
        'value': random.randint(1,101)
      },
      {
        'name': '7pm',
        'value': random.randint(1,101)
      },
      {
        'name': '8pm',
        'value': random.randint(1,101)
      },
      {
        'name': '9pm',
        'value': random.randint(1,101)
      },
      {
        'name': '10pm',
        'value': random.randint(1,101)
      },
      {
        'name': '11pm',
        'value': random.randint(1,101)
      },
      {
        'name': '12am',
        'value': random.randint(1,101)
      }
    ])

@app.route("/api/create_user", methods=["POST"])
def create_user():
    request_json = request.get_json()
    users_cursor = db.users.find({}, {'_id': False})
    user_exists = False
    for user in users_cursor:
        if user['user_name'] == request_json['user_name']:
            user_exists = True
            break

    if user_exists:
        return Response(json.dumps({'status': 'user_exists'}), status=400, mimetype='application/json')
    else:
        password = request_json['password']
        password_hash = hashlib.md5(password.encode())
        password = password_hash.hexdigest()
        token = urandom(16).hex()
        token_hash = hashlib.md5(token.encode())
        token_hashed = token_hash.hexdigest()

        db.users.insert_one({
          'user_name': request_json['user_name'],
          'password': password,
          'favorite_rides': [],
          'token': token_hashed
        })
        return Response(json.dumps({'status': 'user_created', 'token': token}), status=200, mimetype='application/json')

@app.route("/api/login", methods=["POST"])
def login():
    request_json = request.get_json()
    users_cursor = db.users.find({}, {'_id': False})
    found_user = None
    for user in users_cursor:
        if user['user_name'] == request_json['user_name']:
            found_user = user
            break
    password = request_json['password']
    password_hash = hashlib.md5(password.encode())
    password = password_hash.hexdigest()
    if found_user and found_user['password'] == password:
        token = urandom(16).hex()
        token_hash = hashlib.md5(token.encode())
        token_hashed = token_hash.hexdigest()
        db.users.update_one(
            {'user_name': request_json['user_name']},
            {'$set': {
                'token': token_hashed
            }}
        )
        return Response(json.dumps({'status': 'successful', 'token': token}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'status': 'unsuccessful'}), status=401, mimetype='application/json')

@app.route("/api/logout", methods=["POST"])
def logout():
    token = request.headers.get('Authorization')
    token = token[7:]
    token_hash = hashlib.md5(token.encode())
    token_hashed = token_hash.hexdigest()
    users_cursor = db.users.find({}, {'_id': False})
    found_user = None
    for user in users_cursor:
        if user['token'] == token_hashed:
            found_user = user
            break

    if found_user:
        db.users.update_one(
            {'token': token_hashed},
            {'$set': {
                'token': ''
            }}
        )
        return Response(json.dumps({'status': 'successful'}), status=200,
                        mimetype='application/json')
    else:
        return Response(json.dumps({'status': 'unsuccessful'}), status=401, mimetype='application/json')

@app.route("/api/user", methods=["GET"])
def get_user_info():
    token = request.headers.get('Authorization')
    token = token[7:]
    users_cursor = db.users.find({}, {'_id': False})
    found_user = None
    token_hash = hashlib.md5(token.encode())
    token_hashed = token_hash.hexdigest()
    for user in users_cursor:
        if user['token'] == token_hashed:
            found_user = user
            break

    if found_user:
        return Response(json.dumps({'status': 'successful', 'userName': found_user['user_name']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'status': 'unsuccessful'}), status=401, mimetype='application/json')


@app.route("/api/favorite_rides", methods=["GET"])
def get_favorite_rides():
    token = request.headers.get('Authorization')
    token = token[7:]
    users_cursor = db.users.find({}, {'_id': False})

    found_user = None
    token_hash = hashlib.md5(token.encode())
    token_hashed = token_hash.hexdigest()
    for user in users_cursor:
        if user['token'] == token_hashed:
            found_user = user
            break

    if found_user:
        return Response(json.dumps({'status': 'successful', 'favoriteRides': found_user['favorite_rides']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'status': 'unsuccessful'}), status=401, mimetype='application/json')

@app.route("/api/favorite_rides", methods=["POST"])
def set_favorite_rides():
    request_json = request.get_json()
    favorite_rides = request_json['favorite_rides']
    token = request.headers.get('Authorization')
    token = token[7:]
    users_cursor = db.users.find({}, {'_id': False})

    found_user = None
    token_hash = hashlib.md5(token.encode())
    token_hashed = token_hash.hexdigest()
    for user in users_cursor:
        if user['token'] == token_hashed:
            found_user = user
            break

    if found_user:
        db.users.update_one(
            {'token': token_hashed},
            {'$set': {
                'favorite_rides': favorite_rides
            }}
        )
        return Response(json.dumps({'status': 'successful', 'favoriteRides': found_user['favorite_rides']}), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'status': 'unsuccessful'}), status=401, mimetype='application/json')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
