"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { AlertTriangle, CheckCircle, ArrowLeft, Lightbulb, Activity } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const router = useRouter();
  const [dataPayload, setDataPayload] = useState(null);

  useEffect(() => {
    // Next.js App Router doesn't natively pass complex state via router.push() 
    // without query params, so we use sessionStorage which is perfect for this.
    const stored = sessionStorage.getItem('predictionResult');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDataPayload(JSON.parse(stored));
    } else {
      router.push('/predict');
    }
  }, [router]);

  if (!dataPayload) return null;

  const { result, inputData } = dataPayload;
  const isHighRisk = result.prediction === 'High Risk';
  const probability = result.probability; 
  const recommendations = result.recommendations || [];
  const featureContributions = result.feature_contributions || {};

  const pieData = {
    labels: ['Risk Probability', 'Safe Margin'],
    datasets: [
      {
        data: [probability, 100 - probability],
        backgroundColor: isHighRisk ? ['rgba(244, 63, 94, 0.8)', 'rgba(226, 232, 240, 0.8)'] : ['rgba(16, 185, 129, 0.8)', 'rgba(226, 232, 240, 0.8)'],
        borderColor: isHighRisk ? ['rgba(244, 63, 94, 1)', 'rgba(226, 232, 240, 1)'] : ['rgba(16, 185, 129, 1)', 'rgba(226, 232, 240, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  // Feature Contributions Chart
  const featureLabels = Object.keys(featureContributions).map(label => {
    const mapping = {
      age: 'Age',
      sex: 'Sex',
      cp: 'Chest Pain',
      trestbps: 'Resting BP',
      chol: 'Cholesterol',
      thalach: 'Max HR',
      oldpeak: 'ST Depr.'
    };
    return mapping[label] || label;
  });
  
  const featureValues = Object.values(featureContributions);
  
  const barData = {
    labels: featureLabels,
    datasets: [
      {
        label: 'Contribution Impact (%)',
        data: featureValues,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Impact Percentage'
        }
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/predict" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> New Assessment
          </Link>
        </div>

        <div className={`rounded-2xl p-8 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 ${isHighRisk ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {isHighRisk ? <AlertTriangle className="h-10 w-10 text-rose-500" /> : <CheckCircle className="h-10 w-10 text-emerald-500" />}
              <h2 className="text-3xl font-bold text-slate-900">{isHighRisk ? 'Elevated Risk Detected' : 'Low Risk Indicated'}</h2>
            </div>
            <p className="text-lg text-slate-700">
              Based on the clinical parameters provided, our model calculates a <strong className="font-bold text-slate-900">{probability}% probability</strong> of cardiovascular risk.
            </p>
            {isHighRisk && <p className="mt-4 text-rose-700 text-sm font-medium">Recommendation: Please consult with a healthcare professional for a comprehensive evaluation.</p>}
          </div>
          <div className="w-48 h-48 flex-shrink-0">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Actionable Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-900">Health Recommendations</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-slate-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Feature Contributions (Explainable AI) */}
        {Object.keys(featureContributions).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">Key Risk Factors (AI Explanation)</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6">
                This chart shows which clinical parameters had the most significant impact on the AI model&apos;s prediction for your specific case.
              </p>
              <div className="h-64 w-full">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Patient Parameters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900">Patient Parameters Summary</h3>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">Age</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{inputData.age} years</dd></div>
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">Sex</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{inputData.sex === '1' ? 'Male' : 'Female'}</dd></div>
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">Chest Pain Type</dt><dd className="mt-1 text-xl font-semibold text-slate-900">Type {inputData.cp}</dd></div>
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">Resting Blood Pressure</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{inputData.trestbps} mmHg</dd></div>
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">Serum Cholestoral</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{inputData.chol} mg/dl</dd></div>
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">Maximum Heart Rate</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{inputData.thalach} bpm</dd></div>
              <div className="bg-slate-50 p-4 rounded-lg"><dt className="text-sm font-medium text-slate-500">ST Depression</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{inputData.oldpeak}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

