import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Camera, ArrowRight, Verified, Save, RefreshCcw, Info, ChevronRight } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function HoneyGrading() {
  const navigate = useNavigate();

  const swatches = [
    { name: 'Extra White', color: '#FCF3CF' },
    { name: 'White', color: '#F9E79F' },
    { name: 'Extra Light', color: '#F4D03F', active: true },
    { name: 'Light Amber', color: '#D4AC0D' },
    { name: 'Amber', color: '#B7950B' },
    { name: 'Dark Amber', color: '#7E5109' },
  ];

  return (
    <div className="bg-brand-surface min-h-screen pb-32 text-brand-on-surface">
      <header className="bg-brand-surface-lowest shadow-sm sticky top-0 z-50 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary-container/30">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyNMoD0I4Dz0pVr7yenTTuz4WvnwZoXBNJAsKxEJ2fwADX8yMWrl5wpuWawzlgt9DIR9fyG50ywXkmfbWEs0Yj0va2EEzDN12LyG4rFU_oLj5Btb_ZHv30-UezYq0wDj6INMk2VhubBoyuSIrJVBkiXhZyCPDDc3tgwNSe_RYr2R_PjZaMu6kWn9U13aoYd0yktIugth6p-yG80ddgnRPs5_f_beernw1TJ4SWqIKbxEAc_Buz0BOFc8VVw4D7yK1O4x_L6TccRbBK"
              />
            </div>
            <h1 className="text-xl font-bold text-brand-primary">Honey Grading</h1>
          </div>
          <button className="p-2 rounded-full text-brand-primary hover:bg-brand-surface-low transition-all">
            <Bell size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-brand-secondary mb-2">Quality Standards</h2>
              <p className="text-base text-brand-on-surface-variant leading-relaxed">
                Check your honey color against these samples to determine the Pfund scale classification. High accuracy ensures better market valuation.
              </p>
            </Card>

            <button className="w-full bg-brand-secondary-container p-6 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-white p-3 rounded-full text-brand-on-secondary-container shadow-sm group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-on-secondary-container">AI Color Matching</p>
                  <p className="text-base text-brand-on-secondary-container opacity-80">Compare with Photo</p>
                </div>
              </div>
              <ArrowRight size={24} className="text-brand-on-secondary-container group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

          <Card className="lg:col-span-5 p-8 border-2 border-brand-primary/20 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/10" />
            <p className="text-[10px] font-bold text-brand-outline uppercase tracking-widest">Current Assessment</p>
            <div className="text-[80px] font-black text-brand-primary leading-none tracking-tighter">A+</div>
            <div className="bg-brand-secondary text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Premium Export Grade</div>
            <p className="text-sm border-t border-brand-surface-high w-full pt-4 mt-2 text-brand-on-surface-variant font-medium">Updated 2 minutes ago</p>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-brand-secondary">Color Grade Scale</h3>
            <span className="text-xs font-bold text-brand-outline uppercase tracking-widest opacity-60">Pfund Scale (mm)</span>
          </div>
          <div className="bg-brand-surface-low p-6 rounded-3xl">
            <div className="flex justify-between gap-4 overflow-x-auto no-scrollbar pb-2">
              {swatches.map((s, i) => (
                <div key={i} className={`flex-shrink-0 flex flex-col items-center gap-4 transition-all ${s.active ? 'scale-110' : 'opacity-60'}`}>
                  <div 
                    className={`w-16 h-24 rounded-full shadow-lg border-2 border-white transition-all ${s.active ? 'ring-4 ring-brand-primary ring-offset-4 ring-offset-brand-surface-low' : ''}`}
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${s.active ? 'text-brand-primary' : 'text-brand-on-surface-variant'}`}>
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-brand-secondary">Moisture Content Guide</h3>
          <Card className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand-on-surface uppercase tracking-widest opacity-60">Measured Content</span>
                <span className="text-3xl font-black text-brand-secondary">16.2%</span>
              </div>
              
              <div className="relative h-4 w-full bg-brand-surface-high rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-[14%] bg-red-500 opacity-20" />
                <div className="absolute left-[14%] top-0 h-full w-[4%] bg-brand-secondary" />
                <div 
                  className="absolute left-[16.2%] top-0 h-full w-1.5 bg-brand-on-surface rounded-full z-10 shadow-[0_0_8px_rgba(0,0,0,0.3)]" 
                />
              </div>
              
              <div className="flex justify-between text-[10px] font-bold text-brand-outline uppercase tracking-widest px-1">
                <span>12%</span>
                <span className="text-brand-secondary">14-18% (Ideal)</span>
                <span>22%+</span>
              </div>
              
              <div className="bg-brand-surface-low p-5 rounded-2xl flex items-start gap-4 border-l-4 border-brand-secondary">
                <div className="bg-brand-secondary/10 p-2 rounded-lg">
                  <Verified size={24} className="text-brand-secondary" />
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  Your moisture level is within the <span className="font-bold text-brand-secondary">Premium Export Range</span>, ensuring long shelf life and no fermentation.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <div className="pt-4 flex flex-col gap-4">
          <Button size="xl" className="w-full h-14 bg-brand-primary shadow-xl">
            <Save size={20} fill="currentColor" />
            Save Grade to Batch #882
          </Button>
          <button className="w-full py-4 text-brand-on-surface-variant font-bold text-sm rounded-2xl border border-brand-outline-variant hover:bg-brand-surface-low transition-all active:scale-95 flex items-center justify-center gap-2">
            <RefreshCcw size={18} />
            Recalibrate Sensors
          </button>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
