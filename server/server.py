from flask import Flask
from flask import jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import random

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
    ]);

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
