from flask import Flask
from flask import jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.rides_app_db

app = Flask(__name__)
CORS(app)

@app.route("/parks")
def rides():
    rides_cursor = db.parks.find({}, {'_id': False})
    rides = []
    for ride in rides_cursor:
        rides.append(ride)
    return jsonify(rides)

