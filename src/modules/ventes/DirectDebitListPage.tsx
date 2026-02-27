import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, DirectDebitBatch, DirectDebitStatus } from '../../../types';
import { mockDirectDebits } from './data/directDebits';
import { mockBankAccounts } from './data/quotes';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon } from '../../constants/icons';

interface DirectDebitListPageProps extends ModuleComponentProps {}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString.replace(/-/g, '/'));
  return dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

const getStatusBadgeStyle = (status: DirectDebitStatus): string => {
  switch (status) {
    case 'Prélevé':
      return 'bg-green-100 text-green-700';
    case 'En préparation':
      return 'bg-cyan-100 text-cyan-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const DirectDebitListPage: React.FC<DirectDebitListPageProps> = ({ onSubNavigate }) => {
  const [debitBatches] = useState<DirectDebitBatch[]>(mockDirectDebits);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebitBatches = useMemo(() => {
    return debitBatches.filter(batch => {
      const searchTermLower = searchTerm.toLowerCase();
      const bankAccount = mockBankAccounts.find(b => b.id === batch.destinationAccountId);
      const bankInfo = bankAccount ? `${bankAccount.bankName} (...${bankAccount.iban.slice(-4)})` : 'Compte inconnu';

      return (
        searchTermLower === '' ||
        batch.name.toLowerCase().includes(searchTermLower) ||
        bankInfo.toLowerCase().includes(searchTermLower)
      );
    });
  }, [debitBatches, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-theme-text">Prélèvements Clients</h2>
        <button
          onClick={() => onSubNavigate?.('direct_debit_editor?id=new')}
          className="flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-1.5" />
          Nouveau prélèvement
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher par nom, banque..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="space-y-3">
        {filteredDebitBatches.map(batch => {
            const bankAccount = mockBankAccounts.find(b => b.id === batch.destinationAccountId);
            const bankInfo = bankAccount ? `${bankAccount.bankName} (...${bankAccount.iban.slice(-4)})` : 'Compte inconnu';
            return (
              <div
                key={batch.id}
                onClick={() => onSubNavigate?.(`direct_debit_detail?id=${batch.id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-theme-secondary-gray-200 cursor-pointer"
              >
                <div className="p-4 flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-semibold text-theme-text">
                          {batch.name} <span className="text-gray-500 font-normal">{bankInfo}</span>
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeStyle(batch.status)}`}>
                                {batch.status}
                            </span>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        <div>
                            <p className="text-xs text-gray-500">Montant TTC</p>
                            <p className="text-lg font-bold text-theme-text">{formatCurrency(batch.totalAmountTTC)}</p>
                        </div>
                         {batch.status === 'En préparation' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSubNavigate?.(`direct_debit_editor?id=${batch.id}`);
                                }}
                                className="p-2 text-gray-400 hover:text-theme-primary-500 rounded-full hover:bg-gray-100"
                                title="Éditer le lot"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 px-2 py-1 rounded-md">
                                Nbr. de factures <strong className="font-semibold">{String(batch.invoiceCount).padStart(3, '0')}</strong>
                            </span>
                            <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 px-2 py-1 rounded-md">
                                Création <strong className="font-semibold">{formatDate(batch.creationDate)}</strong>
                            </span>
                            {batch.debitDate && (
                                <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 px-2 py-1 rounded-md">
                                    Prélèvement <strong className="font-semibold">{formatDate(batch.debitDate)}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        })}
        {filteredDebitBatches.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                Aucun prélèvement ne correspond à vos critères.
            </div>
        )}
      </div>
    </div>
  );
};

export default DirectDebitListPage;