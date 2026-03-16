import React, { useState, useEffect, useRef } from 'react';
import { ModuleComponentProps, NotificationItem } from './types';
import { mockNotifications } from '../../data/notifications';
import { mockClientInvoices } from '../clientInvoices/data';
import { 
    DocumentArrowUpIcon, 
    DocumentMagnifyingGlassIcon, 
    BellIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftEllipsisIcon,
    EnvelopeIcon,
    BuildingLibraryIcon,
} from '../../constants/icons';

const formatCurrency = (amount?: number | string) => {
    if (amount === undefined) return '-';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num)) return '-';
    return num.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

const ActionIcon: React.FC<{ type: NotificationItem['type'] }> = ({ type }) => {
  const baseClass = "w-4 h-4 mr-2";
  switch (type) {
    case 'invoice_overdue_sales':
      return <ExclamationTriangleIcon className={`${baseClass} text-red-600`} />;
    case 'invoice_received_supplier':
      return <DocumentArrowUpIcon className={`${baseClass} text-blue-600`} />;
    case 'missing_document':
      return <DocumentMagnifyingGlassIcon className={`${baseClass} text-orange-600`} />;
    case 'message':
      return <ChatBubbleLeftEllipsisIcon className={`${baseClass} text-green-600`} />;
    case 'approval_request':
        return <BellIcon className={`${baseClass} text-purple-600`} />;
    case 'pro_account_onboarding':
        return <BuildingLibraryIcon className={`${baseClass} text-theme-primary-600`} />;
    default:
      return <BellIcon className={`${baseClass} text-gray-600`} />;
  }
};


