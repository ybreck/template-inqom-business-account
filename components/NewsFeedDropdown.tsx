
import React from 'react';
import { NewsItem } from '../types';
import { CloseIcon, InformationCircleIcon, ExclamationTriangleIcon, MegaphoneIcon } from '../src/constants/icons'; 

interface NewsFeedDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  newsItems: NewsItem[];
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getCategoryStyle = (category: NewsItem['category']) => {
  switch (category) {
    case 'Mise à jour':
      return {
        icon: <MegaphoneIcon className="w-4 h-4 text-theme-primary-700" />,
        badgeColor: 'bg-theme-primary-100 text-theme-primary-700 border-theme-primary-300',
        iconColor: 'text-theme-primary-700',
      };
    case 'Information':
      return {
        icon: <InformationCircleIcon className="w-4 h-4 text-sky-700" />,
        badgeColor: 'bg-sky-100 text-sky-700 border-sky-300',
        iconColor: 'text-sky-700',
      };
    case 'Alerte':
      return {
        icon: <ExclamationTriangleIcon className="w-4 h-4 text-red-700" />,
        badgeColor: 'bg-red-100 text-red-700 border-red-300',
        iconColor: 'text-red-700',
      };
    case 'Conseil':
      return {
        icon: <InformationCircleIcon className="w-4 h-4 text-teal-700" />, 
        badgeColor: 'bg-teal-100 text-teal-700 border-teal-300',
        iconColor: 'text-teal-700',
      };
    default: // Fiscalité and other new categories
      return {
        icon: <InformationCircleIcon className="w-4 h-4 text-theme-secondary-gray-700" />,
        badgeColor: 'bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border-theme-secondary-gray-300',
        iconColor: 'text-theme-secondary-gray-700',
      };
  }
};


const NewsFeedDropdown: React.FC<NewsFeedDropdownProps> = ({ isOpen, onClose, newsItems, buttonRef }) => {
  if (!isOpen) return null;

  const buttonRect = buttonRef.current?.getBoundingClientRect();
  const dropdownStyle: React.CSSProperties = buttonRect ? {
    position: 'absolute',
    top: `${buttonRect.bottom + window.scrollY + 8}px`, // 8px spacing
    right: `${window.innerWidth - buttonRect.right - window.scrollX}px`, // Align to the right of the button
    minWidth: '360px', // Ensure a minimum width
    maxWidth: '450px',
  } : {
    position: 'absolute',
    top: '100%', // Fallback if ref is not ready
    right: '0',
    minWidth: '360px',
    maxWidth: '450px',
  };


  const sortedNewsItems = [...newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = newsItems.filter(item => !item.read).length;


  return (
    <div 
        style={dropdownStyle}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-slide-down-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-feed-title"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-theme-primary-50 rounded-t-lg">
        <h2 id="news-feed-title" className="text-lg font-semibold text-theme-primary-700">
          Actualités du Cabinet
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-primary-300 rounded-full p-1"
          aria-label="Fermer les actualités"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {sortedNewsItems.length > 0 ? (
        <div className="overflow-y-auto max-h-[calc(100vh-250px)] sm:max-h-[450px] divide-y divide-gray-100">
          {sortedNewsItems.map((item) => {
            const categoryInfo = getCategoryStyle(item.category);
            return (
              <div key={item.id} className={`p-4 hover:bg-slate-50 transition-colors duration-150 ${!item.read ? 'bg-theme-primary-50' : 'bg-white'}`}>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-32 object-cover rounded-md mb-3" 
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryInfo.badgeColor} flex items-center`}>
                    {React.cloneElement(categoryInfo.icon, { className: 'w-3 h-3 mr-1.5' })}
                    {item.category}
                  </span>
                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                </div>
                <h3 className="text-md font-semibold text-theme-text mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.content}</p>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-theme-primary-600 hover:text-theme-primary-700 hover:underline font-medium"
                  >
                    En savoir plus &rarr;
                  </a>
                )}
                 {!item.read && (
                    <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-theme-primary-500 rounded-full" title="Non lu"></div>
                  )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="p-6 text-sm text-gray-500 text-center">Aucune actualité pour le moment.</p>
      )}

      <div className="p-3 border-t border-gray-200 bg-slate-50 rounded-b-lg flex justify-end">
        <button 
          className="text-xs text-theme-primary-600 hover:text-theme-primary-700 font-medium py-1 px-3 rounded-md hover:bg-theme-primary-100 transition-colors"
          // onClick={() => console.log("Mark all as read clicked")} // Placeholder
        >
          Marquer tout comme lu ({unreadCount})
        </button>
      </div>
      <style>
        {`
          @keyframes slide-down-fade-in {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-down-fade-in {
            animation: slide-down-fade-in 0.3s ease-out forwards;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;  
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default NewsFeedDropdown;