from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import numpy as np
import os

app = FastAPI(title="AI Health Risk Prediction API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL_PATH = "model.pkl"
model = None

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
else:
    print(f"Warning: Model not found at {MODEL_PATH}. Please run train_model.py first.")

class HealthData(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="1 = male; 0 = female")
    cp: int = Field(..., ge=1, le=4, description="Chest pain type (1-4)")
    trestbps: float = Field(..., ge=80, le=250, description="Resting blood pressure")
    chol: float = Field(..., ge=100, le=600, description="Serum cholestoral in mg/dl")
    thalach: float = Field(..., ge=60, le=220, description="Maximum heart rate achieved")
    oldpeak: float = Field(..., ge=0.0, le=6.0, description="ST depression induced by exercise")

def generate_recommendations(data: HealthData, is_high_risk: bool):
    recommendations = []
    
    if is_high_risk:
        recommendations.append("Please consult a cardiologist for a comprehensive evaluation.")
    
    if data.chol > 200:
        recommendations.append("Cholesterol levels are elevated. Consider a heart-healthy diet low in saturated fats.")
    if data.trestbps > 130:
        recommendations.append("Blood pressure is elevated. Monitor regularly and reduce sodium intake.")
    if data.thalach < 100:
        recommendations.append("Maximum heart rate is on the lower side. Discuss appropriate exercise levels with a doctor.")
        
    if not recommendations:
        recommendations.append("Maintain a healthy lifestyle with balanced diet and regular exercise.")
        
    return recommendations

@app.post("/predict")
def predict_risk(data: HealthData):
    if not model:
        return {"error": "Model not loaded"}

    import pandas as pd
    
    feature_names = ['age', 'sex', 'cp', 'trestbps', 'chol', 'thalach', 'oldpeak']
    
    # Process input into a DataFrame with the same feature names as training
    input_data = pd.DataFrame([{
        'age': data.age,
        'sex': data.sex,
        'cp': data.cp,
        'trestbps': data.trestbps,
        'chol': data.chol,
        'thalach': data.thalach,
        'oldpeak': data.oldpeak
    }])

    # Make prediction
    prediction_class = model.predict(input_data)[0]
    prediction_prob = model.predict_proba(input_data)[0]
    
    # The probability of the positive class (class 1 -> High Risk)
    high_risk_prob = float(prediction_prob[1])
    is_high_risk = prediction_class == 1

    # Extract Feature Importances (Explainable AI)
    importances = model.feature_importances_
    # Create a dictionary of feature -> percentage contribution
    feature_contributions = {
        name: round(float(imp) * 100, 1) 
        for name, imp in zip(feature_names, importances)
    }
    
    # Generate rule-based recommendations
    recommendations = generate_recommendations(data, is_high_risk)

    # Result mapping
    result = "High Risk" if is_high_risk else "Low Risk"

    return {
        "prediction": result,
        "probability": round(high_risk_prob * 100, 2),
        "recommendations": recommendations,
        "feature_contributions": feature_contributions
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Health Risk Prediction API"}