const ActionsAFairePage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate, onMainNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<NotificationItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showArchived, setShowArchived] = useState(false);
  
  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const archivedNotifications = notifications.filter(n => n.status === 'archived');
  
  const displayedNotifications = showArchived ? archivedNotifications : pendingNotifications;

  useEffect(() => {
    let itemIdFromNav: string | null = null;
    if (activeSubPageId && activeSubPageId.includes('?itemId=')) {
      itemIdFromNav = activeSubPageId.split('?itemId=')[1];
    }
    
    if (itemIdFromNav) {
      setSelectedItemId(itemIdFromNav);
      if (notifications.find(n => n.id === itemIdFromNav)?.status === 'archived') {
        setShowArchived(true);
      } else {
        setShowArchived(false);
      }
    } else if (pendingNotifications.length > 0) {
      setSelectedItemId(pendingNotifications[0].id);
      setShowArchived(false);
    } else if (archivedNotifications.length > 0) {
        setSelectedItemId(archivedNotifications[0].id);
        setShowArchived(true);
    } else {
      setSelectedItemId(null);
    }
  }, [activeSubPageId, notifications]);
  
  useEffect(() => {
      if(selectedItemId) {
        const item = notifications.find(it => it.id === selectedItemId);
        setSelectedItem(item || null);
      } else {
        setSelectedItem(null);
      }
  }, [selectedItemId, notifications]);


  const handleSelectItem = (item: NotificationItem) => {
    setSelectedItemId(item.id);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const archiveItem = (itemId: string) => {
      setNotifications(prev => prev.map(n => n.id === itemId ? {...n, status: 'archived'} : n));
      const currentList = showArchived ? archivedNotifications : pendingNotifications;
      const nextItem = currentList.find(n => n.id !== itemId);

      if (nextItem) {
          setSelectedItemId(nextItem.id);
      } else {
          // Switch to the other list if the current one is now empty
          const otherList = showArchived ? pendingNotifications : archivedNotifications;
          if(otherList.length > 0) {
              setShowArchived(!showArchived);
              setSelectedItemId(otherList[0].id);
          } else {
              setSelectedItemId(null);
          }
      }
  };
  
  const handleUploadFile = () => {
    if (selectedFile && selectedItem) {
      console.log(`Uploading file "${selectedFile.name}" for item "${selectedItem.title}"`);
      alert(`Fichier "${selectedFile.name}" téléversé (simulation) pour justifier : ${selectedItem.title}.`);
      archiveItem(selectedItem.id);
      setSelectedFile(null);
    }
  };

   const handleSendReminderAndArchive = (item: NotificationItem) => {
    if (!item.relatedData.invoiceId) return;
    
    const invoiceId = item.relatedData.invoiceId;
    const mockInvoiceIndex = mockClientInvoices.findIndex(inv => inv.id === invoiceId);
    if (mockInvoiceIndex !== -1) {
        mockClientInvoices[mockInvoiceIndex].reminderSent = true;
    }

    alert(`Relance envoyée pour la facture ${item.relatedData.invoiceNumber} et notification archivée.`);
    archiveItem(item.id);
  };


  const renderDetailView = () => {
    if (!selectedItem) {
      return (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-center">
            <div>
              <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">{ showArchived ? "Aucun élément archivé sélectionné." : "Sélectionnez une action dans la liste pour voir les détails."}</p>
            </div>
        </div>
      );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="text-xl font-semibold text-theme-text mb-1 flex items-center">
                <ActionIcon type={selectedItem.type}/> {selectedItem.title}
            </h3>
            {selectedItem.urgent && <span className="text-xs font-bold text-red-500 mb-4">URGENT</span>}

            <div className="border-t border-b border-gray-200 py-4 my-4 text-sm text-gray-700 flex-grow">
              <p className="font-medium mb-2">Détails :</p>
              <p>{selectedItem.description}</p>
              {selectedItem.relatedData && (
                <div className="mt-3 text-xs bg-gray-50 p-3 rounded-md space-y-1">
                  {Object.entries(selectedItem.relatedData).map(([key, value]) => {
                    let displayKey = key;
                    switch(key) {
                        case 'invoiceId': return null;
                        case 'invoiceNumber': displayKey = 'N° Facture'; break;
                        case 'clientName': displayKey = 'Client'; break;
                        case 'supplierName': displayKey = 'Fournisseur'; break;
                        case 'amount': displayKey = 'Montant'; break;
                        case 'fromUser': displayKey = 'De'; break;
                        case 'fromUserTitle': return null;
                        case 'avatarInitial': return null;
                        case 'employee': displayKey = 'Employé'; break;
                        case 'transactionDate': displayKey = 'Date Transaction'; break;
                        case 'thirdPartyName': displayKey = 'Tiers'; break;
                    }
                    return (
                        <p key={key}>
                            <strong>{displayKey}:</strong> {key === 'amount' ? formatCurrency(value as number) : String(value)}
                        </p>
                    )
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-auto space-y-3">
                {selectedItem.status === 'pending' ? (
                    <>
                        {selectedItem.type === 'missing_document' && (
                          <>
                            <label htmlFor="file-upload" className="block text-sm font-medium text-theme-text">Téléverser le justificatif :</label>
                            <div className="flex items-center space-x-3">
                              <input type="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-theme-primary-50 file:text-theme-primary-700 hover:file:bg-theme-primary-100 cursor-pointer"/>
                              <button onClick={handleUploadFile} disabled={!selectedFile} className="px-5 py-2.5 text-sm font-medium text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center">
                                <DocumentArrowUpIcon className="w-5 h-5 mr-2" /> Uploader
                              </button>
                            </div>
                          </>
                        )}

                        {selectedItem.type === 'invoice_overdue_sales' && (
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleSendReminderAndArchive(selectedItem)} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                                    Relancer le client
                                </button>
                                <button onClick={() => {
                                    if (onMainNavigate && onSubNavigate) {
                                        onMainNavigate('ventes');
                                        onSubNavigate(`invoice_detail?id=${selectedItem.relatedData.invoiceId}`);
                                        archiveItem(selectedItem.id);
                                    }
                                }} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                    Voir la facture
                                </button>
                            </div>
                        )}

                        {selectedItem.type === 'invoice_received_supplier' && (
                            <button onClick={() => {
                                if (onMainNavigate && onSubNavigate) {
                                    onMainNavigate('achats');
                                    onSubNavigate(`supplier_invoice_detail?id=${selectedItem.relatedData.invoiceId}`);
                                    archiveItem(selectedItem.id);
                                }
                            }} className="w-full px-5 py-2.5 text-sm font-medium text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600">
                                Voir la facture
                            </button>
                        )}

                         {selectedItem.type === 'message' && (
                            <button onClick={() => {
                                if (onSubNavigate) {
                                    onSubNavigate('conversations_chat');
                                    archiveItem(selectedItem.id);
                                }
                            }} className="w-full px-5 py-2.5 text-sm font-medium text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600">
                                Répondre au message
                            </button>
                        )}

                        {selectedItem.type === 'pro_account_onboarding' && (
                            <button onClick={() => {
                                if (onMainNavigate) {
                                    onMainNavigate('compte_pro');
                                    archiveItem(selectedItem.id);
                                }
                            }} className="w-full px-5 py-2.5 text-sm font-medium text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600">
                                Reprendre l'activation
                            </button>
                        )}
                        {selectedItem.type === 'approval_request' && (
                            <button onClick={() => {
                                alert(`Note de frais de ${selectedItem.relatedData.employee} pour ${formatCurrency(selectedItem.relatedData.amount)} approuvée.`);
                                archiveItem(selectedItem.id);
                            }} className="w-full px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                                Approuver la note de frais
                            </button>
                        )}
                    </>
                ) : (
                    <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-md text-center">
                        Cette action a été archivée.
                    </div>
                )}
            </div>
        </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height,150px)-2rem)] bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-theme-text">Liste des Actions</h3>
            <div className="flex items-center text-sm">
                <span className={`mr-2 font-medium ${!showArchived ? 'text-theme-primary-600' : 'text-gray-500'}`}>À faire</span>
                <button
                    onClick={() => setShowArchived(!showArchived)}
                    role="switch"
                    aria-checked={showArchived}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showArchived ? 'bg-gray-400' : 'bg-theme-primary-500'}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showArchived ? 'translate-x-1' : 'translate-x-6'}`} />
                </button>
                <span className={`ml-2 font-medium ${showArchived ? 'text-theme-primary-600' : 'text-gray-500'}`}>Archivées</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {displayedNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`p-4 cursor-pointer hover:bg-theme-primary-50 ${selectedItemId === item.id ? 'bg-theme-primary-100 border-r-4 border-theme-primary-500' : ''} border-b border-gray-100`}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm font-semibold ${selectedItemId === item.id ? 'text-theme-primary-700' : 'text-theme-text'} flex items-center`}>
                  <ActionIcon type={item.type}/>
                  {item.title}
                </h4>
                {item.urgent && item.status === 'pending' && <span className="text-xs text-red-500 font-semibold">Urgent</span>}
              </div>
              <p className={`text-xs truncate ${selectedItemId === item.id ? 'text-theme-primary-600' : 'text-gray-500'}`}>
                {item.description}
              </p>
            </div>
          ))}
           {displayedNotifications.length === 0 && <p className="p-4 text-sm text-gray-500 text-center">{showArchived ? 'Aucune action archivée.' : 'Aucune action requise !'}</p>}
        </div>
      </div>

      <div className="w-2/3 flex flex-col p-6 bg-slate-50">
        {renderDetailView()}
      </div>
    </div>
  );
};

export default ActionsAFairePage;