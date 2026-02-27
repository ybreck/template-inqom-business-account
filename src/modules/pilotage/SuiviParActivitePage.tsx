import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, Activity } from './types';
import { mockActivities, mockActivityClients, mockKpisByActivity } from './data';
import { ChevronDownIcon, PlusIcon, UserGroupIcon, CogIcon } from '../../constants/icons';

const SuiviParActivitePage: React.FC<ModuleComponentProps> = ({ themeColors }) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>(mockActivities[0]?.id || '');

  const selectedActivity = useMemo(
    () => mockActivities.find(a => a.id === selectedActivityId),
    [selectedActivityId]
  );

  const clientsForActivity = useMemo(
    () => mockActivityClients[selectedActivityId] || [],
    [selectedActivityId]
  );
  
  const kpisForActivity = useMemo(() => {
    if (!selectedActivityId) return [];

    const activityData = mockKpisByActivity[selectedActivityId] || { ca: 0, nbFactures: 0, retard: 0, facturesRetard: 0 };
    
    // Generate some dynamic change data for realism
    const getChangePercent = () => ({
        change: `${(Math.random() * 10 - 4).toFixed(1)}%`,
        changeType: Math.random() > 0.5 ? 'positive' : 'negative'
    });
    
    const getChangeCount = () => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return {
            change: `${change >= 0 ? '+' : ''}${change}`,
            changeType: change > 0 ? 'positive' as const : (change < 0 ? 'negative' as const : 'neutral' as const)
        };
    };

    return [
      { title: "Chiffre d'Affaires", value: `${activityData.ca.toLocaleString('fr-FR')} €`, ...getChangePercent() },
      { title: "Nombre de factures", value: activityData.nbFactures.toString(), ...getChangeCount() },
      { title: "Factures en retard", value: `${activityData.retard.toLocaleString('fr-FR')} €`, change: `${activityData.facturesRetard} factures`, changeType: 'neutral' as const },
      { title: "Clients Actifs", value: clientsForActivity.length.toString(), change: '', changeType: 'neutral' as const },
    ];
  }, [selectedActivityId, clientsForActivity]);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
        <div>
            <h2 className="text-2xl font-semibold text-theme-text">Suivi par Activité</h2>
            <p className="text-sm text-gray-500">Analysez la performance par secteur d'activité.</p>
        </div>
        <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 text-sm font-semibold text-theme-primary-600 bg-theme-primary-100 rounded-md hover:bg-theme-primary-200">
                <PlusIcon className="w-4 h-4 mr-2" />
                Nouvelle Activité
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                <CogIcon className="w-4 h-4 mr-2" />
                Gérer les Activités
            </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <label htmlFor="activity-select" className="block text-sm font-medium text-gray-700 mb-1">
          Sélectionnez une activité à analyser :
        </label>
        <div className="relative">
          <select
            id="activity-select"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full appearance-none p-3 pr-10 border border-gray-300 rounded-md shadow-sm text-base focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500"
          >
            {mockActivities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpisForActivity.map(kpi => (
              <div key={kpi.title} className="bg-white p-5 rounded-xl shadow-lg">
                  <h3 className="text-sm font-medium text-gray-500 truncate">{kpi.title}</h3>
                  <p className="mt-1 text-3xl font-semibold text-theme-text">{kpi.value}</p>
                   {kpi.change && (
                       <p className={`mt-1 text-xs ${kpi.changeType === 'positive' ? 'text-green-600' : kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
                           {kpi.change}
                       </p>
                   )}
              </div>
          ))}
      </div>
      
       <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-theme-text">Clients associés à "{selectedActivity?.name}"</h3>
                <button className="text-sm text-theme-primary-500 hover:underline">Gérer les clients</button>
            </div>
             <div className="max-h-60 overflow-y-auto pr-2">
                <ul className="divide-y divide-gray-200">
                    {clientsForActivity.map(client => (
                        <li key={client.id} className="py-3 flex items-center space-x-3">
                            <div className="w-8 h-8 bg-theme-secondary-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-theme-secondary-gray-600">
                                {client.name.substring(0,2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-theme-text">{client.name}</span>
                        </li>
                    ))}
                </ul>
                {clientsForActivity.length === 0 && (
                     <p className="text-sm text-gray-500 text-center py-4">Aucun client n'est associé à cette activité.</p>
                )}
             </div>
       </div>
    </div>
  );
};

export default SuiviParActivitePage;