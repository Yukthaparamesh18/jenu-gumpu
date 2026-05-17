import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, Menu } from 'lucide-react';
import { Card, Button } from '@/src/components/ui/BaseComponents';
import { Navbar } from '@/src/components/Navbar';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col pb-32">
      <header className="bg-brand-surface-lowest shadow-sm h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Menu className="text-brand-primary cursor-pointer" />
            <h1 className="text-xl font-bold text-brand-primary">Jenu-Gumpu</h1>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-outline-variant/30 shadow-sm">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxpPeKO-E_itI7o4XDPossvbpc1NALcm17VWRbtobboyX711cNmPxPU-2gPMGdXZfpK7Wa-LRHzNvBrDHWhrEqRR8z0IZ9ukI1j3LDxe5_tte18TnvjsrqOi9tYCBrzOioJtcAA0B6IT6jI9M_Zh-cgGwM1cNWlCaStuMvqH1dg6UXYkG4Qf_IhXFlYy0B8PKolXBI_QkBUEjIT_9S_OxZ3cVRTMqR-QmzkkPH-eQIZmx1VDqbS-Vfbofrm5qW55INh2yP_-YkTvP"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 gap-8">
        <Card className="w-full max-w-md p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-brand-primary-container/20 rounded-full flex items-center justify-center transition-transform hover:rotate-12 duration-300">
               <LogOut size={40} className="text-brand-primary translate-x-1" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-brand-secondary mb-2">Sign Out</h2>
          <p className="text-base text-brand-on-surface-variant font-medium">Are you sure you want to logout?</p>

          <Card className="w-full bg-brand-surface-low border-none shadow-none p-5 mt-8 flex items-start gap-4 text-left">
            <input 
              type="checkbox" 
              id="clear-data" 
              className="mt-1 w-5 h-5 text-brand-secondary border-brand-outline-variant rounded focus:ring-brand-secondary" 
            />
            <label htmlFor="clear-data" className="flex flex-col gap-1 cursor-pointer">
              <span className="text-lg font-bold text-brand-on-surface">Clear Local Data</span>
              <span className="text-sm text-brand-on-surface-variant opacity-80 leading-relaxed">
                Frees up space by removing cached harvest reports.
              </span>
            </label>
          </Card>

          <div className="w-full flex flex-col gap-4 mt-8">
            <Button size="xl" className="w-full py-4 h-14 bg-brand-primary shadow-lg border-b-2 border-black/10 active:border-b-0" onClick={() => navigate('/login')}>
              Confirm Logout
            </Button>
            <Button variant="outline" size="xl" className="w-full py-4 h-14 border-2 border-brand-secondary hover:bg-brand-secondary-container/20" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>

          <div className="mt-8 relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-inner group">
             <img 
              alt="Honey" 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Mmp4PCETDyhhR3Nb5oX19rogSdDUkIhuujl-k2nTr4iFJIZdfZoUgUVYvlXHRsBDGzVsCbJuq8wgXVEqec-5OyIBQUsPhLbhLOGxz2ISg2cCkaHFU3mxN5NObWHd2PP5cMtDK9YL_O0Em_b1XDLA0S0P1Vw09eIvUVGNvSHWo1dKO9c-iR33G27RQqltn60pSbTIifTj_zEVzDeKu4LzXNs0oH-k55HaG7P7mVrxG3DZLoBKzZ-ydrkLkCz0QR5VqGdgwoGsFN0T"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-lowest/40 to-transparent" />
          </div>
        </Card>

        <p className="max-w-xs text-center text-sm font-semibold text-brand-on-surface-variant/70 leading-relaxed">
          Logging out will end your current session. You will need to re-authenticate to access your hive telemetry.
        </p>
      </main>

      <Navbar />
    </div>
  );
}
