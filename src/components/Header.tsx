import React from 'react';
import { MegaphoneIcon, BellIcon } from '../constants/icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 border-b border-gray-200">
      <div className="flex items-center justify-end space-x-5">
        <button className="flex items-center text-sm font-medium text-gray-600 hover:text-theme-primary-600">
          <MegaphoneIcon className="w-5 h-5 mr-1.5 text-orange-500" />
          Nouveautés
        </button>
        <div className="relative">
          <BellIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </div>
        <button className="px-4 py-1.5 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">
          Entreprise
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">GENIALLY Marcel</span>
           {/* Placeholder for avatar if needed */}
           <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
             GM
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;