import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, TrendingUp, DollarSign, Package, ClipboardCheck, Plus, ChevronRight, Info, ExternalLink, Calendar } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();

  const milestones = [
    { label: 'Total Honey Stock', value: '450 kg', change: '+12%', icon: Package, color: 'text-brand-primary', borderColor: 'border-brand-primary' },
    { label: 'Total Earnings', value: '₹85,000', change: 'Payout on track', icon: DollarSign, color: 'text-brand-secondary', borderColor: 'border-brand-secondary' },
    { label: 'Active Batches', value: '12 Batches', change: '75% complete', icon: TrendingUp, color: 'text-brand-tertiary-container', borderColor: 'border-brand-tertiary-container' },
  ];

  const harvests = [
    { date: 'Oct 24', batch: '#A12', source: 'Multifloral Source', qty: '50kg', grade: 'Grade A', gradeColor: 'secondary' },
    { date: 'Oct 22', batch: '#A11', source: 'Wild Forest Source', qty: '35kg', grade: 'Grade A+', gradeColor: 'secondary' },
    { date: 'Oct 19', batch: '#B04', source: 'Sunflower Source', qty: '120kg', grade: 'Grade B', gradeColor: 'outline' },
    { date: 'Oct 15', batch: '#A10', source: 'Acacia Source', qty: '42kg', grade: 'Grade A', gradeColor: 'secondary' },
    { date: 'Oct 10', batch: '#C02', source: 'Mixed Flora', qty: '15kg', grade: 'Filtered', gradeColor: 'primary' },
  ];

  return (
    <div className="bg-brand-surface min-h-screen pb-32">
      <header className="bg-brand-surface-lowest shadow-sm sticky top-0 z-50 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary-container/30">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyNMoD0I4Dz0pVr7yenTTuz4WvnwZoXBNJAsKxEJ2fwADX8yMWrl5wpuWawzlgt9DIR9fyG50ywXkmfbWEs0Yj0va2EEzDN12LyG4rFU_oLj5Btb_ZHv30-UezYq0wDj6INMk2VhubBoyuSIrJVBkiXhZyCPDDc3tgwNSe_RYr2R_PjZaMu6kWn9U13aoYd0yktIugth6p-yG80ddgnRPs5_f_beernw1TJ4SWqIKbxEAc_Buz0BOFc8VVw4D7yK1O4x_L6TccRbBK"
              />
            </div>
            <h1 className="text-xl font-bold text-brand-primary">Apiary Dashboard</h1>
          </div>
          <button className="p-2 rounded-full text-brand-primary hover:bg-brand-surface-low transition-all">
            <Bell size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.map((m, i) => (
            <Card key={i} className={`p-5 flex flex-col justify-between border-l-4 ${m.borderColor}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-brand-on-surface-variant">{m.label}</span>
                <m.icon className={m.color} size={20} />
              </div>
              <div>
                <span className="text-3xl font-bold text-brand-on-surface">{m.value}</span>
                <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${m.label === 'Active Batches' ? 'text-brand-on-surface-variant' : 'text-brand-secondary'}`}>
                  {m.change}
                </p>
              </div>
            </Card>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-secondary mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/add-harvest')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary text-brand-on-primary flex items-center justify-center shadow-lg group-hover:brightness-110 active:scale-95 transition-all">
                <Plus size={28} />
              </div>
              <span className="text-sm font-semibold">Add Harvest</span>
            </button>
            <button onClick={() => navigate('/harvest-log')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-brand-outline-variant text-brand-primary flex items-center justify-center shadow-sm group-hover:bg-brand-surface-high active:scale-95 transition-all">
                <Package size={28} />
              </div>
              <span className="text-sm font-semibold">View Stock</span>
            </button>
            <button onClick={() => navigate('/grading')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-brand-outline-variant text-brand-primary flex items-center justify-center shadow-sm group-hover:bg-brand-surface-high active:scale-95 transition-all">
                <ClipboardCheck size={28} />
              </div>
              <span className="text-sm font-semibold">Grade Honey</span>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-brand-secondary">Recent Harvests</h2>
            <button onClick={() => navigate('/harvest-log')} className="text-sm font-bold text-brand-primary hover:underline underline-offset-4">View All</button>
          </div>
          <Card className="overflow-hidden">
            <div className="divide-y divide-brand-surface-high">
              {harvests.map((h, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-brand-surface-low transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-tertiary-container/10 flex items-center justify-center text-brand-tertiary">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{h.date}, Batch {h.batch}</h3>
                      <p className="text-xs font-semibold text-brand-on-surface-variant">{h.source}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-sm font-bold text-brand-primary block">{h.qty}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all ${
                        h.gradeColor === 'secondary' ? 'bg-brand-secondary-container text-brand-on-secondary-container' : 
                        h.gradeColor === 'primary' ? 'bg-brand-primary-container/20 text-brand-primary' : 
                        'bg-brand-surface-high text-brand-on-surface-variant'
                      }`}>
                        {h.grade}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-brand-secondary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="bg-brand-secondary-container/30 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center border border-brand-secondary/10 shadow-sm">
          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-md">
            <img 
              alt="Honey Tip" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZOUy0QDm-mrLaSNkfat9fTOU0lhhojyD5lV_JVV58_ff5w0b0oY_WfUbBUpmvoRQe6dPVMpShlZlcu5cCJi_-clFx89et9-62Ln0giXscOGoJ2QCS7LdUHtXwCbvc61R4EHdRnt6eyEIsTj3M9TAnEko2WxDTVqFEMfCA7l7SajiAR_z1H7EnjGbmcOm9224iAEBmRJAALVcjHdA6M-T-zMENInmbB7MdQx-YC0enbfgiAashcgBX06x8d6xQFD6kmJP-I0XZcyfm"
            />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-brand-on-secondary-container">Yield Optimization Tip</h3>
            <p className="text-base text-brand-on-secondary-container/90 leading-relaxed">
              Based on recent weather patterns in your region, we recommend checking the moisture content of Batch #A12 before final bottling to ensure Grade A stability.
            </p>
            <Button variant="tertiary" className="rounded-full px-6">Read Moisture Guide</Button>
          </div>
        </section>
      </main>

      <Navbar />

      <button className="fixed bottom-24 right-6 w-14 h-14 bg-brand-primary text-brand-on-primary rounded-2xl shadow-xl flex items-center justify-center hover:brightness-110 active:scale-90 transition-all z-40 md:hidden">
        <Plus size={32} />
      </button>
    </div>
  );
}
