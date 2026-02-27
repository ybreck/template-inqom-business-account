
import { ConversationThread, ChatMessage } from './types';

const initialMessages1: ChatMessage[] = [
  { id: 'msg1-1', sender: 'Mme J. Levasseur', text: 'Bonjour Madame, il me manque des informations pour clôturer les comptes de votre exercice 2023. Pourriez-vous me communiquer les factures manquantes pour les mois de novembre et décembre ? Merci d\'avance.', timestamp: '2024-01-12T13:21:00Z', isUserMessage: false },
  { id: 'msg1-2', sender: 'User', text: 'Bonjour Madame, je m\'occupe de vous adresser tous les documents d\'ici la fin de la semaine. Merci de votre compréhension.', timestamp: '2024-01-12T17:02:00Z', isUserMessage: true },
  { id: 'msg1-3', sender: 'Mme J. Levasseur', text: 'Madame, merci pour votre retour. Dans l\'attente des documents, je vous souhaite une bonne semaine.', timestamp: '2024-01-12T18:30:00Z', isUserMessage: false },
];

const initialMessages2: ChatMessage[] = [
  { id: 'msg2-1', sender: 'Mr B. Delacourt', text: 'Merci pour votre retour rapide. Je vais m\'occuper de vous adresser le contrat mis à jour dans la journée.', timestamp: '2024-01-11T10:15:00Z', isUserMessage: false },
  { id: 'msg2-2', sender: 'User', text: 'Parfait, merci beaucoup ! J\'attends cela avec impatience.', timestamp: '2024-01-11T10:16:00Z', isUserMessage: true },
];

const initialMessages3: ChatMessage[] = [
  { id: 'msg3-1', sender: 'Mr T. Joly', text: 'Pourriez-vous revenir vers moi au sujet des factures concernant le matériel informatique ? J\'ai besoin d\'une validation.', timestamp: '2024-01-10T14:50:00Z', isUserMessage: false },
];

export const mockConversations: ConversationThread[] = [
  {
    id: 'conv1',
    contactName: 'Mme J. Levasseur',
    contactTag: 'Comptabilité',
    isFavorite: true,
    lastMessagePreview: 'Madame, merci pour votre retour. Dans l\'attente...',
    lastMessageDate: '12/01/2024',
    messages: initialMessages1,
    unread: true,
  },
  {
    id: 'conv2',
    contactName: 'Mr B. Delacourt',
    contactTag: 'Comptabilité',
    isFavorite: false,
    lastMessagePreview: 'Parfait, merci beaucoup ! J\'attends cela avec impatience.',
    lastMessageDate: '11/01/2024',
    messages: initialMessages2,
  },
  {
    id: 'conv3',
    contactName: 'Mr T. Joly',
    contactTag: 'Comptabilité',
    isFavorite: false,
    lastMessagePreview: 'Pourriez-vous revenir vers moi au sujet des factures...',
    lastMessageDate: '10/01/2024',
    messages: initialMessages3,
  },
  {
    id: 'conv4',
    contactName: 'Service Client XYZ',
    contactTag: 'Support',
    isFavorite: false,
    lastMessagePreview: 'Votre demande a bien été prise en compte, réf: #12345',
    lastMessageDate: '09/01/2024',
    messages: [{ id: 'msg4-1', sender: 'Service Client XYZ', text: 'Votre demande a bien été prise en compte, réf: #12345. Nous reviendrons vers vous sous 24h.', timestamp: '2024-01-09T09:00:00Z', isUserMessage: false }],
  },
];