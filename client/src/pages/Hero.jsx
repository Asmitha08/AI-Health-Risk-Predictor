import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Activity, BarChart3, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-32">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase mb-4 border border-primary-100 dark:border-primary-800">
              Future of Healthcare
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              AI-Powered <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600">
                Health Risk Assessment
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Get personalized health insights and risk scores in seconds using our advanced rule-based AI engine. Proactive care starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/predict" className="btn-gradient flex items-center gap-2 group w-full sm:w-auto">
                Start Free Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all w-full sm:w-auto">
                View Sample Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Shield, title: 'Secure Data', desc: 'Your health data is encrypted and stored securely in Firebase Firestore.' },
              { icon: Activity, title: 'Real-time Logic', desc: 'Instant risk assessment based on multiple clinical health markers.' },
              { icon: BarChart3, title: 'Smart Analytics', desc: 'Track your health trends over time with interactive visualization tools.' }
            ].map((feature, i) => (
              <div key={i} className="glass p-8 rounded-3xl text-left hover:border-primary-500/50 transition-colors group">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
