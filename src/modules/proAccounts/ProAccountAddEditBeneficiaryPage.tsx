
import React, { useState, useEffect } from 'react';
import { ModuleComponentProps, Beneficiary, BeneficiaryFormData } from './types';
import { mockBeneficiaries } from './data'; 

const ProAccountAddEditBeneficiaryPage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId }) => {
  const [formData, setFormData] = useState<BeneficiaryFormData>({
    name: '',
    iban: '',
    bankName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [beneficiaryIdToEdit, setBeneficiaryIdToEdit] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Check activeSubPageId which might contain query-like params for editing
    let editIdFromSubPage: string | null = null;
    if (activeSubPageId && activeSubPageId.includes('?edit=')) {
        editIdFromSubPage = activeSubPageId.split('?edit=')[1];
    }
    
    // Fallback to URL query params if not in activeSubPageId (e.g. direct link)
    const queryParams = new URLSearchParams(window.location.search);
    const editIdFromQuery = queryParams.get('edit');
    
    const finalEditId = editIdFromSubPage || editIdFromQuery;

    if (finalEditId) {
        const beneficiaryToEdit = mockBeneficiaries.find(b => b.id === finalEditId);
        if (beneficiaryToEdit) {
            setFormData({
            name: beneficiaryToEdit.name,
            iban: beneficiaryToEdit.iban,
            bankName: beneficiaryToEdit.bankName || '',
            });
            setIsEditing(true);
            setBeneficiaryIdToEdit(finalEditId);
        } else {
            // Beneficiary ID from param not found, treat as new
            setIsEditing(false);
            setBeneficiaryIdToEdit(null);
            setFormData({ name: '', iban: '', bankName: '' });
        }
    } else {
        setIsEditing(false);
        setBeneficiaryIdToEdit(null);
        setFormData({ name: '', iban: '', bankName: '' });
    }
  }, [activeSubPageId]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const validateIBAN = (iban: string): boolean => {
    const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
    return ibanPattern.test(iban.replace(/\s/g, '').toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Le nom du bénéficiaire est requis.');
      return;
    }
    if (!validateIBAN(formData.iban)) {
      setFormError('Veuillez saisir un IBAN valide.');
      return;
    }

    if (isEditing && beneficiaryIdToEdit) {
      console.log('Updating Beneficiary:', beneficiaryIdToEdit, formData);
      const index = mockBeneficiaries.findIndex(b => b.id === beneficiaryIdToEdit);
      if (index !== -1) {
        mockBeneficiaries[index] = { ...mockBeneficiaries[index], ...formData };
      }
      alert(`Bénéficiaire ${formData.name} mis à jour.`);
    } else {
      const newBeneficiary: Beneficiary = {
        id: `ben-${Date.now()}`,
        ...formData,
        addedDate: new Date().toISOString().split('T')[0],
      };
      console.log('Adding New Beneficiary:', newBeneficiary);
      mockBeneficiaries.push(newBeneficiary); 
      alert(`Bénéficiaire ${formData.name} ajouté.`);
    }

    if (onSubNavigate) {
      onSubNavigate('comptes_pro_beneficiaires_liste'); 
    }
  };

  const handleCancel = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_beneficiaires_liste'); 
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-theme-text mb-6">
        {isEditing ? 'Modifier le bénéficiaire' : 'Ajouter un bénéficiaire'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-theme-text mb-1">
            Nom du bénéficiaire <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
            required
          />
        </div>
        <div>
          <label htmlFor="iban" className="block text-sm font-medium text-theme-text mb-1">
            IBAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="iban"
            name="iban"
            value={formData.iban}
            onChange={handleInputChange}
            placeholder="Ex: FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
            required
          />
        </div>
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-theme-text mb-1">
            Nom de la banque (optionnel)
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
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
            {isEditing ? 'Enregistrer les modifications' : 'Ajouter le bénéficiaire'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProAccountAddEditBeneficiaryPage;