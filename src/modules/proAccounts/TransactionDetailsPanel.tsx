import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ProAccountTransaction } from './types';

interface TransactionDetailsPanelProps {
  transaction: ProAccountTransaction | null;
  onClose: () => void;
  isTransfer?: boolean;
}

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const TransactionDetailsPanel: React.FC<TransactionDetailsPanelProps> = ({ transaction, onClose, isTransfer = false }) => {
  const [displayTx, setDisplayTx] = useState<ProAccountTransaction | null>(transaction);

  useEffect(() => {
    if (transaction) {
      setDisplayTx(transaction);
    }
  }, [transaction]);

  const isDebit = displayTx ? displayTx.amount < 0 : false;
  const beneficiary = displayTx ? (isDebit ? (displayTx.beneficiaryName || displayTx.thirdPartyName || 'Inconnu') : 'Yann Breck') : '';
  const emitter = displayTx ? (isDebit ? 'Yann Breck' : (displayTx.thirdPartyName || 'Inconnu')) : '';

  return (
    <div 
      className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
        transaction ? 'w-[424px] pl-6 opacity-100' : 'w-0 pl-0 opacity-0'
      }`}
    >
      <div className="w-[400px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-semibold text-slate-900">{displayTx?.description}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Nom du virement</p>
            <p className="text-sm text-slate-600">{displayTx?.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">{isDebit ? 'Bénéficiaire' : 'Émetteur'}</p>
            <p className="text-sm text-slate-600">{isDebit ? beneficiary : emitter}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">IBAN</p>
            <p className="text-sm text-slate-600 font-mono">{displayTx?.thirdPartyIban || 'Non renseigné'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Méthode de paiement</p>
            <p className="text-sm text-slate-600">{displayTx?.type}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Date de virement</p>
            <p className="text-sm text-slate-600">{displayTx ? formatDate(displayTx.date) : ''}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Virement instantané</p>
            <p className="text-sm text-slate-600">Non</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Montant</p>
            <p className="text-sm text-slate-600">{displayTx ? formatCurrency(displayTx.amount) : ''}</p>
          </div>
        </div>

        {/* Footer (only for transfers) */}
        {isTransfer && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
            <button className="w-full bg-theme-primary-600 hover:bg-theme-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
              Télécharger une confirmation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsPanel;
