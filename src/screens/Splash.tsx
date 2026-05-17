import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hexagon } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/login'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-brand-surface">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-secondary-container rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-tertiary-container rounded-full blur-[100px] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center px-6"
      >
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-primary-container opacity-10 rounded-[2rem] rotate-45" />
          <Hexagon className="text-brand-primary" size={64} fill="currentColor" fillOpacity={0.2} />
        </div>
        
        <h1 className="text-4xl font-bold text-brand-primary mb-2 tracking-tight">
          Jenu-Gumpu
        </h1>
        <p className="text-lg text-brand-on-surface-variant max-w-[280px]">
          Empowering Honey Producers
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 w-48">
          <div className="w-full h-1 bg-brand-surface-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-secondary transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="text-[10px] font-bold text-brand-secondary tracking-widest uppercase">
            Synchronizing Apiaries
          </span>
        </div>
      </motion.div>
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
    </div>
  );
}
