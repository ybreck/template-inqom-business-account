

import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { 
  HomeIcon, ChartBarIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, LockClosedIcon, 
  FolderPlusIcon, DocumentDuplicateIcon, ClipboardDocumentListIcon, 
  KeyIcon, SquaresPlusIcon, CogIcon, QuestionMarkCircleIcon, ChevronDownIcon,
  LinkIcon, ArrowRightOnRectangleIcon, Bars3Icon, BriefcaseIcon, CreditCardIcon,
  ShoppingCartIcon, ArchiveBoxIcon, ReceiptPercentIcon, ClipboardDocumentCheckIcon,
  BanknotesIcon, CalendarDaysIcon, TagIcon, UserGroupIcon, BuildingLibraryIcon,
  TableCellsIcon, ArrowsRightLeftIcon, PresentationChartLineIcon, ChartPieIcon,
  CheckCircleIcon, AdjustmentsHorizontalIcon
} from '../constants/icons'; // Assuming this path from src/components/Sidebar to src/constants/icons is correct

interface SidebarProps {
  activePageId: string;
  onNavigate: (pageId: string) => void;
  navItems: NavItem[]; // This prop should be used
}

const Sidebar: React.FC<SidebarProps> = ({ activePageId, onNavigate, navItems }) => {
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.isDropdown && item.children) {
        const isActiveParentOrChildActive = item.id === activePageId || 
                                          activePageId.startsWith(item.id + "_") || 
                                          item.children?.some(child => child.id === activePageId || activePageId.startsWith(child.id + "_"));
        initialState[item.id] = item.isOpen || isActiveParentOrChildActive || false;
      }
    });
    return initialState;
  });

  useEffect(() => {
    const newOpenDropdowns: Record<string, boolean> = { ...openDropdowns };
    let changed = false;
    navItems.forEach(item => {
      if (item.isDropdown && item.children) {
        const isParentItselfActive = item.id === activePageId;
        const isChildActive = item.children.some(child => child.id === activePageId);
        // More robust: check if activePageId belongs to this module, e.g. "comptes_pro_operations" belongs to "comptes_pro"
        const moduleIsActive = activePageId.startsWith(item.id + "_") || isParentItselfActive;

        if (moduleIsActive && !openDropdowns[item.id]) {
          newOpenDropdowns[item.id] = true;
          changed = true;
        } else if (!moduleIsActive && openDropdowns[item.id] && !item.isOpen) { 
          // Optional: close if module is not active and it wasn't set to be open by default
          // This behavior might be too aggressive, depending on UX preference.
          // For now, only open, don't auto-close unless explicitly toggled.
        }
      }
    });
    if (changed) {
      setOpenDropdowns(newOpenDropdowns);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId, navItems]);


  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const bottomSectionItemIds = ['parametres', 'assistance'];
  const topNavItemsToRender = navItems.filter(item => !bottomSectionItemIds.includes(item.id));
  const bottomNavItemsToRender = navItems.filter(item => bottomSectionItemIds.includes(item.id));


  const renderNavItem = (item: NavItem, isChild: boolean = false) => {
    // activePageId from App.tsx is activeMainPageId.
    // For direct items, isActive is item.id === activePageId
    // For parent dropdowns, they should appear active if activePageId is the item.id OR if activePageId starts with item.id + "_"
    // For child items, isActive is item.id === activePageId (which would be activeSubPageId from App's perspective if routed correctly)
    // However, Sidebar receives activeMainPageId as activePageId. So child highlighting will be indirect.
    // The parent dropdown will be highlighted if activePageId (main) matches the parent's ID.
    
    let isActive = item.id === activePageId; // Base case for non-dropdown or child items matching activeSubPageId (if Sidebar were aware of it)
                                          // Since Sidebar gets activeMainPageId, this will highlight the main category.

    if (isChild) { // Child item
        isActive = item.id === activePageId; // This condition will likely be false mostly, as activePageId is main.
                                             // Highlighting of children happens if App.tsx sets activeMainPageId to child's ID.
    } else if (item.isDropdown) { // Parent dropdown item
        isActive = item.id === activePageId || activePageId.startsWith(item.id + "_");
    }


    const baseItemStyle = 'flex items-center w-full py-2.5 text-sm font-medium rounded-md group';
    const activeStyle = 'bg-dbf-purple-100 text-dbf-purple-600'; 
    const inactiveStyle = 'hover:bg-dbf-purple-50 hover:text-dbf-purple-600 text-gray-700';
    const paddingStyle = isChild ? (item.isDropdown ? 'pl-7 pr-3' : 'pl-10 pr-3') : 'px-3';

    if (item.isDropdown && item.children) {
      return (
        <div key={item.id}>
          <button
            onClick={() => {
              onNavigate(item.id); // Navigate to the parent item's ID (this sets activeMainPageId in App)
              toggleDropdown(item.id);
            }}
            className={`${baseItemStyle} ${paddingStyle} ${isActive ? activeStyle : inactiveStyle}`}
            aria-expanded={openDropdowns[item.id]}
            aria-controls={`dropdown-${item.id}`}
          >
            {React.cloneElement(item.icon, { className: `w-5 h-5 ${isActive ? 'text-dbf-purple-600' : 'text-gray-500 group-hover:text-dbf-purple-500'}` })}
            <span className="ml-3 flex-1 text-left">{item.name}</span>
            {item.badge && (
              <span className={'ml-auto mr-2 bg-dbf-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full'}>
                {item.badge}
              </span>
            )}
            <ChevronDownIcon 
              className={`w-4 h-4 ml-auto text-gray-500 group-hover:text-dbf-purple-500 transition-transform duration-200 ${openDropdowns[item.id] ? 'rotate-180' : 'rotate-0'}`} 
            />
          </button>
          {openDropdowns[item.id] && (
            <div className="mt-1 space-y-1" id={`dropdown-${item.id}`}>
              {item.children.map(child => {
                  // For child items, their 'active' state for styling depends on whether App.tsx would set activeMainPageId to the child's ID.
                  // Or if App.tsx's activeSubPageId (not available here) matches child.id and activeMainPageId matches parent item.id
                  const isChildActive = child.id === activePageId; // This works if child IDs can be activeMainPageId
                  return (
                    <button
                        key={child.id}
                        onClick={() => onNavigate(child.id)} // App.tsx's onNavigate will handle this.
                        className={`${baseItemStyle} ${paddingStyle} ${isChildActive ? activeStyle : inactiveStyle}`}
                        aria-current={isChildActive ? 'page' : undefined}
                    >
                        {React.cloneElement(child.icon, { className: `w-5 h-5 ${isChildActive ? 'text-dbf-purple-600' : 'text-gray-500 group-hover:text-dbf-purple-500'}` })}
                        <span className="ml-3 flex-1 text-left">{child.name}</span>
                        {child.badge && (
                        <span className="ml-auto bg-dbf-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {child.badge}
                        </span>
                        )}
                    </button>
                  );
              })}
            </div>
          )}
        </div>
      );
    }

    // Non-dropdown item
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`${baseItemStyle} ${paddingStyle} ${isActive ? activeStyle : inactiveStyle}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {React.cloneElement(item.icon, { className: `w-5 h-5 ${isActive ? 'text-dbf-purple-600' : 'text-gray-500 group-hover:text-dbf-purple-500'}` })}
        <span className="ml-3 flex-1 text-left">{item.name}</span>
        {item.badge && (
          <span className={`ml-auto bg-dbf-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };


  return (
    <div className="w-72 bg-white text-gray-700 flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bars3Icon className="w-6 h-6 text-gray-600" />
          <h1 className="text-xl font-bold text-dbf-purple-600">Plateforme Cabinet</h1>
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-100">
          <div className="flex items-center space-x-2">
            <span className="bg-dbf-purple-600 text-white text-sm font-semibold rounded-md w-8 h-8 flex items-center justify-center">COG</span> 
            <span className="text-sm font-medium text-dbf-text">COGEP</span> 
          </div>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto">
        {topNavItemsToRender.map(item => renderNavItem(item))}
      </nav>

      <div className="mt-auto p-2 border-t border-gray-200">
        {bottomNavItemsToRender.map((item) => (
           <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md hover:bg-dbf-purple-50 hover:text-dbf-purple-600 text-gray-700 group"
          >
            {React.cloneElement(item.icon, { className: "w-5 h-5 text-gray-500 group-hover:text-dbf-purple-500" })}
            <span className="ml-3 text-left">{item.name}</span>
          </button>
        ))}
        <div className="flex items-center justify-start text-xs text-gray-500 px-3 py-4 space-x-3">
          <a href="#" className="hover:text-dbf-purple-500 flex items-center"><LinkIcon className="w-3.5 h-3.5 mr-1" />CGU</a> 
          <span>-</span>
          <a href="#" className="hover:text-dbf-purple-500 flex items-center"><ArrowRightOnRectangleIcon className="w-3.5 h-3.5 mr-1" />Déconnexion</a> 
        </div>
      </div>
    </div>
  );
};

export default Sidebar;