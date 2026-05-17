import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudOff, RefreshCcw, MoreVertical, Tractor, Package, TrendingUp, Info } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function OfflineMode() {
  const navigate = useNavigate();

  const pendingRecords = [
    { title: 'Wildflower Batch #82', subtitle: 'Harvest Log • 14.5kg', icon: Tractor, color: 'bg-brand-primary/10 text-brand-primary' },
    { title: 'Hive Box #4 Update', subtitle: 'Maintenance • Stock Adj.', icon: Package, color: 'bg-brand-secondary-container text-brand-on-secondary-container' },
    { title: 'B2B Market Entry', subtitle: 'Price Log • Forest Honey', icon: TrendingUp, color: 'bg-brand-tertiary-container/10 text-brand-tertiary' },
    { title: 'Acacia Batch #21', subtitle: 'Harvest Log • 22.0kg', icon: Tractor, color: 'bg-brand-primary/10 text-brand-primary' },
  ];

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col pb-32">
      <header className="bg-brand-surface-lowest shadow-sm h-16 flex items-center px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 flex items-center justify-center">
               <div className="w-full h-full bg-brand-outline-variant/20 rounded-lg" />
             </div>
             <span className="text-xl font-bold text-brand-primary">Jenu-Gumpu</span>
          </div>
          <div className="flex items-center gap-4">
            <CloudOff size={24} className="text-brand-on-surface-variant/40" />
            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-outline-variant/30">
               <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxpPeKO-E_itI7o4XDPossvbpc1NALcm17VWRbtobboyX711cNmPxPU-2gPMGdXZfpK7Wa-LRHzNvBrDHWhrEqRR8z0IZ9ukI1j3LDxe5_tte18TnvjsrqOi9tYCBrzOioJtcAA0B6IT6jI9M_Zh-cgGwM1cNWlCaStuMvqH1dg6UXYkG4Qf_IhXFlYy0B8PKolXBI_QkBUEjIT_9S_OxZ3cVRTMqR-QmzkkPH-eQIZmx1VDqbS-Vfbofrm5qW55INh2yP_-YkTvP"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 space-y-8">
        <Card className="p-8 flex flex-col items-center text-center gap-4 bg-white border-2 border-brand-surface-high">
          <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center">
             <CloudOff size={40} className="text-brand-outline opacity-40" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-brand-on-surface">You're in offline mode</h2>
            <p className="text-sm font-semibold text-brand-on-surface-variant leading-relaxed px-4">
              Changes will sync automatically when your connection is restored.
            </p>
          </div>
          <div className="bg-brand-secondary-container px-6 py-2 rounded-full flex items-center gap-2 text-brand-on-secondary-container">
            <RefreshCcw size={16} className="animate-spin-slow" />
            <span className="text-sm font-bold uppercase tracking-wider">5 harvest logs pending sync</span>
          </div>
        </Card>

        <Button variant="outline" className="w-full h-14 rounded-full border-none shadow-sm bg-brand-surface-highest/40 text-brand-on-surface-variant font-bold">
           Wait for connection to sync
        </Button>
        <p className="text-center text-xs font-bold text-brand-on-surface-variant/40 italic">
          Last successful sync: Today, 08:42 AM
        </p>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-widest">Specific Records Waiting</h3>
            <span className="bg-brand-surface-high px-3 py-1 rounded-full text-[10px] font-bold text-brand-on-surface-variant">5 Items</span>
          </div>
          
          <div className="space-y-3">
            {pendingRecords.map((record, i) => (
              <Card key={i} className="p-4 flex items-center justify-between group hover:border-brand-primary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={record.color + " w-12 h-12 rounded-xl flex items-center justify-center"}>
                    <record.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-on-surface">{record.title}</h4>
                    <p className="text-xs font-semibold text-brand-on-surface-variant/70">{record.subtitle}</p>
                  </div>
                </div>
                <button className="p-2 text-brand-on-surface-variant/40 hover:text-brand-on-surface rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </Card>
            ))}
          </div>
        </section>

        <Card className="bg-brand-surface-low border-none shadow-none p-6 flex gap-4 mt-8">
          <div className="bg-brand-primary/10 p-2 rounded-full h-fit mt-1">
            <Info size={20} className="text-brand-primary" fill="currentColor" fillOpacity={0.1} />
          </div>
          <p className="text-sm font-medium text-brand-on-surface-variant/80 leading-relaxed">
            Your data is safely stored locally. In areas with poor connectivity, Jenu-Gumpu prioritizes local performance to ensure your work flow isn't interrupted.
          </p>
        </Card>
      </main>

      <Navbar />
    </div>
  );
}
