import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hexagon, Mail, Lock, Eye, EyeOff, ChevronDown, Phone } from 'lucide-react';
import { Input, Button, Card } from '@/src/components/ui/BaseComponents';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6 pb-12">
      <main className="w-full max-w-[440px] flex flex-col gap-8">
        <header className="flex flex-col items-center text-center gap-2">
          <div className="w-20 h-20 bg-brand-primary-container/20 rounded-2xl flex items-center justify-center shadow-sm mb-2">
            <Hexagon className="text-brand-primary" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-brand-primary">Jenu-Gumpu</h1>
          <p className="text-brand-on-surface-variant text-base mt-2">
            Empowering honey producers with precision tracking and marketplace access.
          </p>
        </header>

        <Card className="p-8">
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); navigate('/verify-otp'); }}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-brand-on-surface">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative w-24">
                  <select className="w-full h-12 pl-3 pr-8 bg-white border border-brand-outline-variant rounded-xl text-base appearance-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none">
                    <option>+91</option>
                    <option>+1</option>
                    <option>+44</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3.5 text-brand-on-surface-variant h-5 w-5 pointer-events-none" />
                </div>
                <Input placeholder="98765 43210" type="tel" className="flex-1" />
              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-brand-outline-variant/30" />
              <span className="text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-widest opacity-60">or email</span>
              <div className="h-px flex-1 bg-brand-outline-variant/30" />
            </div>

            <Input 
              label="Email Address" 
              placeholder="producer@example.com" 
              type="email"
              icon={<Mail size={20} className="text-brand-on-surface-variant/60" />}
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-brand-on-surface">Password</label>
                <button type="button" className="text-brand-primary text-xs font-semibold hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <Input 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  icon={<Lock size={20} className="text-brand-on-surface-variant/60" />}
                  className="pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-brand-on-surface-variant hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <Button type="submit" size="xl" className="w-full gap-3 h-14">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Login to Dashboard
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                size="xl" 
                className="w-full h-14"
                onClick={() => navigate('/register')}
              >
                Create New Producer Account
              </Button>
            </div>
          </form> Card
        </Card>

        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg border border-brand-surface-high group cursor-pointer">
          <img 
            alt="Honey Combs" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBmUBQP-x96D2CgqHqosmKUn7M7X7yCYWZLsvF0GtNrurxOY_eO7lCwfPjokFk668eNyoA7owQEqVm8Twlf7gqIGC_KKoD7-R7hQ_U-sQZZmcnLfVoYL0DMW58dOujFBS9P0pOZCu4P9MbcMUHo4QkPES31OA7BPI7vAZXVwP3l8GJmoXvkL-vtdQdm0UeRYXoVEsribwz3esP036rLXFPuZg0fdVJMqOv9VvSFsNiiDxKKTDlWT8SNTKp8qiuAD97qvT7YZrJjPG0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <p className="text-xl font-bold">Authentic Apiculture</p>
              <p className="text-sm opacity-80">Track every drop from hive to jar.</p>
            </div>
          </div>
        </div>

        <footer className="text-center">
          <p className="text-brand-on-surface-variant text-[10px] font-bold uppercase tracking-wider opacity-60">
            © 2024 Jenu-Gumpu. All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
