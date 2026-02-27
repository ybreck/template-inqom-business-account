import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, Client } from '../../../types';
import { mockClients } from './data/clients';
// FIX: Replaced non-existent XCircleIcon with XMarkIcon
import { XMarkIcon, MagnifyingGlassIcon } from '../../constants/icons';

const VentesParametresPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  // Mock state for settings. In a real app, this would come from a context or API.
  const [isRemindersEnabled, setIsRemindersEnabled] = useState(true);
  const [reminderDelay, setReminderDelay] = useState(7);
  const [reminderTemplate, setReminderTemplate] = useState(
`Bonjour {customer_name},

Sauf erreur de notre part, nous n'avons pas reçu le paiement de la facture {invoice_number} d'un montant de {amount_due} €, qui était due le {due_date}.

Pourriez-vous s'il vous plaît procéder au règlement dans les plus brefs délais ?

Cordialement,
L'équipe de {my_company_name}`
  );
  const [excludedClientIds, setExcludedClientIds] = useState<string[]>(['client_2']);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  const handleSave = () => {
    const settings = { isRemindersEnabled, reminderDelay, reminderTemplate, excludedClientIds };
    console.log("Saving settings:", settings);
    alert("Paramètres de relance enregistrés (simulation).");
    onSubNavigate?.('ventes_facturation');
  };

  const handleCancel = () => {
    onSubNavigate?.('ventes_facturation');
  };
  
  const addExcludedClient = (clientId: string) => {
    if (!excludedClientIds.includes(clientId)) {
      setExcludedClientIds(prev => [...prev, clientId]);
    }
    setClientSearchTerm('');
  };

  const removeExcludedClient = (clientId: string) => {
    setExcludedClientIds(prev => prev.filter(id => id !== clientId));
  };

  const availableClientsToExclude = useMemo(() => {
    return mockClients.filter(
      client => !excludedClientIds.includes(client.id) && 
               client.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );
  }, [excludedClientIds, clientSearchTerm]);

  const excludedClients = useMemo(() => {
    return mockClients.filter(client => excludedClientIds.includes(client.id));
  }, [excludedClientIds]);

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-theme-text">Paramètres de Vente</h2>
            <div className="flex space-x-2">
                <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Annuler</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Enregistrer</button>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
             <nav className="flex space-x-1" aria-label="Tabs">
                <button
                    className="whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm border-theme-primary-500 text-theme-primary-600"
                    aria-current="page"
                >
                    Relances
                </button>
             </nav>
        </div>
      </div>
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Automatic Reminders Card */}
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-semibold">Relances automatiques</h3>
                <label htmlFor="reminder-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="reminder-toggle" className="sr-only" checked={isRemindersEnabled} onChange={() => setIsRemindersEnabled(!isRemindersEnabled)} />
                        <div className={`block w-14 h-8 rounded-full ${isRemindersEnabled ? 'bg-theme-primary-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isRemindersEnabled ? 'translate-x-6' : ''}`}></div>
                    </div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <label htmlFor="reminder-delay" className="block text-sm font-medium text-gray-700">Délai de relance</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="number"
                            name="reminder-delay"
                            id="reminder-delay"
                            className="block w-24 text-center p-2 border border-gray-300 rounded-l-md"
                            value={reminderDelay}
                            onChange={(e) => setReminderDelay(parseInt(e.target.value, 10) || 0)}
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            jours après l'échéance
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Nombre de jours après la date d'échéance pour envoyer l'e-mail.</p>
                </div>
                <div>
                    <label htmlFor="reminder-template" className="block text-sm font-medium text-gray-700">Template de l'e-mail de relance</label>
                    <textarea
                        id="reminder-template"
                        name="reminder-template"
                        rows={8}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        value={reminderTemplate}
                        onChange={(e) => setReminderTemplate(e.target.value)}
                    ></textarea>
                     <p className="mt-2 text-xs text-gray-500">Variables disponibles: {`{customer_name}, {invoice_number}, {due_date}, {amount_due}, {my_company_name}`}</p>
                </div>
            </div>
        </div>
        
        {/* Excluded Clients Card */}
        <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Clients exclus des relances</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label htmlFor="client-search" className="block text-sm font-medium text-gray-700 mb-1">Ajouter un client à la liste d'exclusion</label>
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            id="client-search"
                            placeholder="Rechercher un client..."
                            className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                            value={clientSearchTerm}
                            onChange={(e) => setClientSearchTerm(e.target.value)}
                        />
                    </div>
                    {clientSearchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {availableClientsToExclude.map(client => (
                                <div key={client.id} onClick={() => addExcludedClient(client.id)} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                                    {client.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Clients actuellement exclus ({excludedClients.length})</p>
                    <div className="mt-2 p-3 border rounded-md min-h-[100px] max-h-60 overflow-y-auto bg-slate-50 space-y-2">
                        {excludedClients.map(client => (
                            <div key={client.id} className="flex justify-between items-center bg-white p-2 rounded border">
                                <span className="text-sm">{client.name}</span>
                                <button onClick={() => removeExcludedClient(client.id)} className="text-red-500 hover:text-red-700">
                                    <XMarkIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VentesParametresPage;