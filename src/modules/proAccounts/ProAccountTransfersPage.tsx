
import React, { useState } from 'react';
import { ModuleComponentProps, NewTransferFormData, Beneficiary, ProAccountDetails } from './types';
import { mockBeneficiaries, mockProAccountDetails } from './data';
import { ChevronDownIcon, CalendarDaysIcon, BanknotesIcon } from '../../../src/constants/icons';

const ProAccountTransfersPage: React.FC<ModuleComponentProps> = ({ onSubNavigate, onMainNavigate, activeSubPageId }) => {
  const [transferData, setTransferData] = useState<NewTransferFormData>({
    beneficiaryId: '',
    amount: '',
    executionDate: new Date().toISOString().split('T')[0],
    reference: '',
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const accountDetails: ProAccountDetails = mockProAccountDetails;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransferData(prev => ({ ...prev, [name]: value }));
    setFormError(null); 
  };

  const validateForm = (): boolean => {
    if (!transferData.beneficiaryId) {
      setFormError('Veuillez sélectionner un bénéficiaire.');
      return false;
    }
    const amount = parseFloat(transferData.amount as string);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Veuillez saisir un montant valide supérieur à zéro.');
      return false;
    }
    if (amount > accountDetails.balance && !accountDetails.overdraftLimit) { 
        console.warn("Le montant du virement dépasse le solde actuel (hors découvert autorisé).");
    }
    if (!transferData.executionDate) {
      setFormError('Veuillez sélectionner une date d\'exécution.');
      return false;
    }
    if (!transferData.reference.trim()) {
      setFormError('Veuillez saisir une référence pour le virement.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const selectedBeneficiary = mockBeneficiaries.find(b => b.id === transferData.beneficiaryId);
    const submissionData = {
      ...transferData,
      amount: parseFloat(transferData.amount as string),
      beneficiaryName: selectedBeneficiary?.name || 'N/A',
      beneficiaryIban: selectedBeneficiary?.iban || 'N/A',
      sourceAccountIban: accountDetails.iban,
    };

    console.log('Nouveau Virement Soumis:', submissionData);
    alert(`Virement de ${submissionData.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} vers ${submissionData.beneficiaryName} programmé pour le ${new Date(submissionData.executionDate).toLocaleDateString('fr-FR')}. Référence: ${submissionData.reference}`);
    
    setTransferData({
      beneficiaryId: '',
      amount: '',
      executionDate: new Date().toISOString().split('T')[0],
      reference: '',
      reason: '',
    });
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_virements'); // Navigate back to the main "Virements" tab (list)
    }
  };

  const handleCancel = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_virements'); // Navigate back to the main "Virements" tab (list)
    }
  };

  const formatCurrency = (value: number, currency: string = 'EUR') => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: currency });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-theme-text mb-2">Effectuer un virement</h2>
      <div className="mb-6 p-4 bg-theme-primary-50 rounded-lg border border-theme-primary-200">
        <p className="text-sm text-theme-primary-700 font-medium">Compte à débiter :</p>
        <p className="text-lg text-theme-primary-600 font-semibold">{accountDetails.accountName} ({accountDetails.iban})</p>
        <p className="text-sm text-theme-primary-500">Solde actuel : {formatCurrency(accountDetails.balance, accountDetails.currency)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="beneficiaryId" className="block text-sm font-medium text-theme-text mb-1">
            Bénéficiaire <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="beneficiaryId"
              name="beneficiaryId"
              value={transferData.beneficiaryId}
              onChange={handleInputChange}
              className="w-full appearance-none p-3 pr-10 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
              aria-required="true"
            >
              <option value="" disabled>Sélectionner un bénéficiaire</option>
              {mockBeneficiaries.map((beneficiary: Beneficiary) => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} - {beneficiary.iban}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-theme-text mb-1">
            Montant (EUR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BanknotesIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="number"
              id="amount"
              name="amount"
              value={transferData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
              aria-required="true"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="executionDate" className="block text-sm font-medium text-theme-text mb-1">
                Date d'exécution <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                 <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  id="executionDate"
                  name="executionDate"
                  value={transferData.executionDate}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                  aria-required="true"
                />
              </div>
            </div>
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-theme-text mb-1">
                Référence du virement <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={transferData.reference}
                onChange={handleInputChange}
                placeholder="Ex: Facture F2024-001"
                maxLength={35} 
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                aria-required="true"
              />
            </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-theme-text mb-1">
            Motif (optionnel)
          </label>
          <textarea
            id="reason"
            name="reason"
            value={transferData.reason}
            onChange={handleInputChange}
            rows={3}
            placeholder="Motif détaillé du virement (ex: Loyer Juillet)"
            maxLength={140} 
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 resize-none"
          />
        </div>

        {formError && (
          <div role="alert" className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {formError}
          </div>
        )}

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
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary-400"
          >
            Valider le virement
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProAccountTransfersPage;