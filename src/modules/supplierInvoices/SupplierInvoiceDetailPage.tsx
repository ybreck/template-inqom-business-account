
import React, { useEffect, useState } from 'react';
import { ModuleComponentProps, PAStatus } from '../../../types';
import { mockSupplierInvoices } from './data'; 
import { SupplierInvoice, InvoiceStatusHistoryEntry, InvoiceCommunicationEntry } from './types';
import { 
    ArrowDownTrayIcon, 
    ArrowLeftIcon, 
    ListBulletIcon, 
    ChatBubbleLeftEllipsisIcon, 
    CheckCircleIcon,
    MegaphoneIcon
} from '../../constants/icons';
import { getPAStatusBadgeStyle } from '../clientInvoices/utils';


interface SupplierInvoiceDetailPageProps extends ModuleComponentProps {}

const formatDate = (dateString?: string, includeTime: boolean = false) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) {
    return 'Date Invalide';
  }
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return dateObj.toLocaleDateString('fr-FR', options);
};

const SupplierInvoiceDetailPage: React.FC<SupplierInvoiceDetailPageProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [invoice, setInvoice] = useState<SupplierInvoice | null>(null);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('supplier_invoice_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      const foundInvoice = mockSupplierInvoices.find(inv => inv.id === id);
      setInvoice(JSON.parse(JSON.stringify(foundInvoice || null))); // Deep copy
    }
  }, [activeSubPageId]);
  
  const handleGoBack = () => onSubNavigate?.('factures_fournisseurs');

  const handleAction = (action: 'approve' | 'pay' | 'contact') => {
      if (!invoice) return;
      
      let updatedInvoice = {...invoice};
      let alertMessage = '';

      const newHistoryEntry = (status: string, notes: string): InvoiceStatusHistoryEntry => ({
          id: `shs-${Date.now()}`,
          date: new Date().toISOString(),
          status: status,
          changedBy: 'Utilisateur Actuel',
          notes: notes
      });

      if(action === 'approve') {
          updatedInvoice.status = 'APPROUVEE_ACHAT';
          updatedInvoice.statusHistory = [newHistoryEntry('Approuvée (APPROUVEE_ACHAT)', 'Approuvé manuellement.'), ...(updatedInvoice.statusHistory || [])];
          alertMessage = `Facture ${invoice.invoiceNumber} approuvée.`;
      } else if (action === 'pay') {
          updatedInvoice.status = 'PAYEE_ACHAT';
          updatedInvoice.paymentDate = new Date().toISOString();
          updatedInvoice.statusHistory = [newHistoryEntry('Payée (PAYEE_ACHAT)', 'Paiement enregistré manuellement.'), ...(updatedInvoice.statusHistory || [])];
          alertMessage = `Facture ${invoice.invoiceNumber} marquée comme payée.`;
      } else if (action === 'contact') {
          const newCommEntry: InvoiceCommunicationEntry = {
              id: `comm-${Date.now()}`,
              date: new Date().toISOString(),
              type: 'Email',
              summary: `Prise de contact initiée manuellement pour la facture ${invoice.invoiceNumber}.`,
              user: 'Utilisateur Actuel'
          };
          updatedInvoice.communicationHistory = [newCommEntry, ...(updatedInvoice.communicationHistory || [])];
          alertMessage = `Prise de contact avec le fournisseur pour la facture ${invoice.invoiceNumber} simulée.`;
      }

      setInvoice(updatedInvoice);
      // Persist change to mock data
      const index = mockSupplierInvoices.findIndex(i => i.id === invoice.id);
      if (index !== -1) {
          mockSupplierInvoices[index] = updatedInvoice;
      }
      alert(alertMessage);
  };
  
  const handleDownloadPdf = () => {
    alert(`Téléchargement du PDF pour la facture fournisseur ${invoice?.invoiceNumber} (simulation).`);
  };

  if (!invoice) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-lg font-semibold text-theme-text">Facture non trouvée</p>
        <button onClick={handleGoBack} className="mt-4 text-theme-primary-500">Retour</button>
      </div>
    );
  }
  
  const statusBadge = getPAStatusBadgeStyle(invoice.status);
  const canApprove = invoice.status === 'RECU_PA_ACHAT';
  const canPay = invoice.status === 'APPROUVEE_ACHAT';

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
                <h2 className="text-xl font-semibold text-theme-text ml-4 flex-grow truncate" title={invoice.invoiceNumber}>
                    {invoice.invoiceNumber}
                </h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusBadge.className} flex-shrink-0`}>
                    {statusBadge.label}
                </span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
                {canApprove && (
                    <button onClick={() => handleAction('approve')} className="flex-grow px-4 py-2 text-sm font-medium rounded-md transition-colors bg-green-500 text-white hover:bg-green-600">
                        Approuver
                    </button>
                )}
                 {canPay && (
                    <button onClick={() => handleAction('pay')} className="flex-grow px-4 py-2 text-sm font-medium rounded-md transition-colors bg-theme-primary-500 text-white hover:bg-theme-primary-600">
                        Payer
                    </button>
                )}
                <button onClick={() => handleAction('contact')} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50" title="Contacter le fournisseur">
                    <MegaphoneIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={handleDownloadPdf} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50" title="Télécharger le PDF">
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Invoice Info Details */}
            <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Fournisseur :</span> <span className="font-semibold text-theme-text text-right">{invoice.supplierName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Montant TTC :</span> <span className="font-semibold text-theme-text">{invoice.totalAmountTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date d'émission :</span> <span className="font-semibold text-theme-text">{formatDate(invoice.issueDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date d'échéance :</span> <span className="font-semibold text-theme-text">{formatDate(invoice.dueDate)}</span></div>
            </div>

            {/* Status History Section */}
            <section aria-labelledby="status-history-heading-supplier">
              <h3 id="status-history-heading-supplier" className="text-xl font-semibold text-theme-text mt-6 mb-3 flex items-center">
                <ListBulletIcon className="w-5 h-5 mr-2 text-theme-primary-500" />
                Historique des Statuts
              </h3>
              {invoice.statusHistory && invoice.statusHistory.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-4 bg-slate-50">
                  {invoice.statusHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => ( 
                    <div key={entry.id} className="pb-3 border-b border-slate-200 last:border-b-0">
                      <p className="text-sm font-medium text-theme-text">{entry.status}<span className="text-xs text-gray-500 ml-2">({formatDate(entry.date, true)})</span></p>
                      <p className="text-xs text-gray-600">Par : {entry.changedBy}</p>
                      {entry.notes && <p className="text-xs text-gray-500 italic mt-0.5">Note : {entry.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500 italic">Aucun historique de statut.</p>}
            </section>

            {/* Communication History Section */}
            <section aria-labelledby="communication-history-heading-supplier">
              <h3 id="communication-history-heading-supplier" className="text-xl font-semibold text-theme-text mt-6 mb-3 flex items-center">
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2 text-theme-primary-500" />
                Historique des Communications
              </h3>
              {invoice.communicationHistory && invoice.communicationHistory.length > 0 ? (
                 <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-4 bg-slate-50">
                  {invoice.communicationHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => ( 
                    <div key={entry.id} className="pb-3 border-b border-slate-200 last:border-b-0">
                      <p className="text-sm font-medium text-theme-text">{entry.type}<span className="text-xs text-gray-500 ml-2">({formatDate(entry.date, true)})</span></p>
                      <p className="text-xs text-gray-600">Par : {entry.user || 'Système'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.summary}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500 italic">Aucune communication.</p>}
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

export default SupplierInvoiceDetailPage;
