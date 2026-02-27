import React from 'react';
import { BankTransaction } from '../types';
import { PaperclipIcon } from '../../../constants/icons';

interface BankTransactionCardProps {
  transaction: BankTransaction;
}

const formatCurrency = (amount: number) => {
  const formatted = Math.abs(amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return formatted;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const BankTransactionCard: React.FC<BankTransactionCardProps> = ({ transaction }) => {
  const amountColor = transaction.amount >= 0 ? 'text-theme-text' : 'text-red-600';

  const renderAction = () => {
    switch (transaction.status) {
      case 'Justifié':
        return (
          <button className="p-2 text-gray-400 hover:text-theme-primary-500" title="Justificatif joint">
            <PaperclipIcon className="w-5 h-5 mx-auto" />
          </button>
        );
      case 'À justifier':
      case 'Partiellement justifié':
        return (
          <button className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md border border-yellow-300 transition-colors">
            Justifier
          </button>
        );
      default:
        return null; // Don't render anything if no specific action
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-theme-secondary-gray-200">
      <div className="p-3 flex items-center justify-between">
        {/* Left Side: Info */}
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-semibold text-theme-text truncate" title={transaction.description}>
            {transaction.description}
          </p>
          {transaction.paymentMethod && (
            <p className="text-sm text-gray-500 truncate" title={transaction.paymentMethod}>
                {transaction.paymentMethod}
            </p>
          )}
        </div>

        {/* Right Side: Amount & Action */}
        <div className="flex items-center space-x-4">
            <div className="w-24 text-center">
                {renderAction()}
            </div>
            <div className="text-right w-28">
              <p className={`text-lg font-bold ${amountColor}`}>
                {transaction.amount < 0 && '-'}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(transaction.date)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransactionCard;