
import React from 'react';
import { ModuleComponentProps, ProAccountTransaction } from './types';
import { mockProAccountTransactions, mockProAccountDetails } from './data';
import { PlusCircleIcon, ArrowsRightLeftIcon } from '../../../src/constants/icons';

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

const ProAccountTransferListPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  // Filter for outgoing transfers and sort by date
  const outgoingTransfers = mockProAccountTransactions
    .filter(tx => tx.type === 'Virement sortant' || (tx.type === 'Paiement par carte' && tx.amount < 0)) // Example: include card payments as "sortant"
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleNewTransfer = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_virements_nouveau');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-theme-text">Historique des Virements Émis</h3>
        <button
          onClick={handleNewTransfer}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
          Effectuer un virement
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Bénéficiaire/Description</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Référence</th>
                <th scope="col" className="px-4 py-2 text-right text-xxs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th scope="col" className="px-4 py-2 text-center text-xxs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {outgoingTransfers.map((tx) => {
                let statusBadgeStyle = 'bg-gray-100 text-gray-700';
                if (tx.status === 'Effectué') statusBadgeStyle = 'bg-green-100 text-green-700';
                else if (tx.status === 'En attente') statusBadgeStyle = 'bg-yellow-100 text-yellow-700';
                else if (tx.status === 'Annulé' || tx.status === 'Rejeté') statusBadgeStyle = 'bg-red-100 text-red-700';
                
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3 text-xs text-theme-text">
                      <p className="font-medium truncate w-60" title={tx.thirdPartyName || tx.description}>{tx.thirdPartyName || tx.description}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">{tx.reference || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-right text-red-600">
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
        {outgoingTransfers.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">Aucun virement émis à afficher.</p>
        )}
      </div>
    </div>
  );
};

export default ProAccountTransferListPage;