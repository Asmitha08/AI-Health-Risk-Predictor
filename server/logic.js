/**
 * Pure AI Logic (Rule-based)
 * This logic mimics an ML model but is easily interpretable and fast.
 */

export const predictRisk = (data) => {
  let score = 0;
  const factors = [];
  const suggestions = [];

  // Age factor
  if (data.age > 50) {
    score += 20;
    factors.push('Age above 50');
  } else if (data.age > 40) {
    score += 10;
    factors.push('Age above 40');
  }

  // BMI factor
  const bmi = parseFloat(data.bmi);
  if (bmi > 30) {
    score += 25;
    factors.push('High BMI (Obese)');
    suggestions.push('Consult a nutritionist for a weight management plan.');
  } else if (bmi > 25) {
    score += 10;
    factors.push('Moderate BMI (Overweight)');
    suggestions.push('Incorporate 150 mins of moderate aerobic activity weekly.');
  } else {
    suggestions.push('Maintain your healthy weight through balanced diet.');
  }

  // Blood Pressure
  const sys = parseInt(data.systolicBP);
  if (sys > 140) {
    score += 30;
    factors.push('High Systolic BP');
    suggestions.push('Monitor blood pressure daily and reduce salt intake.');
  } else if (sys > 130) {
    score += 15;
    factors.push('Elevated Systolic BP');
  }

  // Cholesterol
  const chol = parseInt(data.cholesterol);
  if (chol > 240) {
    score += 20;
    factors.push('High Cholesterol');
    suggestions.push('Adopt a heart-healthy diet low in saturated fats.');
  }

  // Smoking
  if (data.smoking === 'regular') {
    score += 30;
    factors.push('Regular Smoker');
    suggestions.push('Consider smoking cessation programs to drastically lower risk.');
  } else if (data.smoking === 'occasional') {
    score += 15;
    factors.push('Occasional Smoker');
  }

  // Exercise (Protective factor)
  if (data.exercise === 'high') {
    score -= 15;
  } else if (data.exercise === 'low') {
    score += 10;
    factors.push('Sedentary Lifestyle');
  }

  // Clamp score
  const finalScore = Math.min(Math.max(score, 5), 95);
  
  let level = 'Low';
  if (finalScore > 60) level = 'High';
  else if (finalScore > 30) level = 'Medium';

  if (factors.length === 0) factors.push('No significant risk factors detected');
  if (suggestions.length === 0) suggestions.push('Continue regular checkups and a healthy lifestyle.');

  return {
    riskScore: finalScore,
    riskLevel: level,
    factors: factors.slice(0, 4),
    suggestions: suggestions.slice(0, 3)
  };
};
