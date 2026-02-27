
import React from 'react';
import ClientInvoiceListPage from './ClientInvoiceListPage';
import NewInvoiceEditorPage from './NewInvoiceEditorPage';
import { DocumentTextIcon, PlusCircleIcon } from '../../constants/icons'; // Utilise les icônes globales

// Cette configuration est pour le contenu de l'onglet "Facturation" dans VentesModulePage
export const clientInvoiceListConfig = {
  id: 'ventes_facturation', // ID utilisé par VentesModulePage pour cet onglet
  title: 'Facturation',
  icon: DocumentTextIcon,
  component: ClientInvoiceListPage,
  description: "Gérez et suivez vos factures clients."
};

// Cette configuration est pour le contenu de l'onglet "Nouvelle Facture" dans VentesModulePage
export const newInvoiceEditorConfig = {
  id: 'create_invoice', // ID utilisé par VentesModulePage pour cet onglet
  title: 'Nouvelle Facture',
  icon: PlusCircleIcon, // Icône pour l'onglet
  component: NewInvoiceEditorPage,
  description: "Créez une nouvelle facture client." 
  // Pas besoin de description ici si VentesModulePage ne l'utilise pas pour les onglets
};
