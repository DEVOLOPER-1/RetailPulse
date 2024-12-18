from mdules.automator import *
from flask import Flask, jsonify, render_template

# build_locations()
# build_finances()




app = Flask(__name__)
@app.route('/')
def index():
    return render_template("templates/index.html")


@app.route('/locations')
def locations():
    return jsonify(retrieve_table("LOCATIONS" , "sqlite:///all_markets_data.db"))

@app.route('/finances')
def financials():
    return jsonify(retrieve_table("FINANCES" , "sqlite:///all_markets_data.db"))