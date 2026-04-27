import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <HeartPulse className="h-8 w-8 text-rose-500" />
              <span className="font-bold text-xl tracking-tight text-slate-900">CardioAI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Home</Link>
            <Link href="/predict" className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">Check Risk</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
