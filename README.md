# ❤️ AI Health Risk Predictor

A modern **full-stack AI-powered web application** that predicts a user's **cardiovascular risk level** based on clinical health parameters.  
It combines **Machine Learning**, **FastAPI**, and **Next.js** to deliver real-time predictions with explainable insights and actionable recommendations.

---

## 🚀 Project Overview

The **AI Health Risk Predictor** helps users assess their heart disease risk using a trained Machine Learning model based on real-world medical data.

It provides:

✅ Risk Prediction (High / Low Risk)  
✅ Confidence Probability Score  
✅ Explainable AI Feature Contributions  
✅ Personalized Health Recommendations  
✅ Interactive Analytics Dashboard  

---

## 🧠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React.js**
- **Tailwind CSS**
- **Chart.js**
- **Lucide React Icons**

### Backend
- **FastAPI**
- **Uvicorn**
- **Pydantic**

### Machine Learning
- **Scikit-learn**
- **Random Forest Classifier**
- **Pickle (.pkl model)**

---

## 📊 Machine Learning Model

### Dataset Used
UCI Cleveland Heart Disease Dataset

### Algorithm
Random Forest Classifier

### Input Features (7 Parameters)

- Age
- Sex
- Chest Pain Type (`cp`)
- Resting Blood Pressure (`trestbps`)
- Serum Cholesterol (`chol`)
- Maximum Heart Rate (`thalach`)
- ST Depression (`oldpeak`)

### Output

- **High Risk**
- **Low Risk**
- Probability Score (%)

---

## ⚙️ Backend Features (FastAPI)

### `/predict` Endpoint

Accepts user health parameters and returns:

```json
{
  "prediction": "High Risk",
  "probability": 82.4,
  "feature_importance": {
    "Age": 20,
    "Cholesterol": 18
  },
  "recommendations": [
    "Reduce sodium intake",
    "Increase physical activity"
  ]
}
