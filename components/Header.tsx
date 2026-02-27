
import React, { useState, useRef, useEffect } from 'react';
import { MegaphoneIcon, BellIcon, CloseIcon } from '../src/constants/icons'; 
import NewsFeedDropdown from './NewsFeedDropdown'; 
import { mockNewsItems } from '../src/constants/newsData'; 
import { mockNotifications } from '../src/data/notifications'; // IMPORT a single source of truth

interface HeaderProps {
  activeBrand: 'inqom' | 'cabinet';
  onSubNavigate?: (subPageId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeBrand, onSubNavigate }) => {
  const [isNewsFeedOpen, setIsNewsFeedOpen] = useState(false);
  const newsButtonRef = useRef<HTMLButtonElement>(null);
  const newsFeedRef = useRef<HTMLDivElement>(null);

  const pendingNotificationsCount = mockNotifications.filter(n => n.status === 'pending').length;

  const toggleNewsFeed = () => {
    setIsNewsFeedOpen(!isNewsFeedOpen);
  };

  const closeNewsFeed = () => {
    setIsNewsFeedOpen(false);
  };

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        newsFeedRef.current &&
        !newsFeedRef.current.contains(event.target as Node) &&
        newsButtonRef.current &&
        !newsButtonRef.current.contains(event.target as Node)
      ) {
        closeNewsFeed();
      }
    };

    if (isNewsFeedOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNewsFeedOpen]);
  
  const handleNotificationClick = () => {
    if (onSubNavigate) {
      onSubNavigate('conversations_actions_a_faire');
    }
  };

  const enterpriseButtonText = activeBrand === 'cabinet' ? 'Mon Cabinet' : 'Mon Entreprise';

  return (
    <header className="bg-white shadow-sm p-4 border-b border-gray-200 relative z-40">
      <div className="flex items-center justify-end space-x-5">
        <button
          ref={newsButtonRef}
          onClick={toggleNewsFeed}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-theme-primary-500 relative"
          aria-expanded={isNewsFeedOpen}
          aria-controls="news-feed-dropdown"
        >
          <MegaphoneIcon className="w-5 h-5 mr-1.5 text-theme-primary-500" />
          Nouveautés
           {mockNewsItems.filter(item => !item.read).length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </button>
        <button 
            onClick={handleNotificationClick} 
            className="relative" 
            aria-label={`Notifications - ${pendingNotificationsCount} actions à faire`}
        >
          <BellIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          {pendingNotificationsCount > 0 && (
             <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white">
                {pendingNotificationsCount}
            </span>
          )}
        </button>
        <button className="px-4 py-1.5 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">
          {enterpriseButtonText}
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-theme-text">GENIALLY Marcel</span>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
            GM
          </div>
        </div>
      </div>
      {isNewsFeedOpen && (
        <div ref={newsFeedRef}>
          <NewsFeedDropdown
            isOpen={isNewsFeedOpen}
            onClose={closeNewsFeed}
            newsItems={mockNewsItems}
            buttonRef={newsButtonRef}
          />
        </div>
      )}
    </header>
  );
};

export default Header;