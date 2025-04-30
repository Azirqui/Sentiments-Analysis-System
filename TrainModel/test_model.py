import pickle
import numpy as np

# Load the saved model
try:
    with open('heart_disease_multiple_models.pkl', 'rb') as file:
        saved_data = pickle.load(file)
except FileNotFoundError:
    raise Exception("Model file not found. Please make sure 'heart_disease_model.pkl' exists.")

model = saved_data['model']
scaler = saved_data['scaler']
feature_names = saved_data['features']

# Display model accuracy (already trained)
def display_accuracy():
    # Accuracy is not stored, so only available during training normally
    print("\n(Note: Model Accuracy was displayed during training phase.)")

# Function to validate float input
def get_valid_input(prompt, min_value=None, max_value=None):
    while True:
        try:
            value = float(input(prompt))
            if (min_value is not None and value < min_value) or (max_value is not None and value > max_value):
                print(f"Please enter a value between {min_value} and {max_value}.")
                continue
            return value
        except ValueError:
            print("Invalid input. Please enter a numerical value.")

# Collect input safely
print("\nPlease enter the following patient details:")
input_data = []

# Optional: Add known reasonable ranges if you want
feature_ranges = {
    'age': (0, 120),
    'sex': (0, 1),
    'cp': (0, 3),
    'trestbps': (50, 250),
    'chol': (100, 600),
    'fbs': (0, 1),
    'restecg': (0, 2),
    'thalach': (60, 250),
    'exang': (0, 1),
    'oldpeak': (0.0, 6.0),
    'slope': (0, 2),
    'ca': (0, 4),
    'thal': (0, 3)
}

for feature in feature_names:
    min_val, max_val = feature_ranges.get(feature, (None, None))
    prompt = f"Enter {feature} ({'no limit' if min_val is None else f'{min_val}-{max_val}'}): "
    value = get_valid_input(prompt, min_val, max_val)
    input_data.append(value)

# Convert input data to numpy array and scale
input_array = np.array([input_data])
input_scaled = scaler.transform(input_array)

# Predict
prediction = model.predict(input_scaled)[0]

# Output result
if prediction == 1:
    print("\n⚠️  Prediction: The patient is likely to have Heart Disease.")
else:
    print("\n✅  Prediction: The patient is unlikely to have Heart Disease.")

# Show a reminder about accuracy
display_accuracy()
