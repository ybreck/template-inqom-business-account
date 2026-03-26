

import React, { useState } from 'react';
import { ModuleComponentProps, PaymentCard } from './types';
import { mockPaymentCards } from './data';
import { PlusCircle, CreditCard, Eye, EyeOff, Pencil, ChevronUp, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const CardStatusIndicator: React.FC<{ status: PaymentCard['status'] }> = ({ status }) => {
  let bgColor = 'bg-slate-100';
  let textColor = 'text-slate-600';

  if (status === 'Active') {
    bgColor = 'bg-emerald-100';
    textColor = 'text-emerald-700';
  } else if (status === 'Bloquée') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
  } else if (status === 'Expirée') {
    bgColor = 'bg-slate-100';
    textColor = 'text-slate-600';
  } else if (status === 'Annulée') {
    bgColor = 'bg-slate-100';
    textColor = 'text-slate-600';
  }

  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

const ProAccountCardsPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [cards, setCards] = useState<PaymentCard[]>(mockPaymentCards);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  const handleAddCard = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_carte_ajouter');
    }
  };

  const handleViewTransactions = (cardId: string) => {
    if (onSubNavigate) {
      onSubNavigate(`comptes_pro_carte_transactions?cardId=${cardId}`);
    }
  };
  
  const handleExpireCard = (cardId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir résilier cette carte ?")) {
        setCards(prevCards => 
            prevCards.map(card => card.id === cardId ? {...card, status: 'Expirée'} : card)
        );
    }
  };

  if (revealedCardId) {
    const revealedCard = cards.find(c => c.id === revealedCardId);
    if (revealedCard) {
      return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
          {/* Top Logo */}
          <div className="absolute top-8 font-bold text-2xl flex items-center gap-2 text-slate-900">
            <div className="w-4 h-4 bg-red-600"></div>
            <div className="w-4 h-4 bg-black"></div>
            LOGO
          </div>

          {/* Revealed Card */}
          <div className="w-[400px] h-[240px] bg-slate-900 text-white relative rounded-xl overflow-hidden shadow-2xl mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

            <div className="absolute top-6 right-6 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600"></div>
              <div className="w-3 h-3 bg-black"></div>
              <span>LOGO</span>
            </div>
            
            <div className="absolute bottom-6 right-6 flex">
              <div className="w-10 h-10 rounded-full bg-red-500 opacity-90 z-10 mix-blend-multiply"></div>
              <div className="w-10 h-10 rounded-full bg-yellow-500 opacity-90 -ml-4 z-0 mix-blend-multiply"></div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <h4 className="text-sm font-medium mb-4 text-slate-100">{revealedCard.cardholderName}</h4>
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center">
                  <p className="text-2xl font-mono tracking-widest text-white">
                    1234 5678 9012 34{revealedCard.last4Digits}
                  </p>
                  <Copy className="w-4 h-4 ml-3 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-300 font-mono">
                <div className="flex items-center">
                  {revealedCard.expiryDate}
                  <Copy className="w-3.5 h-3.5 ml-2 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="flex items-center">
                  CVC 123
                  <Copy className="w-3.5 h-3.5 ml-2 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setRevealedCardId(null)}
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2">
            <option>Toutes les cartes</option>
            <option>Actives</option>
            <option>Expirées</option>
            <option>Physiques</option>
            <option>Virtuelles</option>
          </select>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-64 pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher une carte"
            />
          </div>
        </div>
        <button
          onClick={handleAddCard}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Ajouter une carte
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-slate-500">
          <CreditCard className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-lg font-medium mb-1">Aucune carte de paiement trouvée.</p>
          <p className="text-sm">Commencez par ajouter une nouvelle carte.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const limit = card.spendingLimitMonth || 0;
            const spent = card.currentMonthSpending || 0;
            const remaining = limit - spent;
            const spentPercentage = limit > 0 ? (spent / limit) * 100 : 0;

            return (
              <div key={card.id} className="bg-white shadow-sm rounded-xl overflow-hidden flex flex-col border border-slate-200">
                {/* Visual Card */}
                <div className="p-6 bg-slate-900 text-white relative h-52">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

                  {/* Logo Placeholder (Top Right) */}
                  <div className="absolute top-6 right-6 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-600"></div>
                    <div className="w-3 h-3 bg-black"></div>
                    <span>LOGO</span>
                  </div>
                  
                  {/* Mastercard Logo (Bottom Right) */}
                  <div className="absolute bottom-6 right-6 flex">
                    <div className="w-8 h-8 rounded-full bg-red-500 opacity-90 z-10 mix-blend-multiply"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-90 -ml-3 z-0 mix-blend-multiply"></div>
                  </div>

                  {/* Card Details */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-sm font-medium mb-2 text-slate-100">{card.cardholderName} - {card.type === 'Physique' ? 'Carte Pro' : 'Service Marketing'}</h4>
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-mono tracking-widest text-white">
                          12** **** **** **{card.last4Digits}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {card.expiryDate} - CVC ***
                    </p>
                  </div>
                </div>

                {/* Show Numbers Button (Below Card) */}
                <div className="flex flex-col items-center justify-center py-4 bg-white border-b border-slate-100">
                  <button 
                    onClick={() => setRevealedCardId(card.id)} 
                    className="w-12 h-8 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors mb-2"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                  </button>
                  <span className="text-xs text-slate-500">Afficher les numéros de la carte</span>
                </div>

                {/* Card Info & Actions */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-slate-900">Carte {card.type.toLowerCase()}</span>
                    <div className="flex items-center gap-3">
                      <CardStatusIndicator status={card.status} />
                      <button className="text-slate-400 hover:text-slate-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                    </div>
                  </div>
                 
                  {limit > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Dépensé : {formatCurrency(spent)}</span>
                        <span>Plafond : {formatCurrency(limit)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
                        <div
                          className={`h-1.5 rounded-full ${spentPercentage > 85 ? 'bg-red-500' : spentPercentage > 60 ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-xs text-slate-500">
                        Restant : {formatCurrency(remaining)}
                      </p>
                    </div>
                  )}
                  {limit === 0 && <p className="text-sm text-slate-500 mb-4">Aucun plafond mensuel défini.</p>}
                  
                  <div className="flex items-center justify-end space-x-3 pt-2">
                     <button
                      onClick={() => handleViewTransactions(card.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded border border-slate-200 flex items-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Transactions
                    </button>
                     {card.status === 'Active' && (
                      <button
                          onClick={() => handleExpireCard(card.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-red-100 transition-colors"
                      >
                          Résilier
                      </button>
                     )}
                  </div>
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