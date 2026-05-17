import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tractor, Package, TrendingUp, Download, Mail, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function Reports() {
  const navigate = useNavigate();

  const reports = [
    { title: 'Monthly Production Report', subtitle: 'Summary of harvest volumes and grading distribution across all hives.', tag: 'Monthly', icon: Tractor, color: 'bg-brand-secondary-container text-brand-on-secondary-container' },
    { title: 'Profit Summary Report', subtitle: 'Comprehensive financial overview of earnings vs. operational costs.', tag: 'Financial', icon: TrendingUp, color: 'bg-brand-tertiary-container/10 text-brand-tertiary' },
    { title: 'Stock Inventory Report (PDF)', subtitle: 'Detailed breakdown of current honey stock categorized by floral source and moisture metrics.', tag: 'PDF', icon: Package, color: 'bg-brand-primary/10 text-brand-primary', hasChevron: true },
  ];

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col pb-32">
      <header className="bg-brand-surface h-16 flex items-center px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-brand-surface-low transition-all">
              <ArrowLeft size={24} className="text-brand-primary" />
            </button>
            <h1 className="text-2xl font-bold text-brand-primary">Reports</h1>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-secondary-container">
             <img 
               alt="Profile" 
               className="w-full h-full object-cover" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxpPeKO-E_itI7o4XDPossvbpc1NALcm17VWRbtobboyX711cNmPxPU-2gPMGdXZfpK7Wa-LRHzNvBrDHWhrEqRR8z0IZ9ukI1j3LDxe5_tte18TnvjsrqOi9tYCBrzOioJtcAA0B6IT6jI9M_Zh-cgGwM1cNWlCaStuMvqH1dg6UXYkG4Qf_IhXFlYy0B8PKolXBI_QkBUEjIT_9S_OxZ3cVRTMqR-QmzkkPH-eQIZmx1VDqbS-Vfbofrm5qW55INh2yP_-YkTvP"
             />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 pt-6 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-secondary">Available Reports</h2>
          <div className="space-y-4">
            {reports.map((report, i) => (
              <Card key={i} className="p-6 relative group cursor-pointer hover:border-brand-primary/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className={report.color + " p-3 rounded-2xl"}>
                      <report.icon size={24} />
                   </div>
                   <span className="bg-brand-surface-low px-3 py-1 rounded-full text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-widest border border-brand-surface-high">
                    {report.tag}
                   </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-brand-on-surface">{report.title}</h3>
                  <p className="text-sm font-medium text-brand-on-surface-variant leading-relaxed opacity-70">
                    {report.subtitle}
                  </p>
                </div>
                {report.hasChevron && (
                  <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-on-surface-variant opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-bold text-brand-secondary">Recent Generation</h2>
            <span className="text-xs font-bold text-brand-outline opacity-40 uppercase tracking-widest">Generated 2h ago</span>
          </div>

          <Card className="p-1 border-dashed border-2 bg-brand-surface-low/30 border-brand-outline-variant/40 rounded-3xl overflow-hidden flex flex-col items-center">
            <div className="w-full bg-white p-8 rounded-2xl flex flex-col items-center shadow-inner">
               <div className="w-full max-w-[200px] aspect-[1/1.4] bg-brand-surface-lowest border border-brand-surface-high rounded-xl relative overflow-hidden flex flex-col p-4 shadow-sm">
                  <div className="w-1/2 h-2 bg-brand-surface-high rounded-full mb-2" />
                  <div className="w-3/4 h-1.5 bg-brand-surface-low rounded-full mb-1" />
                  <div className="w-3/4 h-1.5 bg-brand-surface-low rounded-full mb-1" />
                  <div className="w-full h-1.5 bg-brand-surface-low rounded-full mb-6" />
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto pb-4">
                     <div className="h-4 bg-brand-primary rounded-lg" />
                     <div className="h-4 bg-brand-secondary rounded-lg" />
                  </div>
                  <div className="w-1/3 h-1 bg-brand-outline-variant/40 rounded-full mx-auto" />
                  <div className="absolute top-4 right-4 w-6 h-6 bg-brand-secondary-container/40 rounded-full" />
               </div>
               <div className="mt-8 text-center space-y-1">
                  <p className="text-base font-bold text-brand-on-surface">Preview: September_Stock_Log.pdf</p>
                  <p className="text-xs font-bold text-brand-on-surface-variant opacity-60 uppercase tracking-widest">4.2 MB • A4 Portrait</p>
               </div>
            </div>
          </Card>
        </section>

        <div className="pt-4 flex flex-col gap-4">
           <Button size="xl" className="w-full h-14 bg-brand-primary shadow-xl">
             <Download size={20} fill="currentColor" fillOpacity={0.2} />
             Generate PDF Report
           </Button>
           <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 font-bold gap-3 border-2 border-brand-outline-variant/40">
                <Mail size={18} />
                Email
              </Button>
              <Button variant="outline" className="h-14 font-bold gap-3 border-2 border-brand-outline-variant/40">
                <MessageCircle size={18} />
                WhatsApp
              </Button>
           </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
