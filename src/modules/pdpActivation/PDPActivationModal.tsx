import React from 'react';
import { CloseIcon, DocumentCheckIcon } from '../../constants/icons'; 

interface PAActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrand: 'inqom' | 'cabinet'; // Added activeBrand prop
}

const PAActivationModal: React.FC<PAActivationModalProps> = ({ isOpen, onClose, activeBrand }) => {
  if (!isOpen) {
    return null;
  }

  const paName = activeBrand === 'cabinet' ? 'Votre Cabinet' : 'Inqom'; // Or DBF AUDIT if that's specific to Inqom brand

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pa-modal-title"
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-up"
        onClick={(e) => e.stopPropagation()} 
        style={{ animationName: 'modal-scale-up-animation', animationDuration: '0.3s', animationFillMode: 'forwards' }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="pa-modal-title" className="text-xl sm:text-2xl font-semibold text-theme-text">
            Désignez {paName} comme votre PA
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer la fenêtre modale"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center my-6 sm:my-8">
          {/* DocumentCheckIcon uses dbf-purple-500, which needs to become theme-primary-500 */}
          <DocumentCheckIcon className="w-32 h-32 sm:w-36 sm:h-36 text-theme-primary-500" />
        </div>

        <p className="text-sm sm:text-base text-theme-text mb-3 text-center">
          Ça y est ! Vous pouvez inscrire <strong>{paName}</strong>, notre Plateforme Agréée (PA), dans l'annuaire pour faciliter votre transition obligatoire vers la facturation électronique.
        </p>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center">
          Prenez <strong className="text-theme-primary-600">5 minutes</strong> pour terminer votre inscription.
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-theme-secondary-gray-700 border border-theme-secondary-gray-300 rounded-lg hover:bg-theme-secondary-gray-100 transition-colors focus:ring-2 focus:ring-theme-secondary-gray-300 focus:outline-none"
          >
            En savoir plus
          </button>
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors focus:ring-2 focus:ring-theme-primary-300 focus:outline-none"
          >
            Commencer
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes modal-scale-up-animation {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-modal-scale-up {
            animation-name: modal-scale-up-animation;
            animation-duration: 0.3s;
            animation-fill-mode: forwards;
          }
        `}
      </style>
    </div>
  );
};

export default PAActivationModal;