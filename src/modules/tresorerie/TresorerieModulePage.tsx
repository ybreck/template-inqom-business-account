
import React from 'react';
import { ModuleComponentProps, NavItem } from '../../../types';
import ModuleTabs from '../../../components/ModuleTabs';
import PlaceholderPage from '../../../components/PlaceholderPage';
import BankPage from '../bank/BankPage';
import FinancingTablePage from '../financingTable/FinancingTablePage';

import { 
  tresorerieBanqueConfig,
  tresorerieTableauFinancementConfig,
  tresorerieEncaissementDecaissementConfig,
  tresoreriePrevisionsConfig
} from './config';
import { QuestionMarkCircleIcon } from '../../constants/icons';

const TresorerieModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  
  const moduleTabs: NavItem[] = [
    tresorerieBanqueConfig,
    tresorerieTableauFinancementConfig,
    tresorerieEncaissementDecaissementConfig,
    tresoreriePrevisionsConfig
  ].map(config => ({
    id: config.id || '',
    name: config.title,
    icon: config.icon ? React.createElement(config.icon, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
  }));

  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { onSubNavigate, onMainNavigate, activeSubPageId };
    switch (activeSubPageId) {
      case tresorerieBanqueConfig.id:
        return <BankPage {...propsForSubPages} />;
      case tresorerieTableauFinancementConfig.id:
        return <FinancingTablePage {...propsForSubPages} />;
      case tresorerieEncaissementDecaissementConfig.id:
        return <PlaceholderPage 
                  title={tresorerieEncaissementDecaissementConfig.title} 
                  icon={tresorerieEncaissementDecaissementConfig.icon ? React.createElement(tresorerieEncaissementDecaissementConfig.icon) : undefined}
                  description={tresorerieEncaissementDecaissementConfig.description} />;
      case tresoreriePrevisionsConfig.id:
        return <PlaceholderPage 
                  title={tresoreriePrevisionsConfig.title} 
                  icon={tresoreriePrevisionsConfig.icon ? React.createElement(tresoreriePrevisionsConfig.icon) : undefined}
                  description={tresoreriePrevisionsConfig.description} />;
      default:
        return <PlaceholderPage 
                  title="Onglet non trouvé" 
                  icon={<QuestionMarkCircleIcon />} 
                  description="Le contenu de cet onglet n'est pas disponible." />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ModuleTabs
        tabs={moduleTabs}
        activeTabId={activeSubPageId || tresorerieBanqueConfig.id || ''}
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

export default TresorerieModulePage;
