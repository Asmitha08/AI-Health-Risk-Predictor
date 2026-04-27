import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Share2, CheckCircle2, AlertTriangle, Info, Lightbulb } from 'lucide-react';

const Results = () => {
  const { state } = useLocation();
  const { id } = useParams();
  
  // Use state from navigation or mock data if direct access
  const result = state?.result || {
    riskScore: 25,
    riskLevel: 'Medium',
    factors: ['Age (45+)', 'Borderline BMI', 'Sedentary Lifestyle'],
    suggestions: [
      'Increase physical activity to 30 mins/day',
      'Reduce sodium intake to lower BP',
      'Schedule a follow-up with your physician'
    ]
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Low': return 'from-green-500 to-emerald-600';
      case 'Medium': return 'from-yellow-500 to-orange-600';
      case 'High': return 'from-red-500 to-rose-600';
      default: return 'from-primary-500 to-blue-600';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 glass p-10 rounded-[3rem] text-center flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getRiskColor(result.riskLevel)}`} />
          
          <h2 className="text-xl font-bold text-slate-500 mb-8 uppercase tracking-widest">Risk Assessment</h2>
          
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={553} 
                strokeDashoffset={553 - (553 * result.riskScore) / 100}
                className={`transition-all duration-1000 ease-out text-primary-500`}
                style={{ color: result.riskLevel === 'High' ? '#ef4444' : result.riskLevel === 'Medium' ? '#f59e0b' : '#10b981' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">{result.riskScore}%</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Probability</span>
            </div>
          </div>

          <div className={`px-6 py-2 rounded-full font-bold text-white shadow-lg bg-gradient-to-r ${getRiskColor(result.riskLevel)}`}>
            {result.riskLevel} Risk
          </div>
        </motion.div>

        {/* Details & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[2.5rem]"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-500" />
              Key Contributing Factors
            </h3>
            <div className="flex flex-wrap gap-3">
              {result.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  {factor}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[2.5rem]"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Personalized Suggestions
            </h3>
            <ul className="space-y-4">
              {result.suggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{sug}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex gap-4">
            <button className="flex-1 btn-gradient flex items-center justify-center gap-2" onClick={() => window.print()}>
              <Download className="w-5 h-5" /> Download PDF Report
            </button>
            <button className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
