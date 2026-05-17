import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col pb-32">
      <header className="h-16 flex items-center px-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-brand-surface-low transition-all">
          <ArrowLeft size={24} className="text-brand-primary" />
        </button>
        <h1 className="ml-4 text-xl font-bold text-brand-primary">Error</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm aspect-square relative mb-12">
           <div className="absolute inset-0 bg-brand-primary/5 rounded-[4rem] blur-3xl" />
           <div className="relative w-full h-full rounded-[3rem] overflow-hidden bg-brand-surface-normal border border-brand-surface-high flex items-center justify-center p-8">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9y_n7D-7T6Z6R0-6D9y8R5-5f5f-5f5f-5f5f-5f5f-5f5f-5f5f-5f5f" 
                alt="404 Illustration" 
                className="w-full h-full object-contain mix-blend-multiply opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA-JSrEq8X-LjnzTMfDKG67kjgVmauHySo-mPJlx1EVUBwbQOycSgeo2JhOtxmj_9XqWLJY_0sel868gdr6ISH3kYSIoLf0yM8YnlV9yMeyNxeIDM2Rg7d_m1kdsgO5bX-ivTQaYPIWKdwd5r2JuvVCBTRB03JytUMpSYwDAGAgU3AX43fQ4G4HfGFwkDhz68V-zF2h6B0PRulaXryKsW_32zlyE4ckGaolMDe9VIN_kqZdgA-xho7mpDDhjmEIpzAvOt-uhjPWll2A";
                }}
              />
              {/* Fallback AI generated feel image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                 <div className="grid grid-cols-2 gap-4 w-full h-full opacity-20">
                    <div className="bg-brand-primary rounded-full blur-xl" />
                    <div className="bg-brand-secondary rounded-full blur-2xl translate-y-8" />
                 </div>
              </div>
           </div>
           <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
              <span className="text-[180px] font-black text-brand-primary/10 tracking-tighter select-none">404</span>
           </div>
        </div>

        <h2 className="text-5xl font-black text-brand-on-surface-variant/20 mb-4 select-none">404</h2>
        <h3 className="text-4xl font-bold text-brand-on-secondary-container mb-4">Oops! This page is missing.</h3>
        <p className="text-lg font-medium text-brand-on-surface-variant/80 max-w-xs leading-relaxed mb-12">
          It looks like the hive you're looking for doesn't exist.
        </p>

        <div className="w-full max-w-md flex flex-col gap-4">
          <Button size="xl" className="w-full h-14 bg-brand-primary shadow-xl" onClick={() => navigate('/dashboard')}>
            <Home size={20} fill="currentColor" fillOpacity={0.2} />
            Back to Home
          </Button>
          <Button variant="outline" size="xl" className="w-full h-14 border-2 border-brand-secondary text-brand-secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={20} />
            Retry
          </Button>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
