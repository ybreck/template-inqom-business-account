
import { ModuleComponentProps as GlobalModuleComponentProps, NotificationItem } from '../../../types';

export interface ChatMessage {
  id: string;
  sender: string; 
  text: string;
  timestamp: string; 
  isUserMessage: boolean; 
}

export interface ConversationThread {
  id: string;
  contactName: string;
  contactTag: string; 
  isFavorite: boolean;
  lastMessagePreview: string;
  lastMessageDate: string; 
  messages: ChatMessage[];
  unread?: boolean;
}

// Re-export ModuleComponentProps for local use if needed
export type ModuleComponentProps = GlobalModuleComponentProps;
export type { NotificationItem };
