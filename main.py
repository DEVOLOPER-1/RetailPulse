from mdules.automator import *
from flask import Flask, jsonify, render_template
from flask_cors import CORS

# build_locations()
# build_finances()

app = Flask(__name__)

CORS(app) #enables  Flask app to handle requests from different origins
@app.route('templates/')
def index():
    return render_template("index.html")

@app.route('/api/locations')
def locations():
    return jsonify(retrieve_table("LOCATIONS" , "sqlite:///all_markets_data.db"))

@app.route('/api/finances')
def financials():
    build_finances(False)
    return jsonify(retrieve_table("FINANCES" , "sqlite:///all_markets_data.db"))


if __name__ == '__main__':
    app.run(debug=True, port=63342)