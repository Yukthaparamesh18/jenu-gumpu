import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, User } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import useAuthStore from '../../store/authStore';

const roles = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Browse, buy, and review pure honey.',
    icon: ShoppingBag,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'vendor',
    title: 'Vendor / Gatherer',
    description: 'Upload and manage your raw honey harvest.',
    icon: Store,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'seller',
    title: 'Retailer / Seller',
    description: 'Sell packaged and graded honey to users.',
    icon: User,
    color: 'from-green-400 to-emerald-600',
  },
];

const RoleSelectionScreen = () => {
  const navigate = useNavigate();
  const setRole = useAuthStore((state) => state.setRole);

  const handleSelectRole = (roleId) => {
    setRole(roleId);
    navigate('/auth/phone');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-background-dark dark:to-black p-6 flex flex-col">
      <div className="pt-12 pb-8">
        <h1 className="text-3xl font-heading font-bold text-secondary dark:text-amber-50 mb-2">
          Choose your path
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          How would you like to use Jenu Gumpu today?
        </p>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {roles.map((role) => (
          <GlassCard
            key={role.id}
            animateHover
            onClick={() => handleSelectRole(role.id)}
            className="cursor-pointer border-l-4 overflow-hidden relative"
          >
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${role.color}`} />
            <div className="flex items-center gap-4 pl-2">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${role.color} text-white shadow-lg`}>
                <role.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-amber-50">{role.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
