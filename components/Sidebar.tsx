



import React, { useState, useEffect, useRef } from 'react';
import { NavItem } from '../types';
import {
  LinkIcon, ArrowRightOnRectangleIcon, ChevronDoubleLeftIcon, BoltIcon, ChevronDownIcon
} from '../src/constants/icons'; 

interface SidebarProps {
  activePageId: string; 
  onNavigate: (pageId: string) => void;
  navItems: NavItem[];
  activeBrand: 'inqom' | 'cabinet';
  setActiveBrand: (brand: 'inqom' | 'cabinet') => void;
  isDafViewEnabled: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePageId, onNavigate, navItems, activeBrand, setActiveBrand, isDafViewEnabled }) => {
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdownIds, setOpenDropdownIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const findPathToActive = (items: NavItem[], targetId: string): string[] | null => {
      for (const item of items) {
        if (item.id === targetId) {
          return [item.id];
        }
        if (item.children) {
          const path = findPathToActive(item.children, targetId);
          if (path) {
            return [item.id, ...path];
          }
        }
      }
      return null;
    };

    const path = findPathToActive(navItems, activePageId);
    if (path) {
      setOpenDropdownIds(new Set(path.slice(0, -1)));
    } else {
      setOpenDropdownIds(new Set());
    }
  }, [activePageId, navItems]);


  const bottomSectionItemIds = ['brochure', 'parametres', 'assistance'];
  const topNavItemsToRender = navItems.filter(item => !bottomSectionItemIds.includes(item.id) && item.id !== 'dashboard');
  const bottomNavItemsToRender = navItems.filter(item => bottomSectionItemIds.includes(item.id));

  const InqomTextLogo: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => (
    <span className="bg-theme-primary-500 text-white text-xs font-bold rounded-sm w-7 h-7 flex items-center justify-center flex-shrink-0" {...props}>
       IN
     </span>
   );
   
  const CabinetTextLogo: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => (
    <span className="bg-theme-primary-500 text-white text-xs font-bold rounded-sm w-7 h-7 flex items-center justify-center flex-shrink-0" {...props}>
       CA
     </span>
   );

  const brandLogos = { inqom: <InqomTextLogo />, cabinet: <CabinetTextLogo /> };
  const brandNames = { inqom: "Inqom Gestion", cabinet: "Votre Cabinet" };

  const isCabinet = activeBrand === 'cabinet';

  // Define theme-based classes
  const sidebarBg = isCabinet ? 'bg-theme-secondary-gray-900' : 'bg-[#0F172A]';
  const switcherHoverBg = isCabinet ? 'hover:bg-theme-secondary-gray-800' : 'hover:bg-slate-700';
  const dropdownBg = isCabinet ? 'bg-theme-secondary-gray-800' : 'bg-slate-800';
  const dropdownBorder = isCabinet ? 'border-theme-secondary-gray-700' : 'border-slate-700';
  const dropdownItemHoverBg = isCabinet ? 'hover:bg-theme-secondary-gray-700' : 'hover:bg-slate-700';
  const dafViewBg = isCabinet ? 'bg-theme-secondary-gray-800' : 'bg-slate-700';
  const inactiveNavItemHoverBg = isCabinet ? 'hover:bg-theme-secondary-gray-800' : 'hover:bg-gray-700';

  const renderNavItems = (items: NavItem[], level = 0): JSX.Element[] => {
    return items.map(item => {
        const isActive = activePageId === item.id;
        const isParentOfActive = item.children?.some(c => c.id === activePageId || c.children?.some(gc => gc.id === activePageId)) ?? false;

        const baseItemStyle = 'flex items-center w-full py-2.5 text-sm font-medium rounded-md group transition-colors duration-150';
        const activeStyle = 'bg-white text-gray-900 shadow-sm';
        const inactiveStyle = `text-gray-300 ${inactiveNavItemHoverBg} hover:text-white`;
        const activeParentStyle = 'text-white';

        const paddingStyle = { paddingLeft: `${0.75 + level * 1.25}rem`, paddingRight: '0.75rem' };

        if (item.isDropdown && item.children) {
            const isOpen = openDropdownIds.has(item.id);
            return (
                <div key={item.id}>
                    <button
                        onClick={() => {
                            onNavigate(item.id);
                            setOpenDropdownIds(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(item.id)) newSet.delete(item.id);
                                else newSet.add(item.id);
                                return newSet;
                            });
                        }}
                        className={`${baseItemStyle} ${isParentOfActive ? activeParentStyle : inactiveStyle}`}
                        style={paddingStyle}
                        aria-expanded={isOpen}
                    >
                        {item.icon && React.cloneElement(item.icon, { className: `w-5 h-5 ${isParentOfActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}` })}
                        <span className="ml-3 flex-1 text-left">{item.name}</span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                        <div className="mt-1 space-y-1">
                            {renderNavItems(item.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                key={item.id}
                onClick={() => onNavigate(item.id)} 
                className={`${baseItemStyle} ${isActive ? activeStyle : inactiveStyle}`}
                style={paddingStyle}
                aria-current={isActive ? 'page' : undefined}
            >
                {item.icon && React.cloneElement(item.icon, { className: `w-5 h-5 ${isActive ? 'text-gray-800' : 'text-gray-400 group-hover:text-white'}` })}
                <span className="ml-3 flex-1 text-left">{item.name}</span>
                {item.badge && (
                <span className={`ml-auto ${isActive ? 'bg-theme-primary-500 text-white' : 'bg-gray-600 text-gray-100'} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                    {item.badge}
                </span>
                )}
            </button>
        );
    });
  };

  return (
    <div className={`w-72 ${sidebarBg} text-white flex flex-col`}>
      {/* Header with Brand Switcher */}
      <div className="p-4 relative" ref={brandDropdownRef}>
        <button 
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className={`flex items-center justify-between w-full p-2 rounded-md ${switcherHoverBg} transition-colors`}
            aria-haspopup="true"
            aria-expanded={isBrandDropdownOpen}
        >
            <div className="flex items-center space-x-3">
                {brandLogos[activeBrand]}
                <div>
                    <h1 className="text-base font-bold text-white text-left">{brandNames[activeBrand]}</h1>
                    <p className="text-xs text-gray-400 text-left">ACME</p>
                </div>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isBrandDropdownOpen && (
            <div className={`absolute top-full left-4 right-4 mt-1 ${dropdownBg} border ${dropdownBorder} rounded-md shadow-lg z-10 py-1`}>
                <button onClick={() => { setActiveBrand('inqom'); setIsBrandDropdownOpen(false); }} className={`flex items-center w-full px-3 py-2 text-sm text-left text-gray-200 ${dropdownItemHoverBg}`}>
                    <InqomTextLogo className="mr-3" /> Inqom
                </button>
                <button onClick={() => { setActiveBrand('cabinet'); setIsBrandDropdownOpen(false); }} className={`flex items-center w-full px-3 py-2 text-sm text-left text-gray-200 ${dropdownItemHoverBg}`}>
                    <CabinetTextLogo className="mr-3" /> Cabinet
                </button>
            </div>
        )}
      </div>

      {isDafViewEnabled && (
        <div className="px-4 pb-4">
            <div className={`flex ${dafViewBg} rounded-md p-1 text-sm font-medium`}>
                <button className="w-1/2 py-1 text-gray-300 rounded-sm">COMPTA</button>
                <button className="w-1/2 py-1 text-white bg-theme-primary-500 rounded shadow-md">GESTION</button>
            </div>
        </div>
      )}


      <nav className="flex-1 mt-2 px-2 space-y-1 overflow-y-auto">
        {renderNavItems(topNavItemsToRender)}
      </nav>

      <div className="mt-auto p-2">
        <div className="px-2 pb-2">
            <button
                onClick={() => onNavigate('facturation_electronique_pa')}
                className="w-full p-3 rounded-lg text-left text-white bg-theme-primary-500 hover:bg-theme-primary-600 transition-colors shadow-md"
                aria-label="Facture électronique, Inscrivez vous dès maintenant!"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-sm">Facture électronique</p>
                        <p className="text-xs opacity-80">Inscrivez vous dès maintenant!</p>
                    </div>
                    <BoltIcon className="w-6 h-6 flex-shrink-0" />
                </div>
            </button>
        </div>

        <div className="border-t border-gray-700 my-2"></div>
        
        <div className="px-2 space-y-1">
            {renderNavItems(bottomNavItemsToRender)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;