
import React from 'react';
import ConversationsModulePage from './ConversationsModulePage'; // Import the new shell
import ConversationsPage from './ConversationsPage'; // Keep for direct reference if needed elsewhere
import ActionsAFairePage from './ActionsAFairePage'; // Import for reference
import { ChatBubbleLeftRightIcon, ClipboardAlertIcon } from '../../constants/icons'; 
import { PageConfig } from '../../../types';

// This is the main configuration for the "Conversations" module in App.tsx
export const conversationsConfig: PageConfig = {
  id: 'conversations', 
  title: 'Messagerie & Actions', // Updated title to reflect both tabs
  icon: ChatBubbleLeftRightIcon, // Icon for the main module in sidebar
  component: ConversationsModulePage, // Use the new shell component
  description: "Communiquez et gérez vos actions à faire."
};

// These configurations are more for defining the structure within ConversationsModulePage
// They are not directly registered in App.tsx's pageComponentRegistry usually.
export const chatTabConfig: PageConfig = {
    id: 'conversations_chat', // Used by ConversationsModulePage for its internal routing
    title: 'Messagerie',
    icon: ChatBubbleLeftRightIcon,
    component: ConversationsPage, // The actual chat page
    description: "Communiquez avec vos clients, fournisseurs ou collaborateurs."
};

export const actionsAFaireTabConfig: PageConfig = {
    id: 'conversations_actions_a_faire', // Used by ConversationsModulePage
    title: 'Actions à faire',
    icon: ClipboardAlertIcon,
    component: ActionsAFairePage, // The actual actions page
    description: "Consultez et traitez vos tâches et transactions à justifier."
};
