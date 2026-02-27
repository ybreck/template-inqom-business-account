import React, { useState, useEffect } from 'react';
import { ModuleComponentProps, Supplier } from '../../../types';
import { mockSuppliers } from './data/suppliers';
import { ArrowLeftIcon } from '../../constants/icons';

const emptySupplier: Supplier = {
  id: 'new',
  name: '',
  type: 'Entreprise',
  siren: '',
  reference: '',
  notes: '',
  address: {
    street: '',
    postalCode: '',
    city: '',
    country: 'France',
  },
  primaryEmails: '',
  phone: '',
  paymentTerms: '30 jours',
  iban: '',
  bic: '',
  due: 0,
  paid: 0,
};

const SupplierDetailPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [initialSupplier, setInitialSupplier] = useState<Supplier | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('supplier_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      if (id === 'new') {
        setInitialSupplier(emptySupplier);
        setSupplier(emptySupplier);
        setIsNew(true);
      } else {
        const foundSupplier = mockSuppliers.find(s => s.id === id);
        if (foundSupplier) {
          setInitialSupplier(JSON.parse(JSON.stringify(foundSupplier))); // Deep copy
          setSupplier(JSON.parse(JSON.stringify(foundSupplier)));
          setIsNew(false);
        } else {
          setSupplier(null); // Not found
        }
      }
      setIsDirty(false); // Reset dirty state on new supplier load
    }
  }, [activeSubPageId]);

  useEffect(() => {
    if (supplier && initialSupplier) {
      setIsDirty(JSON.stringify(supplier) !== JSON.stringify(initialSupplier));
    }
  }, [supplier, initialSupplier]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupplier(prevSupplier => {
        if (!prevSupplier) return null;
        const keys = name.split('.');
        if (keys.length > 1) {
            let updatedSupplier = { ...prevSupplier };
            let nested = updatedSupplier as any;
            for(let i = 0; i < keys.length - 1; i++) {
                nested = nested[keys[i]];
            }
            nested[keys[keys.length - 1]] = value;
            return updatedSupplier;
        }
        return { ...prevSupplier, [name]: value };
    });
  };

  const handleSave = () => {
    if (!supplier) return;
    console.log("Saving supplier:", supplier);
    alert(`Fournisseur "${supplier.name}" sauvegardé (simulation).`);
    setInitialSupplier(supplier);
    setIsDirty(false);
    onSubNavigate?.('fournisseurs');
  };

  const handleDelete = () => {
    if (supplier && window.confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur "${supplier.name}" ?`)) {
      console.log("Deleting supplier:", supplier.id);
      alert(`Fournisseur "${supplier.name}" supprimé (simulation).`);
      onSubNavigate?.('fournisseurs');
    }
  };

  if (!supplier) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Fournisseur non trouvé</h2>
        <button onClick={() => onSubNavigate?.('fournisseurs')} className="mt-4 text-theme-primary-500">Retour à la liste</button>
      </div>
    );
  }

  const PageTitle = () => (
    <div className="flex items-center space-x-3 mb-6">
      <button onClick={() => onSubNavigate?.('fournisseurs')} className="p-2 rounded-full hover:bg-gray-100">
        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
      </button>
      <h2 className="text-2xl font-semibold text-theme-text">{isNew ? 'Nouveau Fournisseur' : supplier.name}</h2>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <PageTitle />
      
      <div className="space-y-6">
        {/* Section Informations Générales */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">INFORMATIONS GÉNÉRALES</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4"><label className="text-xs text-gray-600">Raison sociale *</label><input type="text" name="name" value={supplier.name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">SIREN *</label><input type="text" name="siren" value={supplier.siren} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Référence</label><input type="text" name="reference" value={supplier.reference} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div className="md:col-span-4"><label className="text-xs text-gray-600">Remarque</label><textarea name="notes" value={supplier.notes} onChange={handleInputChange} rows={4} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
        </div>

        {/* Section Adresses */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">ADRESSE</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><label className="text-xs text-gray-600">N° et nom de voie *</label><input type="text" name="address.street" value={supplier.address.street} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Code postal *</label><input type="text" name="address.postalCode" value={supplier.address.postalCode} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Ville *</label><input type="text" name="address.city" value={supplier.address.city} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Pays *</label><input type="text" name="address.country" value={supplier.address.country} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
        </div>

        {/* Section Contact */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">CONTACT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-600">E-mails principaux</label><input type="text" name="primaryEmails" value={supplier.primaryEmails} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Téléphone</label><input type="text" name="phone" value={supplier.phone} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
        </div>

        {/* Section Paiement */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-sm font-medium text-gray-500 mb-4">PAIEMENT / FACTURATION</h3>
            <div>
                <label className="text-xs text-gray-600">Délai de paiement *</label>
                <select name="paymentTerms" value={supplier.paymentTerms} onChange={handleInputChange} className="w-full md:w-1/3 mt-1 p-2 border rounded-md">
                    <option>30 jours</option>
                    <option>45 jours fin de mois</option>
                    <option>60 jours</option>
                    <option>Comptant</option>
                    <option>Personnalisé</option>
                </select>
            </div>
            <div className="mt-6 border-t pt-4">
                 <h4 className="text-sm font-medium text-gray-500 mb-4">COORDONNÉES BANCAIRES</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs text-gray-600">IBAN</label><input type="text" name="iban" value={supplier.iban || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div><label className="text-xs text-gray-600">BIC</label><input type="text" name="bic" value={supplier.bic || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                 </div>
            </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t flex justify-end items-center space-x-3">
        <button onClick={() => onSubNavigate?.('fournisseurs')} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Annuler</button>
        {!isNew && <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Supprimer le fournisseur</button>}
        <button onClick={handleSave} disabled={!isDirty} className="px-6 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default SupplierDetailPage;