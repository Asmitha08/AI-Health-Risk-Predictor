import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

# Column names for the dataset
columns = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'num'
]

# Path to the dataset
data_path = '../processed.cleveland.data'

if not os.path.exists(data_path):
    print(f"Error: {data_path} not found.")
    exit(1)

# Load data, replace '?' with NaN and drop missing values
df = pd.read_csv(data_path, names=columns, na_values='?')
df.dropna(inplace=True)

# Select the requested 7 features
features = ['age', 'sex', 'cp', 'trestbps', 'chol', 'thalach', 'oldpeak']
X = df[features]

# Target variable (0 = low risk, >0 = high risk)
y = (df['num'] > 0).astype(int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model trained with accuracy: {accuracy:.2f}")

# Save the model
model_path = 'model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"Model saved to {model_path}")
