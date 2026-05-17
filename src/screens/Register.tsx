import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, Mail, Lock, RotateCcw, MapPin, Users,
  Menu, ChevronLeft
} from 'lucide-react';
import { Input, Button, Card } from '@/src/components/ui/BaseComponents';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col">
      <header className="bg-brand-surface-lowest shadow-sm sticky top-0 z-40 px-5 h-16 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Menu className="text-brand-primary cursor-pointer" />
          <span className="text-xl font-bold text-brand-primary">Jenu-Gumpu</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-surface-high overflow-hidden border border-brand-outline-variant/30">
          <img 
            alt="Profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxpPeKO-E_itI7o4XDPossvbpc1NALcm17VWRbtobboyX711cNmPxPU-2gPMGdXZfpK7Wa-LRHzNvBrDHWhrEqRR8z0IZ9ukI1j3LDxe5_tte18TnvjsrqOi9tYCBrzOioJtcAA0B6IT6jI9M_Zh-cgGwM1cNWlCaStuMvqH1dg6UXYkG4Qf_IhXFlYy0B8PKolXBI_QkBUEjIT_9S_OxZ3cVRTMqR-QmzkkPH-eQIZmx1VDqbS-Vfbofrm5qW55INh2yP_-YkTvP"
          />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-[1140px] grid lg:grid-cols-12 gap-8 items-center">
          <section className="hidden lg:flex lg:col-span-5 flex-col gap-4">
            <h1 className="text-4xl font-bold text-brand-secondary tracking-tight">Empowering Honey Producers</h1>
            <p className="text-lg text-brand-on-surface-variant">
              Join our community of skilled apiarists. Register today to track your harvests, access quality reports, and connect with premium marketplaces.
            </p>
            <div className="mt-8 relative rounded-2xl overflow-hidden aspect-video shadow-xl">
              <img 
                alt="Honey" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Mmp4PCETDyhhR3Nb5oX19rogSdDUkIhuujl-k2nTr4iFJIZdfZoUgUVYvlXHRsBDGzVsCbJuq8wgXVEqec-5OyIBQUsPhLbhLOGxz2ISg2cCkaHFU3mxN5NObWHd2PP5cMtDK9YL_O0Em_b1XDLA0S0P1Vw09eIvUVGNvSHWo1dKO9c-iR33G27RQqltn60pSbTIifTj_zEVzDeKu4LzXNs0oH-k55HaG7P7mVrxG3DZLoBKzZ-ydrkLkCz0QR5VqGdgwoGsFN0T"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent" />
            </div>
          </section>

          <section className="col-span-12 lg:col-span-7">
            <Card className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">Create Producer Account</h2>
                <p className="text-sm font-semibold text-brand-on-surface-variant">Provide your details to start your journey with Jenu-Gumpu.</p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                <Input label="Full Name" placeholder="e.g. Ramesh Kumar" icon={<User size={18} />} />
                <Input label="Phone Number" placeholder="+91 00000 00000" type="tel" icon={<Phone size={18} />} />
                <div className="md:col-span-2">
                  <Input label="Email Address" placeholder="producer@example.com" type="email" icon={<Mail size={18} />} />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Input label="Password" placeholder="••••••••" type="password" icon={<Lock size={18} />} />
                  <div className="flex gap-1 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-brand-tertiary" />
                    <div className="flex-1 h-1 rounded-full bg-brand-tertiary" />
                    <div className="flex-1 h-1 rounded-full bg-brand-surface-highest" />
                    <div className="flex-1 h-1 rounded-full bg-brand-surface-highest" />
                    <span className="text-[10px] font-bold text-brand-tertiary ml-2 whitespace-nowrap">Fair strength</span>
                  </div>
                </div>

                <Input label="Confirm Password" placeholder="••••••••" type="password" icon={<RotateCcw size={18} />} />
                
                <Input label="Village/Location" placeholder="Enter your village" icon={<MapPin size={18} />} />
                <Input label="Producer Group (Optional)" placeholder="e.g. Co-operative A" icon={<Users size={18} />} />

                <div className="md:col-span-2 flex items-start gap-3 mt-2">
                  <input 
                    className="mt-1 w-4 h-4 text-brand-secondary border-brand-outline-variant/50 rounded focus:ring-brand-secondary" 
                    id="terms" 
                    type="checkbox" 
                    required 
                  />
                  <label className="text-sm font-semibold text-brand-on-surface-variant leading-tight" htmlFor="terms">
                    I accept the <button type="button" className="text-brand-primary font-bold hover:underline">Terms & Conditions</button> and understand how my data will be used to improve honey quality standards.
                  </label>
                </div>

                <div className="md:col-span-2 mt-6">
                  <Button type="submit" size="xl" className="w-full text-lg h-14">
                    Register
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-brand-surface-highest text-center">
                <p className="text-base text-brand-on-surface-variant">
                  Already have a producer account? 
                  <button onClick={() => navigate('/login')} className="text-brand-secondary font-bold hover:underline ml-1">Log in here</button>
                </p>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <footer className="bg-brand-surface-low py-8 border-t border-brand-surface-highest/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-brand-primary font-bold text-xl">Jenu-Gumpu</div>
          <div className="flex gap-4">
            <button className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors">Privacy Policy</button>
            <button className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors">Support</button>
            <button className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors">Guidelines</button>
          </div>
          <p className="text-xs text-brand-outline font-medium">© 2024 Jenu-Gumpu. Sustainable Apiculture.</p>
        </div>
      </footer>
    </div>
  );
}
