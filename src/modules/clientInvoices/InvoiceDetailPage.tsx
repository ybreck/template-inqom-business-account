import React, { useEffect, useState } from 'react';
import { ModuleComponentProps } from '../../../types';
import { mockClientInvoices } from './data'; 
// FIX: Corrected typo in type import from 'PDPStatus' to 'PAStatus'.
import { ClientInvoice, InvoiceStatusHistoryEntry, InvoiceCommunicationEntry, PAStatus } from './types';
import { 
    ArrowDownTrayIcon, 
    ArrowLeftIcon, 
    ListBulletIcon, 
    ChatBubbleLeftEllipsisIcon,
    EnvelopeIcon,
    DocumentTextIcon
} from '../../constants/icons';
// FIX: Corrected function import from 'getPDPStatusBadgeStyle' to 'getPAStatusBadgeStyle'.
import { getPAStatusBadgeStyle } from './utils';

const formatDate = (dateString: string, includeTime: boolean = false) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const InvoiceDetailPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [invoice, setInvoice] = useState<ClientInvoice | null>(null);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('invoice_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      const foundInvoice = mockClientInvoices.find(inv => inv.id === id);
      setInvoice(foundInvoice ? { ...foundInvoice } : null);
    }
  }, [activeSubPageId]);

  const handleGoBack = () => onSubNavigate?.('ventes_facturation');

  const handleCancelInvoice = () => {
    if (invoice) {
      alert(`Création d'un avoir d'annulation pour la facture ${invoice.invoiceNumber} (simulation).`);
      onSubNavigate?.(`create_invoice?type=credit_note&fromInvoice=${invoice.id}&full=true`);
    }
  };

  const handleCreateCreditNote = () => {
    if (invoice) {
      alert(`Création d'un avoir pour la facture ${invoice.invoiceNumber} (simulation).`);
      onSubNavigate?.(`create_invoice?type=credit_note&fromInvoice=${invoice.id}`);
    }
  };

  const handleDownloadPdf = () => {
    alert(`Téléchargement du PDF pour la facture ${invoice?.invoiceNumber} (simulation).`);
  };

  const handleSendEmail = () => {
    alert(`Envoi par e-mail de la facture ${invoice?.invoiceNumber} (simulation).`);
  };

  const handleSendManualReminder = () => {
    if (!invoice) return;
    alert(`Relance manuelle pour la facture ${invoice.invoiceNumber} envoyée (simulation).`);
    const mockIndex = mockClientInvoices.findIndex(inv => inv.id === invoice.id);
    if (mockIndex !== -1) {
        mockClientInvoices[mockIndex].reminderSent = true;
    }
    setInvoice(prev => prev ? { ...prev, reminderSent: true } : null);
  };


  if (!invoice) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-lg font-semibold text-theme-text">Facture non trouvée</p>
        <p className="text-sm text-gray-500 mb-4">L'identifiant de la facture est manquant ou incorrect.</p>
        <button
          onClick={() => onSubNavigate?.('ventes_facturation')}
          className="px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          Retour à la liste des factures
        </button>
      </div>
    );
  }

  // Button logic
  const canCancelInvoice = ['VALIDEE_PA', 'TELECHARGEE_CLIENT', 'PAYEE', 'EN_RETARD', 'PARTIELLEMENT_PAYEE'].includes(invoice.status);
  const canCreateCreditNote = ['PAYEE', 'ENCAISSEE', 'EN_RETARD', 'PARTIELLEMENT_PAYEE'].includes(invoice.status);
  const canSendEmail = invoice.status !== 'BROUILLON';
  const canSendReminder = invoice.status === 'EN_RETARD' && !invoice.reminderSent;
  
  const statusBadge = getPAStatusBadgeStyle(invoice.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column (1/3) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white shadow-xl rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center pb-4">
                <button
                    onClick={handleGoBack}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                    aria-label="Retour à la liste des factures"
                >
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-semibold text-theme-text ml-4 flex-grow">
                    {invoice.invoiceNumber}
                </h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusBadge.className}`}>
                    {statusBadge.label}
                </span>
            </div>
            
            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
                {canSendReminder && (
                    <button
                        onClick={handleSendManualReminder}
                        className="col-span-2 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        Relancer le client
                    </button>
                )}
                <button
                    onClick={handleCancelInvoice}
                    disabled={!canCancelInvoice}
                    className="flex-grow px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                    aria-label="Annuler la facture en créant un avoir"
                >
                    Annuler
                </button>
                <button
                    onClick={handleCreateCreditNote}
                    disabled={!canCreateCreditNote}
                    className="flex-shrink-0 px-4 py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Générer un avoir"
                >
                    <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="col-span-1 flex-shrink-0 px-4 py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    title="Télécharger le PDF"
                >
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={handleSendEmail}
                    disabled={!canSendEmail}
                    className="col-span-1 flex-shrink-0 px-4 py-2 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Envoyer par e-mail"
                >
                    <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Invoice Info Details */}
            <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Client :</span> <span className="font-semibold text-theme-text text-right">{invoice.clientName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Montant TTC :</span> <span className="font-semibold text-theme-text">{invoice.totalAmountTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date d'émission :</span> <span className="font-semibold text-theme-text">{formatDate(invoice.issueDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date d'échéance :</span> <span className="font-semibold text-theme-text">{formatDate(invoice.dueDate)}</span></div>
            </div>

            {/* Status History Section */}
            <section aria-labelledby="status-history-heading">
                <h3 id="status-history-heading" className="text-xl font-semibold text-theme-text mt-6 mb-3 flex items-center">
                    <ListBulletIcon className="w-5 h-5 mr-2 text-theme-primary-500" />
                    Historique des Statuts
                </h3>
                {invoice.statusHistory && invoice.statusHistory.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-4 bg-slate-50">
                    {invoice.statusHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                        <div key={entry.id} className="pb-3 border-b border-slate-200 last:border-b-0">
                        <p className="text-sm font-medium text-theme-text">
                            {entry.status} 
                            <span className="text-xs text-gray-500 ml-2">({formatDate(entry.date, true)})</span>
                        </p>
                        <p className="text-xs text-gray-600">Par : {entry.changedBy}</p>
                        {entry.notes && <p className="text-xs text-gray-500 italic mt-0.5">Note : {entry.notes}</p>}
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Aucun historique de statut disponible.</p>
                )}
            </section>

            {/* Communication History Section */}
            <section aria-labelledby="communication-history-heading">
                <h3 id="communication-history-heading" className="text-xl font-semibold text-theme-text mt-6 mb-3 flex items-center">
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2 text-theme-primary-500" />
                    Historique des Communications
                </h3>
                {invoice.communicationHistory && invoice.communicationHistory.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-4 bg-slate-50">
                    {invoice.communicationHistory.map((entry) => (
                        <div key={entry.id} className="pb-3 border-b border-slate-200 last:border-b-0">
                        <p className="text-sm font-medium text-theme-text">
                            {entry.type}
                            <span className="text-xs text-gray-500 ml-2">({formatDate(entry.date, true)})</span>
                        </p>
                        <p className="text-xs text-gray-600">Par : {entry.user || 'Système'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{entry.summary}</p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Aucune communication enregistrée.</p>
                )}
            </section>
        </div>
      </div>

      {/* Right Column (2/3) */}
      <div className="lg:col-span-2">
        <div className="sticky top-6 h-[calc(100vh-8rem)]">
          <div className="h-full p-6 border-2 border-dashed border-theme-secondary-gray-300 rounded-lg bg-theme-secondary-gray-50 flex flex-col items-center justify-center">
            <p className="text-theme-secondary-gray-500 text-lg font-medium">Prévisualisation du PDF de la facture</p>
            <p className="text-theme-secondary-gray-400 text-sm mt-1">(Conteneur pour iframe ou composant visualiseur PDF)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;