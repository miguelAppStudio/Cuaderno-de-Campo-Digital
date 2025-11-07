import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';

interface BottomNavBarProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.1)] h-16 flex justify-around items-center z-40">
      {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
        const isActive = currentView === view;
        const colorClass = isActive ? 'text-primary' : 'text-text-secondary';

        return (
          <button
            key={view}
            onClick={() => setView(view)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${colorClass} hover:text-primary`}
          >
            <Icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
            <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
