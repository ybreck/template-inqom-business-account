
import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white rounded-lg shadow-md">
      {icon && React.cloneElement(icon, { className: 'w-16 h-16 text-theme-secondary-gray-300 mb-6' })} 
      <h2 className="text-3xl font-semibold text-theme-text mb-3">{title}</h2>
      {description && <p className="text-gray-500 mb-2">{description}</p>}
      <p className="text-lg text-theme-secondary-gray-400">Cette section est en cours de développement.</p> 
      <p className="text-sm text-theme-secondary-gray-400 mt-1">Revenez bientôt pour découvrir les nouvelles fonctionnalités !</p> 
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="mt-6 px-6 py-2.5 text-sm font-medium text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors focus:ring-2 focus:ring-theme-primary-300 focus:outline-none"
        >
          {actionButton.text}
        </button>
      )}
    </div>
  );
};

export default PlaceholderPage;