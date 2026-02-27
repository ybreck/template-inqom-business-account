import React, { useEffect, useState } from 'react';
import { ModuleComponentProps, QuoteStatus, Quote } from '../../../types';
import { mockQuotes } from './data/quotes';
import { 
    ArrowDownTrayIcon, 
    ArrowLeftIcon, 
    ListBulletIcon, 
    ChatBubbleLeftEllipsisIcon, 
    ArrowsRightLeftIcon,
    EnvelopeIcon
} from '../../constants/icons';

interface QuoteDetailPageProps extends ModuleComponentProps {}

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

const getQuoteStatusBadgeStyle = (status: QuoteStatus): { className: string; label: string } => {
  switch (status) {
    case 'BROUILLON': return { className: 'bg-gray-100 text-gray-700 border border-gray-300', label: 'Brouillon' };
    case 'ENVOYE': return { className: 'bg-blue-100 text-blue-700 border border-blue-300', label: 'Envoyé' };
    case 'ACCEPTE': return { className: 'bg-green-100 text-green-700 border border-green-300', label: 'Accepté' };
    case 'REFUSE': return { className: 'bg-red-100 text-red-700 border border-red-300', label: 'Refusé' };
    case 'ANNULE': return { className: 'bg-slate-100 text-slate-600 border border-slate-300', label: 'Annulé' };
    default: return { className: 'bg-gray-100 text-gray-700', label: status };
  }
};


const QuoteDetailPage: React.FC<QuoteDetailPageProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('quote_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      const foundQuote = mockQuotes.find(q => q.id === id);
      setQuote(foundQuote || null);
    }
  }, [activeSubPageId]);

  const handleGoBack = () => onSubNavigate?.('ventes_devis');

  const handleDownloadPdf = () => {
    alert(`Téléchargement du PDF pour le devis ${quote?.quoteNumber} (simulation).`);
  };

  const handleConvertToInvoice = () => {
    alert(`Transformation du devis ${quote?.quoteNumber} en facture (simulation).`);
    if(onSubNavigate) {
        onSubNavigate('create_invoice');
    }
  };

  const handleSendEmail = () => {
    alert(`Envoi par e-mail du devis ${quote?.quoteNumber} (simulation).`);
  };

  if (!quote) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-lg font-semibold text-theme-text">Devis non trouvé</p>
        <p className="text-sm text-gray-500 mb-4">L'identifiant du devis est manquant ou incorrect.</p>
        <button
          onClick={() => onSubNavigate?.('ventes_devis')}
          className="px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          Retour à la liste des devis
        </button>
      </div>
    );
  }

  const canConvertToInvoice = quote.status === 'ACCEPTE';
  const canSendEmail = quote.status !== 'BROUILLON';
  const statusBadge = getQuoteStatusBadgeStyle(quote.status);

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
                    aria-label="Retour à la liste des devis"
                >
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-semibold text-theme-text ml-4 flex-grow">
                    {quote.quoteNumber}
                </h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusBadge.className}`}>
                    {statusBadge.label}
                </span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end space-x-2">
                <button
                    onClick={handleDownloadPdf}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50"
                    title="Télécharger le PDF"
                >
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={handleConvertToInvoice}
                    disabled={!canConvertToInvoice}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Transformer en facture"
                >
                    <ArrowsRightLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={handleSendEmail}
                    disabled={!canSendEmail}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Envoyer par e-mail"
                >
                    <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Quote Info Details */}
            <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Client :</span> <span className="font-semibold text-theme-text text-right">{quote.clientName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Montant TTC :</span> <span className="font-semibold text-theme-text">{quote.totalAmountTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date d'émission :</span> <span className="font-semibold text-theme-text">{formatDate(quote.issueDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Valide jusqu'au :</span> <span className="font-semibold text-theme-text">{formatDate(quote.expiryDate)}</span></div>
            </div>

            {/* Status History Section */}
            <section aria-labelledby="status-history-heading">
                <h3 id="status-history-heading" className="text-xl font-semibold text-theme-text mt-6 mb-3 flex items-center">
                    <ListBulletIcon className="w-5 h-5 mr-2 text-theme-primary-500" />
                    Historique des Statuts
                </h3>
                {quote.statusHistory && quote.statusHistory.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-4 bg-slate-50">
                    {quote.statusHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
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
                {quote.communicationHistory && quote.communicationHistory.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-4 bg-slate-50">
                    {quote.communicationHistory.map((entry) => (
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
            <p className="text-theme-secondary-gray-500 text-lg font-medium">Prévisualisation du PDF du devis</p>
            <p className="text-theme-secondary-gray-400 text-sm mt-1">(Conteneur pour iframe ou composant visualiseur PDF)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailPage;
