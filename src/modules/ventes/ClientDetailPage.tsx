import React, { useState, useEffect } from 'react';
import { ModuleComponentProps, Client } from '../../../types';
import { mockClients } from './data/clients';
import { ArrowLeftIcon } from '../../constants/icons';

const emptyClient: Client = {
  id: 'new',
  name: '',
  type: 'Entreprise',
  siren: '',
  nic: '',
  vatNumber: '',
  reference: '',
  notes: '',
  address: {
    street: '',
    postalCode: '',
    city: '',
    region: '',
    country: 'France',
    hasDifferentDeliveryAddress: false,
  },
  primaryEmails: '',
  ccEmails: '',
  bccEmails: '',
  phone: '',
  paymentTerms: '30 jours',
  iban: '',
  bic: '',
  mandateType: 'Aucun',
  mandateRum: '',
  mandateSignatureDate: '',
  excludeFromReminders: false,
  invoiced: 0,
  paid: 0,
};

const ClientDetailPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [initialClient, setInitialClient] = useState<Client | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('client_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      if (id === 'new') {
        setInitialClient(emptyClient);
        setClient(emptyClient);
        setIsNew(true);
      } else {
        const foundClient = mockClients.find(c => c.id === id);
        if (foundClient) {
          setInitialClient(JSON.parse(JSON.stringify(foundClient))); // Deep copy
          setClient(JSON.parse(JSON.stringify(foundClient)));
          setIsNew(false);
        } else {
          setClient(null); // Not found
        }
      }
      setIsDirty(false); // Reset dirty state on new client load
    }
  }, [activeSubPageId]);

  useEffect(() => {
    if (client && initialClient) {
      setIsDirty(JSON.stringify(client) !== JSON.stringify(initialClient));
    }
  }, [client, initialClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setClient(prevClient => {
        if (!prevClient) return null;
        const keys = name.split('.');
        if (keys.length > 1) {
            // Handle nested state e.g. address.street
            let updatedClient = { ...prevClient };
            let nested = updatedClient as any;
            for(let i = 0; i < keys.length - 1; i++) {
                nested = nested[keys[i]];
            }
            nested[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
            return updatedClient;
        }
        
        if(name === 'excludeFromReminders') {
            return { ...prevClient, [name]: !checked };
        }

        return { ...prevClient, [name]: type === 'checkbox' ? checked : value };
    });
  };

  const handleSave = () => {
    if (!client) return;
    // Here you would typically call an API
    console.log("Saving client:", client);
    alert(`Client "${client.name}" sauvegardé (simulation).`);
    // After save, update initial state and go back to list
    setInitialClient(client);
    setIsDirty(false);
    onSubNavigate?.('clients');
  };

  const handleDelete = () => {
    if (client && window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.name}" ?`)) {
      console.log("Deleting client:", client.id);
      alert(`Client "${client.name}" supprimé (simulation).`);
      onSubNavigate?.('clients');
    }
  };

  if (!client) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Client non trouvé</h2>
        <button onClick={() => onSubNavigate?.('clients')} className="mt-4 text-theme-primary-500">Retour à la liste</button>
      </div>
    );
  }

  const PageTitle = () => (
    <div className="flex items-center space-x-3 mb-6">
      <button onClick={() => onSubNavigate?.('clients')} className="p-2 rounded-full hover:bg-gray-100">
        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
      </button>
      <h2 className="text-2xl font-semibold text-theme-text">{isNew ? 'Nouveau Client' : client.name}</h2>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <PageTitle />
      
      <div className="space-y-6">
        {/* Section Type */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">TYPE</h3>
          <div className="flex space-x-8">
            {(['Entreprise', 'Entreprise étrangère', 'Particulier'] as const).map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="type" value={type} checked={client.type === type} onChange={handleInputChange} className="h-4 w-4 text-theme-primary-600 focus:ring-theme-primary-500"/>
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Section Informations Générales */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">INFORMATIONS GÉNÉRALES</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4"><label className="text-xs text-gray-600">Raison sociale *</label><input type="text" name="name" value={client.name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">SIREN *</label><input type="text" name="siren" value={client.siren} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">NIC *</label><input type="text" name="nic" value={client.nic} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">N°TVA *</label><input type="text" name="vatNumber" value={client.vatNumber} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Référence</label><input type="text" name="reference" value={client.reference} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div className="md:col-span-4"><label className="text-xs text-gray-600">Remarque</label><textarea name="notes" value={client.notes} onChange={handleInputChange} rows={4} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
        </div>

        {/* Section Adresses */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">ADRESSES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><label className="text-xs text-gray-600">N° et nom de voie *</label><input type="text" name="address.street" value={client.address.street} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Code postal *</label><input type="text" name="address.postalCode" value={client.address.postalCode} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Ville *</label><input type="text" name="address.city" value={client.address.city} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Région / État</label><input type="text" name="address.region" value={client.address.region} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Pays *</label><input type="text" name="address.country" value={client.address.country} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <label htmlFor="delivery-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="delivery-toggle" name="address.hasDifferentDeliveryAddress" checked={client.address.hasDifferentDeliveryAddress} onChange={handleInputChange} className="sr-only"/>
                    <div className={`block w-10 h-6 rounded-full ${client.address.hasDifferentDeliveryAddress ? 'bg-theme-primary-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${client.address.hasDifferentDeliveryAddress ? 'translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm text-gray-700">Adresse de livraison différente</div>
            </label>
          </div>
        </div>

        {/* Section Contact */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">CONTACT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-600">E-mails principaux</label><textarea name="primaryEmails" value={client.primaryEmails} onChange={handleInputChange} rows={3} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">E-mails en copie</label><textarea name="ccEmails" value={client.ccEmails} onChange={handleInputChange} rows={3} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">E-mails en copie cachées</label><textarea name="bccEmails" value={client.bccEmails} onChange={handleInputChange} rows={3} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Téléphone</label><input type="text" name="phone" value={client.phone} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
        </div>

        {/* Section Paiement */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-sm font-medium text-gray-500 mb-4">PAIEMENT / FACTURATION</h3>
            <div>
                <label className="text-xs text-gray-600">Délai de paiement *</label>
                <select name="paymentTerms" value={client.paymentTerms} onChange={handleInputChange} className="w-full md:w-1/3 mt-1 p-2 border rounded-md">
                    <option>30 jours</option>
                    <option>60 jours</option>
                    <option>Comptant</option>
                    <option>Personnalisé</option>
                </select>
            </div>

            <div className="mt-6 border-t pt-4">
                 <h4 className="text-sm font-medium text-gray-500 mb-4">COORDONNÉES BANCAIRES</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs text-gray-600">IBAN</label><input type="text" name="iban" value={client.iban || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div><label className="text-xs text-gray-600">BIC</label><input type="text" name="bic" value={client.bic || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                 </div>
            </div>
             <div className="mt-6 border-t pt-4">
                 <h4 className="text-sm font-medium text-gray-500 mb-4">MANDAT DE PRÉLÈVEMENT SEPA</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-gray-600">Type de mandat</label>
                        <select name="mandateType" value={client.mandateType || 'Aucun'} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md">
                            <option value="Aucun">Aucun</option>
                            <option value="CORE">CORE</option>
                            <option value="B2B">B2B</option>
                        </select>
                    </div>
                    <div><label className="text-xs text-gray-600">RUM (Référence Unique de Mandat)</label><input type="text" name="mandateRum" value={client.mandateRum || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div><label className="text-xs text-gray-600">Date de signature</label><input type="date" name="mandateSignatureDate" value={client.mandateSignatureDate || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                 </div>
            </div>
            <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">RELANCES AUTOMATIQUES</h4>
                <label htmlFor="reminders-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            id="reminders-toggle" 
                            name="excludeFromReminders" 
                            checked={!client.excludeFromReminders} 
                            onChange={handleInputChange} 
                            className="sr-only"/>
                        <div className={`block w-10 h-6 rounded-full ${!client.excludeFromReminders ? 'bg-theme-primary-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${!client.excludeFromReminders ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm text-gray-700">Activer les relances pour ce client</div>
                </label>
            </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t flex justify-end items-center space-x-3">
        <button onClick={() => onSubNavigate?.('clients')} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Annuler</button>
        {!isNew && <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Supprimer le client</button>}
        <button onClick={handleSave} disabled={!isDirty} className="px-6 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Sauvegarder
        </button>
      </div>

    </div>
  );
};

export default ClientDetailPage;