
import React from 'react';
import { ModuleComponentProps } from '../../../types';

const ParametresPage: React.FC<ModuleComponentProps> = ({ isDafViewEnabled, onToggleDafView }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-theme-text">Paramètres de l'entreprise</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-theme-text mb-4">Préférences d'affichage</h3>
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div>
            <label htmlFor="daf-view-toggle" className="font-medium text-theme-text">Activer la vue DAF</label>
            <p className="text-sm text-gray-500 mt-1">Affiche le sélecteur COMPTA / GESTION dans le menu latéral pour les utilisateurs avancés.</p>
          </div>
          <button
            id="daf-view-toggle"
            role="switch"
            aria-checked={isDafViewEnabled}
            onClick={onToggleDafView}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary-500 ${isDafViewEnabled ? 'bg-theme-primary-500' : 'bg-gray-200'}`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isDafViewEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;
