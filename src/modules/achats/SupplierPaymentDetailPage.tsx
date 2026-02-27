import React, { useEffect, useState } from 'react';
import { ModuleComponentProps, SupplierPaymentBatch } from '../../../types';
import { mockSupplierPayments } from './data/supplierPayments';
import { mockBankAccounts } from '../ventes/data/quotes';
import { ArrowLeftIcon, PencilIcon } from '../../constants/icons';

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

const SupplierPaymentDetailPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [batch, setBatch] = useState<SupplierPaymentBatch | null>(null);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('supplier_payment_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      const foundBatch = mockSupplierPayments.find(b => b.id === id);
      setBatch(foundBatch || null);
    }
  }, [activeSubPageId]);

  if (!batch) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p>Lot de paiement non trouvé.</p>
        <button onClick={() => onSubNavigate?.('paiements_fournisseurs')} className="mt-4 text-theme-primary-500">Retour</button>
      </div>
    );
  }

  const bankAccount = mockBankAccounts.find(b => b.id === batch.sourceAccountId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <button onClick={() => onSubNavigate?.('paiements_fournisseurs')} className="flex items-center text-sm font-medium text-theme-primary-600 hover:underline mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Retour à la liste
            </button>
            <h2 className="text-3xl font-semibold text-theme-text">{batch.name}</h2>
            <p className="text-gray-500">Statut : {batch.status}</p>
        </div>
        {batch.status === 'En préparation' && (
            <button
                onClick={() => onSubNavigate?.(`supplier_payment_editor?id=${batch.id}`)}
                className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600"
            >
                <PencilIcon className="w-4 h-4 mr-2" />
                Éditer
            </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><p className="text-xs text-gray-500">Date de création</p><p className="font-semibold">{formatDate(batch.creationDate)}</p></div>
        <div><p className="text-xs text-gray-500">Date de paiement</p><p className="font-semibold">{formatDate(batch.paymentDate)}</p></div>
        <div><p className="text-xs text-gray-500">Compte source</p><p className="font-semibold">{bankAccount ? `${bankAccount.bankName} (...${bankAccount.iban.slice(-4)})` : 'N/A'}</p></div>
        <div><p className="text-xs text-gray-500">Factures</p><p className="font-semibold">{batch.invoiceCount}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-gray-500">Montant total</p><p className="font-semibold text-xl text-theme-primary-600">{formatCurrency(batch.totalAmountTTC)}</p></div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-theme-text mb-4">Factures incluses dans ce lot</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">N° Facture</th>
                <th className="px-4 py-2 text-left">Fournisseur</th>
                <th className="px-4 py-2 text-left">Échéance</th>
                <th className="px-4 py-2 text-right">Montant Total</th>
                <th className="px-4 py-2 text-right">Montant à payer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batch.invoices.map(invoice => (
                <tr key={invoice.invoiceId}>
                  <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-3">{invoice.supplierName}</td>
                  <td className="px-4 py-3">{formatDate(invoice.dueDate)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(invoice.totalAmount)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(invoice.amountToPay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierPaymentDetailPage;
