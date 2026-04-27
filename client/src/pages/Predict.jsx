import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Thermometer, Droplets, Cigarette, Dumbbell, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 'basic', title: 'Basic Info', icon: Thermometer },
  { id: 'vitals', title: 'Vitals', icon: Activity },
  { id: 'lifestyle', title: 'Lifestyle', icon: Cigarette },
];

const Predict = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    systolicBP: '',
    diastolicBP: '',
    cholesterol: '',
    sugarLevel: '',
    smoking: '',
    exercise: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateBMI = () => {
    if (!formData.weight || !formData.height) return '0.0';
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, bmi: calculateBMI() }),
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Failed to generate prediction');

      navigate(`/results/${result.id}`, { state: { result, formData } });
    } catch (err) {
      console.error("Error submitting prediction:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Health Assessment</h1>
        <p className="text-slate-500">Provide your details for a personalized risk analysis.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              idx <= currentStep ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              <step.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold mt-2 uppercase tracking-wider">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="glass p-8 md:p-12 rounded-[2.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Age (Years)</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 25" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 70" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g. 175" className="input-field" />
                </div>
                <div className="flex items-end pb-2">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-900/30 w-full">
                    <span className="text-sm text-slate-500 block">Calculated BMI</span>
                    <span className="text-2xl font-bold text-primary-600">{calculateBMI()}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Systolic Blood Pressure</label>
                  <input type="number" name="systolicBP" value={formData.systolicBP} onChange={handleInputChange} placeholder="e.g. 120" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Diastolic Blood Pressure</label>
                  <input type="number" name="diastolicBP" value={formData.diastolicBP} onChange={handleInputChange} placeholder="e.g. 80" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Cholesterol (mg/dL)</label>
                  <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleInputChange} placeholder="e.g. 180" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Sugar Level (mg/dL)</label>
                  <input type="number" name="sugarLevel" value={formData.sugarLevel} onChange={handleInputChange} placeholder="e.g. 90" className="input-field" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold block">Smoking History</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['never', 'occasional', 'regular'].map(option => (
                      <button
                        key={option}
                        onClick={() => setFormData(p => ({ ...p, smoking: option }))}
                        className={`py-3 px-4 rounded-xl border capitalize transition-all ${
                          formData.smoking === option 
                            ? 'bg-primary-500 text-white border-primary-500 shadow-lg' 
                            : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-semibold block">Exercise Frequency</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['low', 'moderate', 'high'].map(option => (
                      <button
                        key={option}
                        onClick={() => setFormData(p => ({ ...p, exercise: option }))}
                        className={`py-3 px-4 rounded-xl border capitalize transition-all ${
                          formData.exercise === option 
                            ? 'bg-primary-500 text-white border-primary-500 shadow-lg' 
                            : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 font-semibold ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-primary-600'}`}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.smoking || !formData.exercise}
              className={`btn-gradient px-10 flex items-center gap-2 ${(loading || !formData.smoking || !formData.exercise) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Generate Analysis'}
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 0 && (!formData.age || !formData.weight || !formData.height)) ||
                (currentStep === 1 && (!formData.systolicBP || !formData.diastolicBP || !formData.cholesterol || !formData.sugarLevel))
              }
              className={`btn-gradient px-10 flex items-center gap-2 ${
                ((currentStep === 0 && (!formData.age || !formData.weight || !formData.height)) ||
                (currentStep === 1 && (!formData.systolicBP || !formData.diastolicBP || !formData.cholesterol || !formData.sugarLevel))) 
                ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(226, 232, 240, 1);
          outline: none;
          transition: all 0.3s;
        }
        .dark .input-field {
          background: rgba(15, 23, 42, 0.5);
          border-color: rgba(30, 41, 59, 1);
          color: white;
        }
        .input-field:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Predict;
