
import React from 'react';
import { NavItem } from '../types'; // Assuming NavItem has id and name

interface ModuleTabsProps {
  tabs: NavItem[]; // Array of tab items (NavItem structure can be reused)
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}

const ModuleTabs: React.FC<ModuleTabsProps> = ({ tabs, activeTabId, onTabClick }) => {
  return (
    <div className="px-6 bg-slate-50 border-b border-gray-200">
      <nav className="flex space-x-1 -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`
                whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm
                focus:outline-none transition-colors duration-150
                ${
                  isActive
                    ? 'border-theme-primary-500 text-theme-primary-600' // Use generic theme-primary
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ModuleTabs;