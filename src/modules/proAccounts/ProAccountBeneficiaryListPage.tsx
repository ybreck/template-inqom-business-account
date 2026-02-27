
import React, { useState } from 'react';
import { ModuleComponentProps, Beneficiary } from './types';
import { mockBeneficiaries } from './data';
import { UserPlusIcon, PencilIcon, TrashIcon } from '../../../src/constants/icons';

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProAccountBeneficiaryListPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);

  const handleAddBeneficiary = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_beneficiaire_form'); 
    }
  };

  const handleEditBeneficiary = (beneficiaryId: string) => {
    if (onSubNavigate) {
      onSubNavigate(`comptes_pro_beneficiaire_form?edit=${beneficiaryId}`); 
    }
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?")) {
      setBeneficiaries(prev => prev.filter(b => b.id !== beneficiaryId));
      console.log(`Beneficiary ${beneficiaryId} deleted (mock).`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-theme-text">Gestion des Bénéficiaires</h3>
        <button
          onClick={handleAddBeneficiary}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Ajouter un bénéficiaire
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">IBAN</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Banque</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Date d'ajout</th>
                <th scope="col" className="px-4 py-2 text-center text-xxs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-theme-text">{beneficiary.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{beneficiary.iban}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{beneficiary.bankName || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(beneficiary.addedDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center space-x-2">
                    <button
                      onClick={() => handleEditBeneficiary(beneficiary.id)}
                      className="text-theme-primary-600 hover:text-theme-primary-800 p-1"
                      title="Modifier le bénéficiaire"
                      aria-label={`Modifier ${beneficiary.name}`}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Supprimer le bénéficiaire"
                      aria-label={`Supprimer ${beneficiary.name}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {beneficiaries.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">Aucun bénéficiaire enregistré.</p>
        )}
      </div>
    </div>
  );
};

export default ProAccountBeneficiaryListPage;