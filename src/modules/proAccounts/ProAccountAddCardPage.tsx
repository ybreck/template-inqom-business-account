
import React, { useState } from 'react';
import { ModuleComponentProps } from './types';
import { CreditCardIcon, PlusCircleIcon } from '../../constants/icons'; // Using global icons

const ProAccountAddCardPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardType, setCardType] = useState<'Physique' | 'Virtuelle'>('Physique');
  const [spendingLimit, setSpendingLimit] = useState<number | string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to the backend
    console.log("New Card Data Submitted (Placeholder):", { cardHolderName, cardType, spendingLimit });
    alert(`Demande de création de carte pour ${cardHolderName} (${cardType}) avec un plafond de ${spendingLimit || 'N/A'} € soumise (simulation).`);
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_cartes'); // Navigate back to the cards list
    }
  };
  
  const handleCancel = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_cartes');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg max-w-lg mx-auto">
      <div className="flex items-center mb-6">
        <CreditCardIcon className="w-8 h-8 text-dbf-blue-primary-500 mr-3" />
        <h2 className="text-2xl font-semibold text-dbf-text">Ajouter une Nouvelle Carte</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cardHolderName" className="block text-sm font-medium text-dbf-text mb-1">
            Nom du titulaire de la carte <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cardHolderName"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-dbf-blue-primary-500 focus:border-dbf-blue-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="cardType" className="block text-sm font-medium text-dbf-text mb-1">
            Type de carte <span className="text-red-500">*</span>
          </label>
          <select
            id="cardType"
            value={cardType}
            onChange={(e) => setCardType(e.target.value as 'Physique' | 'Virtuelle')}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-dbf-blue-primary-500 focus:border-dbf-blue-primary-500"
          >
            <option value="Physique">Physique</option>
            <option value="Virtuelle">Virtuelle</option>
          </select>
        </div>

        <div>
          <label htmlFor="spendingLimit" className="block text-sm font-medium text-dbf-text mb-1">
            Plafond de dépenses mensuel (EUR, optionnel)
          </label>
          <input
            type="number"
            id="spendingLimit"
            value={spendingLimit}
            onChange={(e) => setSpendingLimit(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="Ex: 5000"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-dbf-blue-primary-500 focus:border-dbf-blue-primary-500"
          />
        </div>
        
        <div className="pt-2 text-xs text-gray-500">
            <p>Note: La création de carte est une simulation. Des vérifications et processus bancaires supplémentaires seraient nécessaires dans un environnement réel.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mr-auto sm:mr-4">Les champs marqués d'une <span className="text-red-500">*</span> sont obligatoires.</p>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-dbf-blue-primary-500 rounded-md hover:bg-dbf-blue-primary-600 transition-colors flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-dbf-blue-primary-400"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Demander la carte
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProAccountAddCardPage;
