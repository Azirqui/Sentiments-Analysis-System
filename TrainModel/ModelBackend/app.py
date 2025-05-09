from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.exceptions import NotFittedError
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# Load model data
data = joblib.load('heart_disease_multiple_models.pkl')

# Extract model, scaler, and feature names
model = data['model']        # ✅ This is a single trained model
scaler = data['scaler']
features = data['features']

# Load the dataset
df = pd.read_csv('heart.csv')  # Ensure this file is present

# Split the data
X = df[features]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Ensure the scaler is fitted
try:
    scaler.transform(X_test)
except NotFittedError:
    print("Scaler not fitted. Fitting now on training data...")
    scaler.fit(X_train)

@app.route("/predict", methods=["POST"])
def predict():
    content = request.json
    input_data = [
        content["age"],
        content["sex"],
        content["cp"],
        content["trestbps"],
        content["chol"],
        content["fbs"],
        content["restecg"],
        content["thalach"],
        content["exang"],
        content["oldpeak"],
        content["slope"],
        content["ca"],
        content["thal"]
    ]

    # Scale input and predict
    scaled_input = scaler.transform([input_data])
    prediction = model.predict(scaled_input)[0]
    probabilities = model.predict_proba(scaled_input)[0].tolist()

    return jsonify({
        "prediction": int(prediction),
        "probabilities": probabilities
    })

if __name__ == "__main__":
    app.run(debug=True)
