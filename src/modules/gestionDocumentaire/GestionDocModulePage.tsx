

import React from 'react';
import { ModuleComponentProps, NavItem } from '../../../types';
import ModuleTabs from '../../../components/ModuleTabs';
import PlaceholderPage from '../../../components/PlaceholderPage';
import ClasserDocsPage from './ClasserDocsPage'; // This file now contains the new MesDocumentsPage logic
import CoffreFortPage from './CoffreFortPage';
import { 
  mesDocumentsConfig,
  gestionDocCoffreFortConfig
} from './config';
import { QuestionMarkCircleIcon } from '../../constants/icons';

const GestionDocModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  
  const moduleTabs: NavItem[] = [
    mesDocumentsConfig,
    gestionDocCoffreFortConfig
  ].map(config => ({
    id: config.id || '',
    name: config.title,
    icon: config.icon ? React.createElement(config.icon, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />,
    badge: config.id === 'mes_documents' ? 16 : undefined 
  }));

  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { onSubNavigate, onMainNavigate, activeSubPageId };
    
    switch (activeSubPageId) {
      case mesDocumentsConfig.id:
        return <ClasserDocsPage {...propsForSubPages} />;
        
      case gestionDocCoffreFortConfig.id:
        return <CoffreFortPage {...propsForSubPages} />;
                  
      default:
        // Default to "Mes documents" if sub-page ID is invalid for this module
        return <ClasserDocsPage {...propsForSubPages} />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ModuleTabs
        tabs={moduleTabs}
        activeTabId={activeSubPageId || mesDocumentsConfig.id || ''}
        onTabClick={(tabId) => {
          if (onSubNavigate) {
            onSubNavigate(tabId);
          }
        }}
      />
      <div className="flex-1 pt-0 p-6">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default GestionDocModulePage;