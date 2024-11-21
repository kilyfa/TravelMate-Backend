from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
import tensorflow as tf

app = Flask(__name__)

loaded_model = load_model("model_destinasi_wisatav2.h5")

df = pd.read_csv("DataDestinasi.csv")

scaler = StandardScaler()
df['Price_scaled'] = scaler.fit_transform(df[['Price']])

label_encoder = LabelEncoder()
df['Place_Label'] = label_encoder.fit_transform(df['Place_Name'])

city_encoder = OneHotEncoder(sparse_output=False)
city_encoded = city_encoder.fit_transform(df[['City']])

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "API is running"}), 200

@app.route("/predict", methods=['POST'])
def recommend_v2():
    try :
        data = request.json
        price = data.get('price')
        city = data.get('city')

        if price is None or city is None:
            return jsonify({"error": "Missing required fields: 'price' or 'city'"}), 400


        price_input = tf.constant([price], dtype=tf.float32)
        city_input = tf.constant([city], dtype=tf.string)

        probabilities = loaded_model.predict([price_input, city_input])[0]
        
        top_indices = np.argsort(probabilities)[-5:][::-1]
        
        
        label_encoder = {place: idx for idx, place in enumerate(df['Place_Name'].unique())}
        
        
        recommended_places = [list(label_encoder.keys())[i] for i in top_indices]
        
        recommendations = []
        for place in recommended_places:
            place_data = df[df['Place_Name'] == place].iloc[0]
            recommendations.append({
                "id": int(place_data['Place_Id']),
                "name": place_data['Place_Name'],
                "city": place_data['City'],
                "price": str(place_data['Price']),
                "rating": float(place_data['Rating'])
            })
        return jsonify({"recommendations": recommendations}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/predict/<int:Place_Id>", methods=['GET'])
def getDetailPlace(Place_Id) :
    Place_Id = df[df['Place_Id'] == Place_Id].iloc[0].to_dict()
    return jsonify({
        "data": {
        "id": Place_Id['Place_Id'],
        "name": Place_Id['Place_Name'],
        "description": Place_Id['Description'],
        "address": Place_Id['Alamat Detail'],
        "price": str(Place_Id['Price']),
        "rating": float(Place_Id['Rating'])
        }
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
