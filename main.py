import random
from modules.data_processing import retrieve_table , make_df_from_table_name
from modules.automator import build_finances , build_locations  , get_purchase_table
from flask import Flask, jsonify, render_template
from flask_cors import CORS

# build_locations()
# build_finances()

app = Flask(__name__ , static_folder="static")

CORS(app) #enables  Flask app to handle requests from different origins

displayed_purchases = []
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/api/locations')
def locations():
    return jsonify(retrieve_table("LOCATIONS" , "sqlite:///all_markets_data.db"))

@app.route('/api/finances')
def financials():
    build_finances(False)
    return jsonify(retrieve_table("FINANCES" , "sqlite:///all_markets_data.db"))




@app.route('/api/get_purchase')
def is_called():
    df = get_purchase_table()
    max_index = df.shape[0]
    random_row = df.iloc[random.randint(0, max_index - 1)].to_dict()
    if random_row not in displayed_purchases:
        displayed_purchases.append(random_row)
        print("Called again get_purchase" , random_row)
        return jsonify(random_row)
    

if __name__ == '__main__':
    app.run(debug=True)










#Deprecated

# @app.route('/api/get_readable_image/<image_name>')
# def get_readable_image(image_name):
#     try:
#     # Define the path to your images directory
#         image_path = os.path.join('static', 'media', f'{image_name}.png')
#     
#         # Check if file exists
#         if not os.path.exists(image_path):
#             return jsonify({
#                 "success": False,
#                 "error": "Image not found"
#             }), 404
#     
#         # Open and read the image
#         img = Image.open(image_path)
#     
#         # Converting image to byte stream
#         img_io = BytesIO()
#         img.save(img_io, format='PNG')
#     
#         # Convert to base64
#         img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
#     
#         return jsonify({
#             "success": True,
#             "image": img_base64
#         })
#     
#     except Exception as e:
#         print(f"Error processing image: {str(e)}")
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 400