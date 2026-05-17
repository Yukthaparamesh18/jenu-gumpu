import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div 
    className={cn(
      "bg-brand-surface-lowest border border-brand-surface-highest rounded-2xl shadow-[0_4px_20px_rgba(6,78,59,0.04)] overflow-hidden",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tertiary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-brand-primary text-brand-on-primary hover:brightness-110 shadow-md",
    secondary: "bg-brand-secondary-container text-brand-on-secondary-container hover:bg-brand-secondary-container/80",
    outline: "bg-transparent border border-brand-outline-variant text-brand-on-surface-variant hover:bg-brand-surface-low",
    ghost: "bg-transparent hover:bg-brand-surface-high text-brand-on-surface-variant",
    tertiary: "bg-brand-secondary text-brand-on-primary hover:brightness-110",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold",
    xl: "px-8 py-4 text-lg font-bold",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-xl transition-all flex items-center justify-center gap-2", 
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, icon, className, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-brand-on-surface px-1">{label}</label>}
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3 text-brand-on-surface-variant">{icon}</div>}
      <input
        className={cn(
          "w-full h-12 bg-white border border-brand-outline-variant rounded-xl px-4 py-3 text-base",
          "focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all",
          "placeholder:text-brand-on-surface-variant/40",
          icon && "pl-11",
          className
        )}
        {...props}
      />
    </div>
  </div>
);
