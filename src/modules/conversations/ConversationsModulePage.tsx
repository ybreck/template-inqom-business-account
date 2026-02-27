
import React from 'react';
import { ModuleComponentProps, NavItem } from '../../../types';
import ModuleTabs from '../../../components/ModuleTabs';
import ConversationsPage from './ConversationsPage';
import ActionsAFairePage from './ActionsAFairePage';
import { ChatBubbleLeftRightIcon, ClipboardAlertIcon, QuestionMarkCircleIcon } from '../../constants/icons';

const ConversationsModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate, activeBrand, themeColors }) => {
  
  const internalTabs: NavItem[] = [
    {
      id: 'conversations_chat', // Unique ID for this tab within the module
      name: 'Messagerie',
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    },
    {
      id: 'conversations_actions_a_faire', // Unique ID for this tab
      name: 'Actions à faire',
      icon: <ClipboardAlertIcon className="w-5 h-5" />,
    }
  ];

  // Determine which internal tab is active based on activeSubPageId from App.tsx
  let currentInternalTabId = internalTabs[0].id; // Default to chat
  if (activeSubPageId) {
    if (activeSubPageId.startsWith('conversations_actions_a_faire')) {
      currentInternalTabId = 'conversations_actions_a_faire';
    } else if (activeSubPageId.startsWith('conversations_chat')) {
      currentInternalTabId = 'conversations_chat';
    }
    // If activeSubPageId is just 'conversations', it defaults to 'conversations_chat'
  }


  const handleInternalTabClick = (tabId: string) => {
    if (onSubNavigate) {
      // Pass the full tabId (which includes parameters if any, like itemId for actions_a_faire)
      // For simple tab switches without specific item IDs, just the base tabId is fine.
      // If navigating from elsewhere (e.g. Accueil) specifies an item, that activeSubPageId will be used.
      // If user clicks a tab directly, it should go to the base view of that tab.
      onSubNavigate(tabId);
    }
  };
  
  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { 
        onSubNavigate, 
        onMainNavigate, 
        activeSubPageId, // Pass the full activeSubPageId from App.tsx
        activeBrand, 
        themeColors 
    };

    if (currentInternalTabId === 'conversations_actions_a_faire') {
      return <ActionsAFairePage {...propsForSubPages} />;
    }
    // Default to ConversationsPage (chat)
    return <ConversationsPage {...propsForSubPages} />;
  };
  
  return (
    <div className="flex flex-col h-full">
      <ModuleTabs
        tabs={internalTabs}
        activeTabId={currentInternalTabId}
        onTabClick={handleInternalTabClick}
      />
      {/* The padding and flex-1 will be handled by the child pages (ConversationsPage, ActionsAFairePage) */}
      {renderActiveTabContent()}
    </div>
  );
};

export default ConversationsModulePage;
