
import React from 'react';
import { ModuleComponentProps, NavItem } from '../../../types';
import ModuleTabs from '../../../components/ModuleTabs';
import PlaceholderPage from '../../../components/PlaceholderPage';
import { 
  etatsConfig,
  compteDeResultatConfig,
  plaquetteConfig
} from './config';
import { QuestionMarkCircleIcon } from '../../constants/icons';

const EtatsComptablesModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  
  const moduleTabs: NavItem[] = [
    etatsConfig,
    compteDeResultatConfig,
    plaquetteConfig
  ].map(config => ({
    id: config.id || '',
    name: config.title,
    icon: config.icon ? React.createElement(config.icon, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
  }));

  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { onSubNavigate, onMainNavigate, activeSubPageId };
    
    let currentConfig;
    switch (activeSubPageId) {
      case etatsConfig.id:
        currentConfig = etatsConfig;
        break;
      case compteDeResultatConfig.id:
        currentConfig = compteDeResultatConfig;
        break;
      case plaquetteConfig.id:
        currentConfig = plaquetteConfig;
        break;
      default:
        return <PlaceholderPage 
                  title="Onglet non trouvé" 
                  icon={<QuestionMarkCircleIcon />} 
                  description="Le contenu de cet onglet n'est pas disponible." />;
    }
    
    return <PlaceholderPage 
              title={currentConfig.title} 
              icon={currentConfig.icon ? React.createElement(currentConfig.icon) : undefined}
              description={currentConfig.description} />;
  };
  
  return (
    <div className="flex flex-col h-full">
      <ModuleTabs
        tabs={moduleTabs}
        activeTabId={activeSubPageId || etatsConfig.id || ''}
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

export default EtatsComptablesModulePage;
