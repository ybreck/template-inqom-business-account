import React from 'react';
import { ModuleComponentProps, NavItem } from '../../../types';
import ModuleTabs from '../../../components/ModuleTabs';
import PlaceholderPage from '../../../components/PlaceholderPage';
import DashboardPage from '../dashboard/DashboardPage'; 
import PrevisionnelTresoreriePage from './PrevisionnelTresoreriePage';
import SuiviParActivitePage from './SuiviParActivitePage';
import { 
  pilotageReelConfig,
  pilotagePrevisionnelConfig,
  pilotageSuiviActiviteConfig
} from './config';
import { QuestionMarkCircleIcon } from '../../constants/icons';

const PilotageModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate, activeBrand, themeColors }) => {
  
  const moduleTabs: NavItem[] = [
    pilotageReelConfig,
    pilotagePrevisionnelConfig,
    pilotageSuiviActiviteConfig
  ].map(config => ({
    id: config.id || '',
    name: config.title,
    icon: config.icon ? React.createElement(config.icon, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
  }));

  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { 
        onSubNavigate, 
        onMainNavigate, 
        activeSubPageId,
        activeBrand, 
        themeColors 
    };

    switch (activeSubPageId) {
        case pilotageReelConfig.id:
            return <DashboardPage {...propsForSubPages} />;
        case pilotagePrevisionnelConfig.id:
            return <PrevisionnelTresoreriePage {...propsForSubPages} />;
        case pilotageSuiviActiviteConfig.id:
            return <SuiviParActivitePage {...propsForSubPages} />;
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
        activeTabId={activeSubPageId || pilotageReelConfig.id || ''}
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

export default PilotageModulePage;