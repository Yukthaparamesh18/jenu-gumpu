import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, MessageSquare, ShieldAlert, BookOpen, Users } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function Error500() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col pb-32">
      <header className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-brand-surface-low transition-all">
            <ArrowLeft size={24} className="text-brand-primary" />
          </button>
          <h1 className="ml-4 text-xl font-bold text-brand-primary">Error</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-outline-variant/30">
          <img 
            alt="Profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxpPeKO-E_itI7o4XDPossvbpc1NALcm17VWRbtobboyX711cNmPxPU-2gPMGdXZfpK7Wa-LRHzNvBrDHWhrEqRR8z0IZ9ukI1j3LDxe5_tte18TnvjsrqOi9tYCBrzOioJtcAA0B6IT6jI9M_Zh-cgGwM1cNWlCaStuMvqH1dg6UXYkG4Qf_IhXFlYy0B8PKolXBI_QkBUEjIT_9S_OxZ3cVRTMqR-QmzkkPH-eQIZmx1VDqbS-Vfbofrm5qW55INh2yP_-YkTvP"
          />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm aspect-square relative mb-8">
           <div className="absolute inset-0 bg-brand-on-background/5 rounded-[4rem] blur-3xl opacity-20" />
           {/* Large background number */}
           <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
              <span className="text-[200px] font-black tracking-tighter">500</span>
           </div>
           
           <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 bg-white rounded-3xl shadow-2xl p-4 rotate-3 transform hover:rotate-0 transition-all duration-500 overflow-hidden group">
                 <img 
                  alt="System Error Bee" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-JSrEq8X-LjnzTMfDKG67kjgVmauHySo-mPJlx1EVUBwbQOycSgeo2JhOtxmj_9XqWLJY_0sel868gdr6ISH3kYSIoLf0yM8YnlV9yMeyNxeIDM2Rg7d_m1kdsgO5bX-ivTQaYPIWKdwd5r2JuvVCBTRB03JytUMpSYwDAGAgU3AX43fQ4G4HfGFwkDhz68V-zF2h6B0PRulaXryKsW_32zlyE4ckGaolMDe9VIN_kqZdgA-xho7mpDDhjmEIpzAvOt-uhjPWll2A"
                />
                <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
              </div>
           </div>
        </div>

        <h2 className="text-3xl font-bold text-brand-primary mb-4">Something went wrong</h2>
        <p className="text-lg font-medium text-brand-on-surface-variant/80 max-w-xs leading-relaxed mb-12">
          Our bees are working hard to fix a technical issue on our end. Please try again in a moment.
        </p>

        <div className="w-full max-w-md flex flex-col gap-4 mb-12">
          <Button size="xl" className="w-full h-14 bg-brand-primary shadow-xl" onClick={() => window.location.reload()}>
            <RefreshCw size={20} className="mr-1" />
            Retry
          </Button>
          <Button variant="outline" size="xl" className="w-full h-14 border-2 border-brand-secondary text-brand-secondary font-bold gap-2">
            <MessageSquare size={20} />
            Contact Support
          </Button>
        </div>

        <div className="w-full max-w-md space-y-4">
           <Card className="p-4 flex items-center gap-4 hover:bg-brand-surface-low transition-colors cursor-pointer group">
              <div className="bg-brand-secondary-container p-2 rounded-xl text-brand-on-secondary-container group-hover:scale-110 transition-transform">
                 <ShieldAlert size={20} />
              </div>
              <div className="text-left">
                 <p className="text-sm font-bold text-brand-on-surface">System Status</p>
                 <p className="text-xs font-semibold text-brand-on-surface-variant opacity-60">Check current uptime</p>
              </div>
           </Card>
           
           <Card className="p-4 flex items-center gap-4 hover:bg-brand-surface-low transition-colors cursor-pointer group">
              <div className="bg-brand-tertiary-container/20 p-2 rounded-xl text-brand-on-tertiary-fixed-variant group-hover:scale-110 transition-transform">
                 <Users size={20} />
              </div>
              <div className="text-left">
                 <p className="text-sm font-bold text-brand-on-surface">Community Help</p>
                 <p className="text-xs font-semibold text-brand-on-surface-variant opacity-60">Visit our forum</p>
              </div>
           </Card>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
