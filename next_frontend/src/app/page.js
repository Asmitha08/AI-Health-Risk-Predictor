import Link from 'next/link';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          AI Health Risk <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Prediction System</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Empowering your health decisions with advanced machine learning. Get an instant, accurate assessment of your heart disease risk based on clinical parameters.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/predict"
            className="px-8 py-4 text-lg font-semibold rounded-full text-white bg-rose-500 hover:bg-rose-600 shadow-lg hover:shadow-rose-500/30 transition-all transform hover:-translate-y-1"
          >
            Check Your Risk Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Results</h3>
              <p className="text-slate-600">Get immediate predictions powered by our optimized Random Forest classification model.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Clinical Accuracy</h3>
              <p className="text-slate-600">Trained on verified clinical datasets to provide reliable and statistically significant risk assessments.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-600">Your health data is processed in real-time and never stored on our servers without your permission.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
