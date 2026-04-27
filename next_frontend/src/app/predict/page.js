"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Activity } from 'lucide-react';

export default function PredictionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    cp: '1',
    trestbps: '',
    chol: '',
    thalach: '',
    oldpeak: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        age: Number(formData.age),
        sex: Number(formData.sex),
        cp: Number(formData.cp),
        trestbps: Number(formData.trestbps),
        chol: Number(formData.chol),
        thalach: Number(formData.thalach),
        oldpeak: Number(formData.oldpeak)
      };

      // Send to the Next.js API route instead of directly to FastAPI
      const response = await axios.post('/api/predict', payload);
      
      // Store result in sessionStorage to pass to dashboard
      sessionStorage.setItem('predictionResult', JSON.stringify({
        result: response.data,
        inputData: formData
      }));

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      
      let errorMessage = 'Failed to connect to the prediction server. Please ensure the backend is running.';
      
      if (err.response?.data?.error) {
        const serverError = err.response.data.error;
        if (Array.isArray(serverError)) {
          // Format FastAPI validation array into a string
          errorMessage = serverError.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ');
        } else if (typeof serverError === 'string') {
          errorMessage = serverError;
        } else {
          errorMessage = JSON.stringify(serverError);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-8 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-rose-500 h-6 w-6" />
            <h2 className="text-2xl font-bold text-slate-900">Health Assessment</h2>
          </div>
          <p className="text-slate-600">Please enter your clinical parameters for an accurate risk prediction.</p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Form fields identical to before */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age (Years)</label>
                <input type="number" name="age" required min="1" max="120" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g., 45" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white">
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Chest Pain Type</label>
                <select name="cp" value={formData.cp} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white">
                  <option value="1">Typical Angina (1)</option>
                  <option value="2">Atypical Angina (2)</option>
                  <option value="3">Non-anginal Pain (3)</option>
                  <option value="4">Asymptomatic (4)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resting Blood Pressure (mm Hg)</label>
                <input type="number" name="trestbps" required value={formData.trestbps} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g., 120" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Serum Cholestoral (mg/dl)</label>
                <input type="number" name="chol" required value={formData.chol} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g., 200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Heart Rate</label>
                <input type="number" name="thalach" required value={formData.thalach} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g., 150" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ST Depression (Oldpeak)</label>
                <input type="number" step="0.1" name="oldpeak" required value={formData.oldpeak} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g., 1.5" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : 'Analyze Health Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
