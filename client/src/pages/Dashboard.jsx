import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { History, TrendingUp, AlertCircle, Clock, ArrowUpRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to fetch history');

        const formattedData = data.map(item => ({
          ...item,
          id: item._id,
          date: new Date(item.timestamp).toLocaleDateString()
        }));
        setHistory(formattedData);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user.id]);

  const chartData = [...history].reverse();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name?.split(' ')[0] || 'Health Hero'}</h1>
          <p className="text-slate-500">Track your health metrics and risk trends.</p>
        </div>
        <Link to="/predict" className="btn-gradient">
          New Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 glass p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Risk Score Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="riskScore" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data points available yet.
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-primary-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />)
            ) : history.length > 0 ? (
              history.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/results/${item.id}`}
                  state={{ result: item, formData: item }}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.riskLevel === 'Low' ? 'bg-green-100 text-green-600' :
                      item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.riskLevel} Risk</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.date}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              ))
            ) : (
              <p className="text-center text-slate-500 py-10">Start your first assessment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
