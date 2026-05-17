import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Timer, RotateCcw, Hexagon } from 'lucide-react';
import { Button } from '@/src/components/ui/BaseComponents';
import { cn } from '@/src/lib/utils';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['4', '2', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col">
      <header className="h-16 flex items-center px-5">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pb-12">
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center shadow-inner">
            <ShieldCheck size={48} className="text-brand-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-brand-secondary-container rounded-full flex items-center justify-center shadow-md animate-bounce">
            <ShieldCheck size={18} className="text-brand-on-secondary-container" />
          </div>
        </div>

        <div className="max-w-md w-full text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Verify Your Number</h1>
          <p className="text-brand-on-surface-variant text-base">We've sent a 6-digit code to your registered mobile number.</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                className="w-12 h-14 text-center text-2xl font-bold bg-white border border-brand-outline-variant rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                maxLength={1}
                type="text"
                value={digit}
                placeholder="·"
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-surface-low rounded-full">
              <Timer size={16} className="text-brand-on-surface-variant" />
              <span className="text-sm font-semibold text-brand-on-surface-variant">
                Code expires in <span className="text-brand-primary font-bold">02:00</span>
              </span>
            </div>
            <button className="text-sm font-semibold text-brand-outline hover:text-brand-primary transition-colors flex items-center gap-1 group">
              <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              Resend Code
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              size="xl" 
              className="w-full py-4 h-14"
              onClick={() => navigate('/dashboard')}
            >
              Verify
              <ArrowRight size={20} />
            </Button>
            
            <div className="pt-6 flex flex-col items-center">
              <p className="text-xs font-semibold text-brand-on-surface-variant mb-6">
                Need help? <button className="text-brand-secondary font-bold hover:underline">Contact Support</button>
              </p>
              
              <div className="flex items-center gap-2 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                  <Hexagon size={14} className="text-white" fill="currentColor" />
                </div>
                <span className="text-xs font-bold tracking-tight text-brand-primary">Jenu-Gumpu</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-brand-secondary/5 rounded-full blur-[60px] pointer-events-none -z-10" />
    </div>
  );
}
