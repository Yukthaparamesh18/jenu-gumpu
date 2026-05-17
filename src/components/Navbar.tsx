import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Package, TrendingUp, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Navbar = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Harvest', path: '/harvest-log', icon: ClipboardList },
    { name: 'Stock', path: '/offline', icon: Package },
    { name: 'Prices', path: '/reports', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface-lowest border-t border-brand-surface-high shadow-[0_-2px_10px_rgba(217,119,6,0.08)] z-50 px-4 py-2 pb-safe rounded-t-xl sm:px-8">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
              isActive 
                ? "bg-brand-secondary-container text-brand-on-secondary-container rounded-full px-4 py-1.5" 
                : "text-brand-on-surface-variant/70 px-4 py-1.5"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
