import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, ChevronDown, Save, Info, Fingerprint, Calendar } from 'lucide-react';
import { Button, Input, Card } from '@/src/components/ui/BaseComponents';

export default function AddHarvest() {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-surface min-h-screen pb-24 text-brand-on-surface">
      <header className="bg-brand-surface-lowest sticky top-0 z-40 shadow-sm h-16 flex items-center px-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-brand-surface-low transition-all active:scale-95"
        >
          <ArrowLeft size={24} className="text-brand-on-surface-variant" />
        </button>
        <h1 className="text-xl font-bold text-brand-primary">Add Harvest</h1>
      </header>

      <main className="max-w-md mx-auto px-6 pt-6 space-y-8">
        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg group">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKV0T-2-D3Hfa9ACgp16DUd3TJms3XdDtp2ecAGng7AiiiNPnGAf16buyVVOzK2vd_stA1bKQ_ndDX7rSjxozl5IuOauKgIb57Talh1piZqtqsGxAqmr78Z67YpTKZlwxOPC8FIeGbupjtGVJFwVXnlVDUKlGx_U4UVaaKzTd4bPAPF2srYHe8vkdJ6miDJTWXpUdeigkTX1q0wm2NivGT6SEdN-OVQe2JkQKUBVkskafzg86gmVmB7depACl4Pj08BM4pv7W5XfB0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Season 2024</p>
            <h2 className="text-xl font-bold">Capture New Yield</h2>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-outline-variant/30 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">Batch ID</label>
            <div className="flex items-center gap-2">
              <Fingerprint size={18} className="text-brand-outline opacity-60" />
              <input className="bg-transparent border-none p-0 font-bold text-brand-on-surface-variant outline-none focus:ring-0" readOnly value="JG-2023-10-25" />
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Harvest Date" type="date" defaultValue="2023-10-25" />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-brand-on-surface px-1">Location</label>
              <div className="relative">
                <Input placeholder="North Orchard, Block B" className="pr-12" />
                <button type="button" className="absolute right-3 top-3 text-brand-secondary hover:bg-brand-secondary-container/50 p-1 rounded-full transition-all">
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-brand-on-surface px-1">Floral Source</label>
              <div className="relative">
                <select 
                  defaultValue="Wildflower"
                  className="w-full h-12 px-4 bg-white border border-brand-outline-variant rounded-xl text-base appearance-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                >
                  <option>Coffee</option>
                  <option>Wildflower</option>
                  <option>Neem</option>
                  <option>Clover</option>
                  <option>Manuka</option>
                </select>
                <ChevronDown size={20} className="absolute right-3 top-3.5 text-brand-outline pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity (kg)" placeholder="0.0" type="number" step="0.1" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-brand-on-surface px-1">Quality Grade</label>
                <div className="relative">
                  <select 
                    defaultValue="Grade A"
                    className="w-full h-12 px-4 bg-white border border-brand-outline-variant rounded-xl text-base appearance-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  >
                    <option>Not Graded</option>
                    <option>Grade A+</option>
                    <option>Grade A</option>
                    <option>Grade B</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-3.5 text-brand-outline pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-brand-on-surface px-1">Notes (Optional)</label>
              <textarea 
                className="w-full p-4 rounded-xl bg-white border border-brand-outline-variant text-base focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-brand-on-surface-variant/40"
                placeholder="Describe environmental conditions or floral notes..."
                rows={4}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <Button size="xl" className="w-full h-14 bg-brand-primary shadow-lg">
              <Save size={20} fill="currentColor" />
              Save Harvest
            </Button>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="text-brand-secondary font-bold text-sm py-2 hover:bg-brand-secondary-container/20 rounded-full transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

        <Card className="bg-brand-secondary-container/10 p-4 border-none shadow-none flex gap-4">
          <div className="bg-brand-secondary/10 p-2 rounded-xl h-fit">
            <Info size={20} className="text-brand-secondary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-secondary">Record-Keeping Tip</h4>
            <p className="text-xs text-brand-on-secondary-container/80 mt-1 leading-relaxed">
              Detailed floral sources help track premium value trends for specific harvest windows.
            </p>
          </div>
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-tertiary to-brand-secondary opacity-50" />
    </div>
  );
}
