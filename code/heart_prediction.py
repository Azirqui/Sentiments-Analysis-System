import pandas as pd
import numpy as np
import joblib
import os
import sys
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.exceptions import NotFittedError

# Define expected feature names and ranges (basic validation)
FEATURES = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope',
            'ca', 'thal']

FEATURE_RANGES = {
    'age': (18, 100),
    'sex': (0, 1),
    'cp': (0, 3),
    'trestbps': (80, 200),
    'chol': (100, 600),
    'fbs': (0, 1),
    'restecg': (0, 2),
    'thalach': (60, 220),
    'exang': (0, 1),
    'oldpeak': (0.0, 6.5),
    'slope': (0, 2),
    'ca': (0, 4),
    'thal': (0, 3)
}

MODEL_FILE = 'heart_disease_multiple_models.pkl'

# ---------- Step 1: Validate new data ----------
def validate_input(input_data):
    if len(input_data) != len(FEATURES):
        raise ValueError(f"Expected {len(FEATURES)} features, got {len(input_data)}.")
    
    for val, feature in zip(input_data, FEATURES):
        min_val, max_val = FEATURE_RANGES[feature]
        if not (min_val <= val <= max_val):
            raise ValueError(f"Feature '{feature}' value {val} out of range ({min_val}-{max_val}).")
    return True

# ---------- Step 2: Load and combine data ----------
def load_data():
    df = pd.read_csv('heart.csv')  # Should have same features + target
    return df

# ---------- Step 3: Add new data and retrain model ----------
def add_new_data_and_train(new_data):
    df = load_data()

    # Assuming new_data includes the target as well; otherwise, append without target
    new_patient_df = pd.DataFrame([new_data], columns=FEATURES + ['target'])

    # Append new data to the dataframe
    df = pd.concat([df, new_patient_df], ignore_index=True)

    # Save the updated dataset to the CSV file
    df.to_csv('heart.csv', index=False)

    # Retrain the model with the updated data
    train_and_save_model(df)

# ---------- Step 4: Train model with new data ----------
def train_and_save_model(df):
    X = df[FEATURES]
    y = df['target']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestClassifier(random_state=42)
    model.fit(X_scaled, y)

    joblib.dump({
        'model': model,
        'scaler': scaler,
        'features': FEATURES
    }, MODEL_FILE)

    print("✅ Model trained and saved.")

# ---------- Step 5: Load model ----------
def load_model():
    if not os.path.exists(MODEL_FILE):
        raise FileNotFoundError("Model file not found. Train the model first.")
    return joblib.load(MODEL_FILE)

# ---------- Step 6: Predict on validated input ----------
def predict_on_input(input_data):
    validate_input(input_data)
    
    bundle = load_model()
    model = bundle['model']
    scaler = bundle['scaler']

    try:
        input_scaled = scaler.transform([input_data])
    except NotFittedError:
        raise Exception("Scaler is not fitted. Please retrain the model.")

    prediction = model.predict(input_scaled)
    return prediction[0]

# ---------- Step 7: Evaluate model ----------
def evaluate_model():
    df = load_data()
    X = df[FEATURES]
    y = df['target']
    
    model_data = load_model()
    model = model_data['model']
    scaler = model_data['scaler']

    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled)

    print("Confusion Matrix:\n", confusion_matrix(y, y_pred))
    print("\nClassification Report:\n", classification_report(y, y_pred))
    print(f"Accuracy: {accuracy_score(y, y_pred):.2f}")

# Function to handle API requests
def handle_api_request(input_data):
    try:
        # Make prediction using your existing function
        prediction = predict_on_input(input_data)
        
        # Get probabilities if available
        bundle = load_model()
        model = bundle['model']
        scaler = bundle['scaler']
        input_scaled = scaler.transform([input_data])
        probabilities = model.predict_proba(input_scaled)[0].tolist()
        
        # Return prediction result
        return {
            "prediction": int(prediction),
            "probabilities": probabilities,
            "success": True
        }
    except Exception as e:
        return {"error": str(e), "success": False}

# Main function to process command line arguments
if __name__ == "__main__":
    # Check if we're being called with command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "predict":
            # Read input data from stdin or file
            if len(sys.argv) > 2:
                with open(sys.argv[2], 'r') as f:
                    input_json = f.read()
            else:
                input_json = sys.stdin.read()
            
            input_data = json.loads(input_json)
            result = handle_api_request(input_data)
            print(json.dumps(result))
            sys.exit(0)
    
    # Example run if called directly without arguments
    new_patient = [63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1, 1]  # Example includes target (1 = Disease)

    try:
        prediction = predict_on_input(new_patient[:-1])  # Exclude target when predicting
        print("\n🩺 Prediction for input (0 = No Disease, 1 = Disease):", prediction)

        # Add new data and retrain the model
        add_new_data_and_train(new_patient)
    except ValueError as e:
        print("❌ Input Error:", e)

    # Evaluate current model on all data
    evaluate_model()
