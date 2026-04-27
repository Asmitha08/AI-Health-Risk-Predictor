import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sun, Moon, LogOut, User } from 'lucide-react';

const Navbar = ({ user, logout, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary-500 rounded-lg group-hover:rotate-12 transition-transform">
            <Heart className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
            HealthAI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary-500 transition-colors">Dashboard</Link>
              <Link to="/predict" className="text-sm font-medium hover:text-primary-500 transition-colors">New Assessment</Link>
            </div>
          )}
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-gradient !py-2 !px-4 text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
