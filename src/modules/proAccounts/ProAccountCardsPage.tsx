

import React, { useState } from 'react';
import { ModuleComponentProps, PaymentCard } from './types';
import { mockPaymentCards } from './data';
import { PlusCircleIcon, CreditCardIcon, EyeIcon, ExclamationTriangleIcon, CheckCircleIcon, AccessibleIconProps } from '../../constants/icons'; // Using global icons

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const CardStatusIndicator: React.FC<{ status: PaymentCard['status'] }> = ({ status }) => {
  let bgColor = 'bg-gray-400';
  let textColor = 'text-white';
  // Explicitly type IconComponent to handle different prop types from imported icons
  let IconComponent: React.FC<React.SVGProps<SVGSVGElement> | AccessibleIconProps> = ExclamationTriangleIcon;


  if (status === 'Active') {
    bgColor = 'bg-green-500';
    IconComponent = CheckCircleIcon;
  } else if (status === 'Bloquée') {
    bgColor = 'bg-red-500';
    // IconComponent remains ExclamationTriangleIcon
  } else if (status === 'Expirée') {
    bgColor = 'bg-yellow-500';
    // IconComponent remains ExclamationTriangleIcon
  } else if (status === 'Annulée') {
    bgColor = 'bg-slate-500';
    // IconComponent remains ExclamationTriangleIcon
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor} inline-flex items-center`}>
      <IconComponent className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
};


const ProAccountCardsPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [cards, setCards] = useState<PaymentCard[]>(mockPaymentCards);

  const handleAddCard = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_carte_ajouter');
    }
  };

  const handleViewTransactions = (cardId: string) => {
    if (onSubNavigate) {
      // Pass cardId as a query-like parameter in the subPageId
      onSubNavigate(`comptes_pro_carte_transactions?cardId=${cardId}`);
    }
  };
  
  const handleExpireCard = (cardId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir marquer cette carte comme expirée ?")) {
        setCards(prevCards => 
            prevCards.map(card => card.id === cardId ? {...card, status: 'Expirée'} : card)
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-theme-text">Gestion des Cartes de Paiement</h3>
        <button
          onClick={handleAddCard}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Ajouter une carte
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          <CreditCardIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-1">Aucune carte de paiement trouvée.</p>
          <p className="text-sm">Commencez par ajouter une nouvelle carte.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const limit = card.spendingLimitMonth || 0;
            const spent = card.currentMonthSpending || 0;
            const remaining = limit - spent;
            const spentPercentage = limit > 0 ? (spent / limit) * 100 : 0;

            return (
              <div key={card.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col border border-theme-secondary-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className={`p-5 bg-gradient-to-br ${card.status === 'Active' ? 'from-theme-primary-500 to-theme-primary-600' : 'from-theme-secondary-gray-500 to-theme-secondary-gray-600'} text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{card.cardholderName}</h4>
                      <p className="text-sm opacity-90">•••• •••• •••• {card.last4Digits}</p>
                    </div>
                    <CreditCardIcon className="w-8 h-8 opacity-70" />
                  </div>
                  <div className="mt-3 text-xs opacity-80">
                    <span>{card.type}</span> &bull; <span>Expire : {card.expiryDate}</span>
                  </div>
                </div>

                <div className="p-5 flex-grow space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Statut :</span>
                    <CardStatusIndicator status={card.status} />
                  </div>
                 
                  {limit > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Dépensé : {formatCurrency(spent)}</span>
                        <span>Plafond : {formatCurrency(limit)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${spentPercentage > 85 ? 'bg-red-500' : spentPercentage > 60 ? 'bg-yellow-400' : 'bg-theme-primary-500'}`}
                          style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-xs text-gray-600 mt-1">
                        Restant : {formatCurrency(remaining)}
                      </p>
                    </div>
                  )}
                  {limit === 0 && <p className="text-sm text-gray-500">Aucun plafond mensuel défini.</p>}
                </div>
                
                <div className="p-3 bg-slate-50 border-t border-gray-200 flex items-center justify-end space-x-2">
                   <button
                    onClick={() => handleViewTransactions(card.id)}
                    className="px-3 py-1.5 text-xs font-medium text-theme-primary-600 hover:bg-theme-primary-50 rounded-md border border-theme-primary-200 flex items-center"
                    title="Voir les transactions de cette carte"
                  >
                    <EyeIcon className="w-3.5 h-3.5 mr-1.5" />
                    Transactions
                  </button>
                   {card.status === 'Active' && (
                    <button
                        onClick={() => handleExpireCard(card.id)}
                        className="px-3 py-1.5 text-xs font-medium text-yellow-600 hover:bg-yellow-50 rounded-md border border-yellow-300 flex items-center"
                        title="Marquer cette carte comme expirée"
                    >
                        <ExclamationTriangleIcon className="w-3.5 h-3.5 mr-1.5" />
                        Expirer
                    </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProAccountCardsPage;