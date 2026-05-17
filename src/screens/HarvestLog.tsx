import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ListFilter, Edit2, Trash2, Award, ArrowUpRight, Plus, Bell, Calendar } from 'lucide-react';
import { Card, Input } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function HarvestLog() {
  const navigate = useNavigate();

  const harvests = [
    { date: 'Oct 24, 2023', location: 'North Orchard', qty: '45.0', type: 'Wildflower', typeColor: 'bg-brand-primary/10 text-brand-primary' },
    { date: 'Oct 18, 2023', location: 'Hillside Valley', qty: '32.4', type: 'Clover', typeColor: 'bg-brand-secondary-container text-brand-on-secondary-container' },
    { date: 'Oct 12, 2023', location: 'River Basin', qty: '58.2', type: 'Manuka', typeColor: 'bg-brand-tertiary-container/10 text-brand-tertiary' },
    { date: 'Sep 29, 2023', location: 'West Ridge', qty: '19.0', type: 'Wildflower', typeColor: 'bg-brand-primary/10 text-brand-primary' },
  ];

  return (
    <div className="bg-brand-surface min-h-screen pb-24 text-brand-on-surface">
      <header className="bg-brand-surface-lowest shadow-sm sticky top-0 z-40 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-primary/20">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACGfc35wCA2L8OIuAE5Oogj1BW6vCZYvdq10ZZg6V2I6x2zBR3GcPh9v3ugzZdBBI8ydcxmtQfFts2hu9ftUftSM31AKZihCL_Tf1e1r8CRiMwsA5E1PrG6gbJf_h2imxLCDpLoYSHCykofQKyOqZ0qGmwUWPkGeZ8JtivevPGK2HUOqJ3p5_3wyW1EluwpZEBppb7VKSwGPm8V4okbg1V3TenqOTLW4czmpiblXzfgWup8H5I6BxifMmRQYhrC3YUssYl5rDR6x6T"
              />
            </div>
            <h1 className="text-xl font-bold text-brand-primary">Apiary Dashboard</h1>
          </div>
          <button className="p-2 rounded-full text-brand-primary">
            <Bell size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input 
              placeholder="Search harvest records..." 
              icon={<Search size={20} className="text-brand-on-surface-variant/60" />}
              className="shadow-sm"
            />
            <button className="flex items-center gap-2 px-5 py-3 bg-brand-surface-highest text-brand-on-surface-variant rounded-xl font-bold text-sm hover:bg-brand-surface-high transition-all active:scale-95 w-full md:w-auto justify-center">
              <ListFilter size={18} />
              Sort
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button className="px-6 py-2 rounded-full bg-brand-primary text-brand-on-primary font-bold text-sm shadow-sm transition-all active:scale-95">All</button>
            <button className="px-6 py-2 rounded-full bg-brand-secondary-container text-brand-on-secondary-container font-bold text-sm hover:bg-brand-secondary-container/80 transition-all active:scale-95">This Month</button>
            <button className="px-6 py-2 rounded-full bg-brand-secondary-container text-brand-on-secondary-container font-bold text-sm hover:bg-brand-secondary-container/80 transition-all active:scale-95">This Week</button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-secondary">Recent Harvests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {harvests.map((h, i) => (
              <Card key={i} className="p-5 hover:scale-[1.01] transition-transform duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-widest">{h.date}</span>
                    <span className="text-lg font-bold text-brand-primary mt-0.5">{h.location}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${h.typeColor}`}>
                    {h.type}
                  </span>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-brand-secondary">{h.qty}</span>
                    <span className="text-xs font-semibold text-brand-outline">kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-brand-on-surface-variant hover:bg-brand-surface-high rounded-full transition-colors active:scale-90">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-90">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-brand-secondary-container/20 p-6 rounded-3xl border border-brand-secondary/10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-brand-on-secondary-container mb-2">Seasonal Yield Trend</h3>
              <p className="text-base text-brand-on-surface-variant max-w-md">Your production is up by 12% compared to the same period last year. Keep up the great work!</p>
            </div>
            <div className="mt-8 flex items-end gap-2 h-32 px-2">
              {[40, 65, 55, 90, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-brand-secondary rounded-t-xl" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          
          <div className="bg-brand-primary-container text-brand-on-primary rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <Award size={48} className="text-white absolute -top-2 -right-2 transform -rotate-12 opacity-20 group-hover:scale-110 transition-transform" />
            <Award size={48} className="text-white mb-6" strokeWidth={1.5} />
            <div>
              <span className="text-xs font-bold uppercase opacity-80 tracking-widest">Total Honey 2023</span>
              <h3 className="text-3xl font-bold mt-1">1,248.5 kg</h3>
            </div>
            <button className="mt-8 py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
              View Full Analytics
              <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <Navbar />

      <button onClick={() => navigate('/add-harvest')} className="fixed bottom-24 right-6 w-14 h-14 bg-brand-primary text-brand-on-primary rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-all z-50 group">
        <Plus size={32} />
      </button>
    </div>
  );
}
