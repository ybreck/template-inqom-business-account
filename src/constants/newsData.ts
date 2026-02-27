import { NewsItem } from '../../types'; // Adjusted path to global types

export const mockNewsItems: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Nouvelle réglementation fiscale 2024',
    date: '2024-07-15T10:00:00Z',
    category: 'Fiscalité', // Changed category to a more generic string type
    content: "Une nouvelle loi de finances a été adoptée. Assurez-vous de comprendre les impacts sur votre déclaration de revenus et vos obligations TVA. Contactez-nous pour un accompagnement personnalisé.",
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWNjb3VudGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    link: '#',
    read: false,
  },
  {
    id: 'news-2',
    title: 'Mise à jour de la plateforme : Nouvelles fonctionnalités',
    date: '2024-07-10T14:30:00Z',
    category: 'Mise à jour',
    content: "Découvrez les dernières améliorations de votre espace client : une interface de gestion des factures repensée et un module d'analyse financière plus performant. N'hésitez pas à explorer ces nouveautés.",
    link: '#',
    read: true,
  },
  {
    id: 'news-3',
    title: 'Conseil : Optimisez votre trésorerie',
    date: '2024-07-05T09:15:00Z',
    category: 'Conseil',
    content: "Anticipez vos besoins de financement et suivez de près vos flux de trésorerie. Quelques astuces simples peuvent vous aider à maintenir une situation financière saine. Consultez notre guide pratique.",
    imageUrl: 'https://images.unsplash.com/photo-1630571100142-93041926c141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZpbmFuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    read: false,
  },
  {
    id: 'news-4',
    title: 'Alerte : Tentatives de phishing en cours',
    date: '2024-07-01T16:45:00Z',
    category: 'Alerte',
    content: "Soyez vigilants face aux e-mails et SMS frauduleux usurpant l'identité de votre cabinet. Ne communiquez jamais vos identifiants. En cas de doute, contactez-nous directement.",
    read: false,
  },
   {
    id: 'news-5',
    title: 'Webinaire : Les clés de la gestion de patrimoine',
    date: '2024-06-28T11:00:00Z',
    category: 'Information',
    content: "Inscrivez-vous à notre prochain webinaire gratuit le 15 août à 10h pour découvrir les stratégies essentielles à une bonne gestion de votre patrimoine personnel et professionnel.",
    link: '#',
    read: true,
  }
];

// Update NewsItem in types.ts to accept string for category
// export interface NewsItem {
//   id: string;
//   title: string;
//   date: string; 
//   category: string; // Changed to string
//   content: string;
//   imageUrl?: string;
//   link?: string; 
//   read?: boolean;
// }