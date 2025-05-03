# Importing necessary libraries
import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load the dataset
try:
    data = pd.read_csv('heart.csv')  # Make sure heart.csv is in the same folder
except FileNotFoundError:
    raise Exception("Dataset not found. Please make sure 'heart.csv' is present in the working directory.")

# Separate features and target
X = data.drop('target', axis=1)
y = data['target']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the model using Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate the model
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy on Test Set: {accuracy * 100:.2f}%")

# Save the model and scaler securely using pickle
output = {
    'model': model,
    'scaler': scaler,
    'features': list(X.columns)
}

with open('heart_disease_model.pkl', 'wb') as file:
    pickle.dump(output, file)

print("Model and scaler saved successfully to 'heart_disease_model.pkl'.")
