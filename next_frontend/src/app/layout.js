import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'AI Health Risk Prediction System',
  description: 'Predict heart disease risk using a trained Machine Learning model.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
