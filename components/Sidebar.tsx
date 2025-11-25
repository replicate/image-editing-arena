import React from 'react';
import { Home, Compass, LayoutGrid, Settings, User } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col items-center py-8 space-y-8 w-20 bg-white/50 backdrop-blur-md border-r border-white/20 h-full fixed left-0 top-0 bottom-0 z-40">
      <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
        R
      </div>
      
      <div className="flex-1 flex flex-col space-y-6 w-full items-center">
        <NavItem icon={<Home size={22} />} active />
        <NavItem icon={<Compass size={22} />} />
        <NavItem icon={<LayoutGrid size={22} />} />
        <NavItem icon={<Settings size={22} />} />
      </div>

      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
        <User className="w-full h-full p-2 text-gray-500" />
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; active?: boolean }> = ({ icon, active }) => (
  <button
    className={`p-3 rounded-2xl transition-all duration-300 ${
      active
        ? 'bg-white shadow-lg text-gray-900 scale-110'
        : 'text-gray-400 hover:bg-white/50 hover:text-gray-600'
    }`}
  >
    {icon}
  </button>
);
