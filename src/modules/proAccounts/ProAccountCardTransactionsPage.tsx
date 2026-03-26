
import React, { useEffect, useState } from 'react';
import { ModuleComponentProps, ProAccountTransaction, PaymentCard } from './types';
import { mockProAccountTransactions, mockPaymentCards, mockProAccountDetails } from './data';
import { CreditCardIcon, ClipboardDocumentListIcon } from '../../constants/icons'; // Using global icons

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProAccountCardTransactionsPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [cardId, setCardId] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<PaymentCard | null>(null);
  const [transactions, setTransactions] = useState<ProAccountTransaction[]>([]);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.includes('?cardId=')) {
      const id = activeSubPageId.split('?cardId=')[1];
      setCardId(id);
      const foundCard = mockPaymentCards.find(c => c.id === id);
      setCardDetails(foundCard || null);

      // Filter transactions for this card (using the new cardId field in transactions)
      // Or simulate if no direct link, e.g. based on card last 4 digits in description
      const cardTransactions = mockProAccountTransactions.filter(
        tx => tx.cardId === id || (foundCard && tx.description.includes(foundCard.last4Digits))
      ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(cardTransactions);
    } else {
      setCardId(null);
      setCardDetails(null);
      setTransactions([]);
    }
  }, [activeSubPageId]);

  if (!cardId || !cardDetails) {
    return (
      <div className="p-6 bg-white shadow-xl rounded-lg text-center">
        <CreditCardIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-dbf-text">Carte non trouvée</h2>
        <p className="text-gray-500">Impossible de charger les informations de la carte ou ID de carte manquant.</p>
        <button
            onClick={() => onSubNavigate?.('comptes_pro_cartes')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-dbf-blue-primary-500 rounded-md hover:bg-dbf-blue-primary-600"
        >
            Retour aux cartes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
            <CreditCardIcon className="w-8 h-8 text-dbf-blue-primary-500 mr-3" />
            <div>
                <h2 className="text-xl font-semibold text-dbf-text">
                    Transactions de la Carte (•••• {cardDetails.last4Digits})
                </h2>
                <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                  <p><span className="font-medium">Titulaire :</span> {cardDetails.cardholderName}</p>
                  <p><span className="font-medium">Type :</span> {cardDetails.type}</p>
                  <p><span className="font-medium">Associée à l'IBAN :</span> {cardDetails.associatedAccountIban}</p>
                </div>
            </div>
        </div>
        {/* Add filters for card transactions if needed */}
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-4 py-2 text-right text-xxs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th scope="col" className="px-4 py-2 text-center text-xxs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transactions.map((tx) => {
                let statusBadgeStyle = 'bg-gray-100 text-gray-700';
                if (tx.status === 'Effectué') statusBadgeStyle = 'bg-green-100 text-green-700';
                else if (tx.status === 'En attente') statusBadgeStyle = 'bg-yellow-100 text-yellow-700';
                else if (tx.status === 'Annulé' || tx.status === 'Rejeté') statusBadgeStyle = 'bg-red-100 text-red-700';
                
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3 text-xs text-dbf-text">
                      <p className="font-medium truncate w-60" title={tx.description}>{tx.description}</p>
                      {tx.thirdPartyName && <p className="text-gray-500 text-xxs">Commerçant: {tx.thirdPartyName}</p>}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-xs font-semibold text-right text-red-600`}>
                      {formatCurrency(tx.amount, mockProAccountDetails.currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`px-2 py-0.5 inline-flex text-xxs leading-4 font-semibold rounded-full ${statusBadgeStyle}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500 flex flex-col items-center">
            <ClipboardDocumentListIcon className="w-10 h-10 text-gray-300 mb-2"/>
            Aucune transaction trouvée pour cette carte dans la période sélectionnée.
          </div>
        )}
      </div>
       <button
            onClick={() => onSubNavigate?.('comptes_pro_cartes')}
            className="mt-4 px-4 py-2 text-sm font-medium text-dbf-blue-primary-600 hover:underline"
        >
            &larr; Retour à la liste des cartes
        </button>
    </div>
  );
};

export default ProAccountCardTransactionsPage;
