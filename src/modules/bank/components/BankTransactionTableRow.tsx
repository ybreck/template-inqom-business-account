import React from 'react';
import { BankTransaction } from '../types';
import { ListBulletIcon } from '../icons'; // Module-specific icons
import { PaperclipIcon } from '../../../constants/icons'; 

interface BankTransactionTableRowProps {
  transaction: BankTransaction;
}

const formatCurrency = (amount: number) => {
  const formatted = amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  return amount > 0 ? `+${formatted}` : formatted;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const BankTransactionTableRow: React.FC<BankTransactionTableRowProps> = ({ transaction }) => {
  const statusStyle = transaction.status === 'Justifié' 
    ? 'bg-green-100 text-green-700' 
    : transaction.status === 'À justifier'
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-gray-100 text-gray-700';

  const amountColor = transaction.amount >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{formatDate(transaction.date)}</td>
      <td className="px-4 py-3 text-xs">
        <div className="font-medium text-theme-text">{transaction.description}</div>
        {transaction.paymentMethod && (
            <div className="text-gray-500">{transaction.paymentMethod}</div>
        )}
      </td>
      <td className={`px-4 py-3 whitespace-nowrap text-xs font-medium text-right ${amountColor}`}>
        {formatCurrency(transaction.amount)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs">
        {transaction.status && (
          <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${statusStyle}`}>
            {transaction.status}
          </span>
        )}
        {!transaction.status && <span className="text-gray-400">-</span>}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
        {transaction.analyticalCode || <span className="text-gray-400">-</span>}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-20 text-center">
                {transaction.status === 'Justifié' && (
                    <button className="text-gray-400 hover:text-theme-primary-500 p-1" title="Justificatif joint">
                        <PaperclipIcon className="w-5 h-5 mx-auto" />
                    </button>
                )}
                {(transaction.status === 'À justifier' || transaction.status === 'Partiellement justifié') && (
                    <button className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md border border-yellow-300 transition-colors">
                        Justifier
                    </button>
                )}
            </div>
            <button className="text-gray-400 hover:text-theme-primary-500 p-1" title="Options"> 
              <ListBulletIcon className="w-4 h-4" />
            </button>
        </div>
      </td>
    </tr>
  );
};

export default BankTransactionTableRow;