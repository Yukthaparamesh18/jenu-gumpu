import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCcw, CloudOff, Info, Menu } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function NoConnection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col pb-32">
      <header className="bg-brand-surface h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
           <div className="flex items-center gap-4">
              <Menu className="text-brand-primary cursor-pointer" />
              <h1 className="text-xl font-bold text-brand-primary">Jenu-Gumpu</h1>
           </div>
           <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-outline-variant/30 shadow-sm transition-transform hover:scale-105">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxpPeKO-E_itI7o4XDPossvbpc1NALcm17VWRbtobboyX711cNmPxPU-2gPMGdXZfpK7Wa-LRHzNvBrDHWhrEqRR8z0IZ9ukI1j3LDxe5_tte18TnvjsrqOi9tYCBrzOioJtcAA0B6IT6jI9M_Zh-cgGwM1cNWlCaStuMvqH1dg6UXYkG4Qf_IhXFlYy0B8PKolXBI_QkBUEjIT_9S_OxZ3cVRTMqR-QmzkkPH-eQIZmx1VDqbS-Vfbofrm5qW55INh2yP_-YkTvP"
              />
           </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
           <div className="w-32 h-32 bg-brand-surface-lowest rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(141,75,0,0.1)] relative">
              <WifiOff size={56} className="text-brand-primary" strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 w-10 h-10 bg-brand-secondary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                 <CloudOff size={18} />
              </div>
           </div>
           <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-[60px] -z-10" />
        </div>

        <h2 className="text-4xl font-bold text-brand-on-surface mb-4">No Connection</h2>
        <p className="text-lg font-medium text-brand-on-surface-variant/80 max-w-xs leading-relaxed mb-12">
          We can't reach the hive right now. Please check your internet connection.
        </p>

        <div className="w-full max-w-md flex flex-col gap-4">
          <Button size="xl" className="w-full h-14 bg-brand-primary shadow-xl" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button variant="outline" size="xl" className="w-full h-14 border-2 border-brand-secondary text-brand-secondary font-bold" onClick={() => navigate('/offline')}>
            Go Offline
          </Button>
        </div>

        <div className="mt-16 flex items-center gap-3 opacity-40">
           <Info size={16} />
           <p className="text-xs font-bold uppercase tracking-widest">Offline data will sync when you return</p>
        </div>
      </main>

      <Navbar />
      
      {/* Dynamic ambient gradient mask */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-brand-primary/5 via-transparent to-brand-secondary/5 -z-10" />
    </div>
  );
}
