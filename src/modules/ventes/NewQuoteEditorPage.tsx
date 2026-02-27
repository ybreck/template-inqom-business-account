

import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import ProductLine to correctly type the handleLineItemChange function.
import { EditableQuote, InvoiceLineItem, ModuleComponentProps, BankAccount, ProductLine } from '../../../types'; 
import { PlusCircleIcon, TrashIcon } from '../../constants/icons'; 
import { mockClients, mockProducts, mockBankAccounts } from './data/quotes';

interface NewQuoteEditorPageProps extends ModuleComponentProps {}

const initialLineItem: InvoiceLineItem & { type: 'product' } = {
  type: 'product',
  id: Date.now().toString(),
  productId: undefined,
  description: '',
  quantity: 1,
  unitPrice: 0,
  taxRate: 0.20, 
  discount: 0,
  discountType: 'percentage',
};

const CheckboxOption: React.FC<{ id: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; }> = ({ id, label, checked, onChange, disabled }) => (
  <label htmlFor={id} className={`flex items-center text-sm  p-1 rounded ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer hover:bg-gray-50'}`}>
    <input
      type="checkbox"
      id={id}
      name={id}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="h-4 w-4 rounded border-gray-300 text-theme-primary-600 focus:ring-theme-primary-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
    />
    <span className="ml-3">{label}</span>
  </label>
);

const NewQuoteEditorPage: React.FC<NewQuoteEditorPageProps> = ({ onSubNavigate }) => {
  const [quoteNumber, setQuoteNumber] = useState('');

  const [quote, setQuote] = useState<EditableQuote>({
    id: 'new_quote_' + Date.now(),
    clientId: '',
    clientName: '',
    clientAddress: '',
    quoteNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    deliveryDate: '',
    lineItems: [{ ...initialLineItem, id: Date.now().toString() }],
    documentDiscount: 0,
    documentDiscountType: 'percentage',
    bankAccountId: mockBankAccounts.find(b => b.isDefault)?.id || '',
    freeFieldContent: '',
    latePenaltiesText: 'En cas de retard de paiement, une pénalité égale à 3 fois le taux d\'intérêt légal sera appliquée.',
    discountConditionsText: 'Aucun escompte pour paiement anticipé.',
  });
  
  const [totals, setTotals] = useState({
    subtotalHT: 0,
    totalLineDiscountAmount: 0,
    subtotalAfterLineDiscount: 0,
    documentDiscountAmount: 0,
    finalHT: 0,
    totalTaxAmount: 0,
    grandTotalTTC: 0,
    taxDetails: {} as Record<string, number>,
  });

  const [options, setOptions] = useState({
    showDeliveryDate: false,
    showLineDiscount: false,
    showDocumentDiscount: false,
    showBankDetails: false,
    showFreeField: false,
    freeFieldPosition: 'after' as 'before' | 'after',
    showLatePenalties: false,
    showDiscountConditions: false,
    validityDuration: '30',
  });

  useEffect(() => {
    const newQuoteNumber = `DEV-${new Date().getFullYear()}-00${Math.floor(Math.random() * 900) + 100}`;
    setQuoteNumber(newQuoteNumber);
    setQuote(prev => ({ ...prev, quoteNumber: newQuoteNumber }));
  }, []);
  
  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setOptions(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleValidityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setOptions(prev => ({...prev, validityDuration: value}));
  };

  useEffect(() => {
    if (!quote.issueDate || options.validityDuration === 'custom') return;
    try {
        const issueDate = new Date(quote.issueDate);
        issueDate.setUTCHours(12,0,0,0);
        let newExpiryDate = new Date(issueDate);
        const days = parseInt(options.validityDuration, 10);
        newExpiryDate.setDate(issueDate.getDate() + days);
        setQuote(prev => ({ ...prev, expiryDate: newExpiryDate.toISOString().split('T')[0] }));
    } catch (e) {
        console.error("Invalid issue date", quote.issueDate);
    }
  }, [options.validityDuration, quote.issueDate]);

  const calculateTotals = useCallback(() => {
    const productLines = quote.lineItems.filter((item): item is Extract<InvoiceLineItem, { type: 'product' }> => item.type === 'product');

    let subtotalHT = 0;
    let totalLineDiscountAmount = 0;
    let taxBases: { [key: string]: number } = {};

    productLines.forEach(item => {
      const lineHT = item.quantity * item.unitPrice;
      const lineDiscount = item.discountType === 'percentage' ? lineHT * (item.discount / 100) : item.discount;
      const lineHTAfterDiscount = lineHT - lineDiscount;
      
      subtotalHT += lineHT;
      totalLineDiscountAmount += lineDiscount;
      
      const taxRateKey = item.taxRate.toString();
      if (!taxBases[taxRateKey]) taxBases[taxRateKey] = 0;
      taxBases[taxRateKey] += lineHTAfterDiscount;
    });

    const subtotalAfterLineDiscount = subtotalHT - totalLineDiscountAmount;
    const documentDiscountAmount = quote.documentDiscountType === 'percentage' 
      ? subtotalAfterLineDiscount * (quote.documentDiscount / 100)
      : quote.documentDiscount;
    
    const finalHT = subtotalAfterLineDiscount - documentDiscountAmount;
    
    let totalTaxAmount = 0;
    const newTaxDetails: Record<string, number> = {};

    if (subtotalAfterLineDiscount > 0) {
        for (const rate in taxBases) {
            const baseAmount = taxBases[rate];
            const proportion = baseAmount / subtotalAfterLineDiscount;
            const discountForThisBase = documentDiscountAmount * proportion;
            const taxableAmount = baseAmount - discountForThisBase;
            const taxForThisRate = taxableAmount * parseFloat(rate);
            totalTaxAmount += taxForThisRate;
            newTaxDetails[rate] = taxForThisRate;
        }
    }

    const grandTotalTTC = finalHT + totalTaxAmount;

    setTotals({
        subtotalHT,
        totalLineDiscountAmount,
        subtotalAfterLineDiscount,
        documentDiscountAmount,
        finalHT,
        totalTaxAmount,
        grandTotalTTC,
        taxDetails: newTaxDetails,
    });
  }, [quote.lineItems, quote.documentDiscount, quote.documentDiscountType]);

  useEffect(() => {
    calculateTotals();
  }, [quote.lineItems, quote.documentDiscount, quote.documentDiscountType, calculateTotals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: value }));
  };
  
   const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClientId = e.target.value;
    const selectedClient = mockClients.find(c => c.id === selectedClientId);
    const formattedAddress = selectedClient ? `${selectedClient.address.street}\n${selectedClient.address.postalCode} ${selectedClient.address.city}\n${selectedClient.address.country}` : '';
    setQuote(prev => ({ ...prev, clientId: selectedClientId, clientName: selectedClient?.name || '', clientAddress: formattedAddress }));
  };

  // FIX: Changed 'field' type from 'keyof InvoiceLineItem' to 'keyof ProductLine' to allow access to all product fields.
  const handleLineItemChange = (index: number, field: keyof ProductLine, value: any) => {
    const updatedLineItems = [...quote.lineItems];
    const itemToUpdate = { ...updatedLineItems[index] };
     
    (itemToUpdate as any)[field] = value;

    if (itemToUpdate.type === 'product' && field === 'productId') {
        const product = mockProducts.find(p => p.id === value);
        if (product) {
            itemToUpdate.description = product.name;
            itemToUpdate.unitPrice = product.unitPrice;
            itemToUpdate.taxRate = product.taxRate / 100;
        }
    }
    updatedLineItems[index] = itemToUpdate;
    setQuote(prev => ({ ...prev, lineItems: updatedLineItems }));
  };

  const addLineItem = () => setQuote(prev => ({ ...prev, lineItems: [...prev.lineItems, { ...initialLineItem, id: Date.now().toString() }] }));
  const removeLineItem = (id: string) => setQuote(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id) }));
  const formatCurrency = (amount: number) => amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const handleSaveDraft = () => {
    console.log("Saving Draft:", quote);
    alert("Devis enregistré comme brouillon (voir console).");
    onSubNavigate?.('ventes_devis');
  };

  const handleFinalize = () => {
    console.log("Finalizing Quote:", quote);
    alert("Devis créé (voir console).");
    onSubNavigate?.('ventes_devis');
  };

  const handleCancel = () => {
    onSubNavigate?.('ventes_devis');
  };
  
  const selectedBankAccount = mockBankAccounts.find(b => b.id === quote.bankAccountId);

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-theme-text">Nouveau Devis : <span className="text-theme-primary-500">{quoteNumber}</span></h2>
        <div className="flex space-x-2">
          <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Annuler</button>
          <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-theme-secondary-gray-700 bg-theme-secondary-gray-100 rounded-md hover:bg-theme-secondary-gray-200">Enregistrer Brouillon</button>
          <button onClick={handleFinalize} className="px-4 py-2 text-sm font-medium text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">
            Créer le devis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN DOCUMENT EDITOR */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6 space-y-8">
            {/* ... Company & Client Info ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-theme-text mb-1">Votre Entreprise</h3>
                <p className="text-sm text-gray-600">Exemple SARL<br />123 Rue de l'Exemple<br />75001 Paris, France</p> 
              </div>
              <div className="space-y-2">
                <label htmlFor="clientId" className="block text-sm font-medium text-theme-text">Client</label>
                <select name="clientId" id="clientId" value={quote.clientId} onChange={handleClientChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-theme-primary-500 focus:border-theme-primary-500">
                  <option value="" disabled>Sélectionner un client</option>
                  {mockClients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                {quote.clientId && <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600 whitespace-pre-wrap border">{quote.clientAddress}</div>}
              </div>
            </div>

            {/* ... Dates Info ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
               <div>
                <label htmlFor="issueDate" className="block text-xs font-medium text-gray-500 uppercase">Date d'émission</label>
                <input type="date" name="issueDate" id="issueDate" value={quote.issueDate} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-theme-primary-500 focus:border-theme-primary-500" />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-xs font-medium text-gray-500 uppercase">Valide jusqu'au</label>
                <input type="date" name="expiryDate" id="expiryDate" value={quote.expiryDate} onChange={handleInputChange} readOnly={options.validityDuration !== 'custom'} className={`mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-theme-primary-500 focus:border-theme-primary-500 ${options.validityDuration !== 'custom' ? 'bg-gray-100' : ''}`} />
              </div>
               {options.showDeliveryDate && (
                <div>
                  <label htmlFor="deliveryDate" className="block text-xs font-medium text-gray-500 uppercase">Date de livraison</label>
                  <input type="date" name="deliveryDate" id="deliveryDate" value={quote.deliveryDate} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                </div>
              )}
            </div>

            {/* ... Free field (before) ... */}
            {options.showFreeField && options.freeFieldPosition === 'before' && (
               <div className="pt-4 border-t">
                  <label htmlFor="freeFieldContent" className="block text-sm font-medium text-theme-text">Champ libre</label>
                  <textarea name="freeFieldContent" id="freeFieldContent" value={quote.freeFieldContent} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" />
              </div>
            )}

            {/* ... Line Items Table ... */}
            <div className="overflow-x-auto pt-4 border-t">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-2/5">Produit/Service</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qté</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prix U. HT</th>
                    {options.showLineDiscount && <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remise</th>}
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">TVA</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Montant HT</th>
                    <th className="px-1 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quote.lineItems.map((item, index) => {
                    if (item.type !== 'product') return null;
                    return (
                    <tr key={item.id}>
                      <td><select value={item.productId || ''} onChange={(e) => handleLineItemChange(index, 'productId', e.target.value)} className="w-full p-1.5 border-gray-300 rounded-md text-sm"><option value="">Sélectionner</option>{mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                      <td><input type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))} className="w-16 p-1.5 border-gray-300 rounded-md text-sm text-right"/></td>
                      <td><input type="number" value={item.unitPrice} readOnly={!!item.productId} onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value))} className={`w-24 p-1.5 border-gray-300 rounded-md text-sm text-right ${!!item.productId ? 'bg-gray-100' : ''}`}/></td>
                      {options.showLineDiscount && (
                        <td className="flex items-center"><input type="number" value={item.discount} onChange={(e) => handleLineItemChange(index, 'discount', parseFloat(e.target.value))} className="w-20 p-1.5 border-gray-300 rounded-l-md text-sm text-right"/>
                          <select value={item.discountType} onChange={(e) => handleLineItemChange(index, 'discountType', e.target.value)} className="p-1.5 border-l-0 border-gray-300 rounded-r-md text-sm bg-gray-50"><option value="percentage">%</option><option value="amount">€</option></select>
                        </td>
                      )}
                      <td><input type="number" value={item.taxRate * 100} readOnly={!!item.productId} onChange={(e) => handleLineItemChange(index, 'taxRate', parseFloat(e.target.value)/100)} className={`w-20 p-1.5 border-gray-300 rounded-md text-sm text-right ${!!item.productId ? 'bg-gray-100' : ''}`}/></td>
                      <td className="text-right text-sm">{formatCurrency((item.quantity * item.unitPrice) * (1 - (item.discountType === 'percentage' ? item.discount / 100 : item.discount / (item.quantity * item.unitPrice || 1))))}</td>
                      <td><button onClick={() => removeLineItem(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button></td>
                    </tr>
                  )})}
                </tbody>
              </table>
              <button onClick={addLineItem} className="mt-4 flex items-center px-3 py-1.5 text-sm font-medium text-theme-primary-600 border border-theme-primary-500 rounded-md hover:bg-theme-primary-50"><PlusCircleIcon className="w-5 h-5 mr-1.5" />Ajouter une ligne</button>
            </div>
            
            {/* ... Free field (after) ... */}
            {options.showFreeField && options.freeFieldPosition === 'after' && (
               <div className="pt-4 border-t">
                  <label htmlFor="freeFieldContent" className="block text-sm font-medium text-theme-text">Champ libre</label>
                  <textarea name="freeFieldContent" id="freeFieldContent" value={quote.freeFieldContent} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" />
              </div>
            )}
            
            {/* ... Totals ... */}
            <div className="pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  {options.showDocumentDiscount && (
                    <div className="flex items-end gap-2 p-2 bg-gray-50 rounded-md">
                      <label className="text-sm font-medium text-gray-700">Remise globale:</label>
                      <input type="number" name="documentDiscount" value={quote.documentDiscount} onChange={handleNumericInputChange} className="w-24 p-1.5 border-gray-300 rounded-l-md text-sm text-right"/>
                      <select name="documentDiscountType" value={quote.documentDiscountType} onChange={handleInputChange} className="p-1.5 border-l-0 border-gray-300 rounded-r-md text-sm bg-gray-100"><option value="percentage">%</option><option value="amount">€</option></select>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  {Object.keys(totals.taxDetails).length > 0 && (
                    <div className="space-y-1 text-sm bg-slate-50 p-4 rounded-lg h-full">
                      <h4 className="font-semibold text-gray-800 border-b pb-1 mb-2">Détail TVA</h4>
                      {Object.entries(totals.taxDetails).sort(([a],[b]) => parseFloat(a) - parseFloat(b)).map(([rate, amount]) => (
                        <div key={rate} className="flex justify-between">
                          <span className="text-gray-600">TVA {(parseFloat(rate) * 100).toFixed(2)}%:</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold border-t pt-1 mt-2">
                        <span>Total TVA:</span>
                        <span>{formatCurrency(totals.totalTaxAmount)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Total HT brut:</span><span className="font-medium">{formatCurrency(totals.subtotalHT)}</span></div>
                  <div className="flex justify-between text-red-600"><span >Remises lignes:</span><span className="font-medium">-{formatCurrency(totals.totalLineDiscountAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Sous-total:</span><span className="font-medium">{formatCurrency(totals.subtotalAfterLineDiscount)}</span></div>
                  {options.showDocumentDiscount && <div className="flex justify-between text-red-600"><span>Remise globale:</span><span className="font-medium">-{formatCurrency(totals.documentDiscountAmount)}</span></div>}
                  <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total HT final:</span><span>{formatCurrency(totals.finalHT)}</span></div>
                  <div className="flex justify-between"><span>Montant TVA:</span><span>{formatCurrency(totals.totalTaxAmount)}</span></div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2"><span>Total TTC:</span><span className="text-theme-primary-600">{formatCurrency(totals.grandTotalTTC)}</span></div>
                </div>
              </div>
            </div>
            
            {/* ... Legal & Bank Info ... */}
            <div className="pt-6 border-t space-y-4">
                {options.showBankDetails && selectedBankAccount && (
                    <div>
                        <h4 className="font-semibold text-theme-text text-sm mb-2">Coordonnées bancaires</h4>
                        <div className="p-3 bg-gray-50 rounded-md border text-sm text-gray-700">
                            <p><strong>Banque:</strong> {selectedBankAccount.bankName}</p>
                            <p><strong>IBAN:</strong> {selectedBankAccount.iban}</p>
                            <p><strong>BIC:</strong> {selectedBankAccount.bic}</p>
                        </div>
                    </div>
                )}
                 {options.showLatePenalties && (
                    <div>
                         <label htmlFor="latePenaltiesText" className="block text-sm font-medium text-theme-text">Pénalités de retard</label>
                         <textarea name="latePenaltiesText" id="latePenaltiesText" value={quote.latePenaltiesText} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-xs" />
                    </div>
                 )}
                 {options.showDiscountConditions && (
                     <div>
                         <label htmlFor="discountConditionsText" className="block text-sm font-medium text-theme-text">Conditions d'escompte</label>
                         <textarea name="discountConditionsText" id="discountConditionsText" value={quote.discountConditionsText} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-xs" />
                     </div>
                 )}
            </div>
        </div>

        {/* OPTIONS PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-xl rounded-lg p-6 sticky top-6 space-y-6">
            <div>
              <h4 className="font-bold text-theme-text mb-3">Devis</h4>
              <div className="space-y-2">
                <CheckboxOption id="showDeliveryDate" label="Date de livraison" checked={options.showDeliveryDate} onChange={handleOptionsChange} />
                <CheckboxOption id="showLineDiscount" label="Remise par ligne" checked={options.showLineDiscount} onChange={handleOptionsChange} />
                <CheckboxOption id="showDocumentDiscount" label="Remise globale" checked={options.showDocumentDiscount} onChange={handleOptionsChange} />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-theme-text mb-3">Informations complémentaires</h4>
              <div className="space-y-2">
                <CheckboxOption id="showBankDetails" label="Coordonnées bancaires" checked={options.showBankDetails} onChange={handleOptionsChange} />
                {options.showBankDetails && (
                    <div className="pl-7">
                        <select name="bankAccountId" value={quote.bankAccountId} onChange={handleInputChange} className="w-full p-1.5 border border-gray-300 rounded-md text-xs">
                           {mockBankAccounts.map(b => <option key={b.id} value={b.id}>{b.bankName} (...{b.iban.slice(-4)})</option>)}
                        </select>
                    </div>
                )}
                <CheckboxOption id="showFreeField" label="Champ libre" checked={options.showFreeField} onChange={handleOptionsChange} />
                {options.showFreeField && (
                     <div className="pl-7 flex items-center space-x-4 text-xs">
                        <label><input type="radio" name="freeFieldPosition" value="before" checked={options.freeFieldPosition === 'before'} onChange={handleOptionsChange} /> Avant les lignes</label>
                        <label><input type="radio" name="freeFieldPosition" value="after" checked={options.freeFieldPosition === 'after'} onChange={handleOptionsChange} /> Après les lignes</label>
                     </div>
                )}
                <CheckboxOption id="showLatePenalties" label="Pénalités de retard" checked={options.showLatePenalties} onChange={handleOptionsChange} />
                <CheckboxOption id="showDiscountConditions" label="Conditions d'escompte" checked={options.showDiscountConditions} onChange={handleOptionsChange} />
              </div>
            </div>
            <div>
              <label htmlFor="validityDuration" className="block font-bold text-theme-text mb-2">Durée de validité</label>
              <select id="validityDuration" name="validityDuration" value={options.validityDuration} onChange={handleValidityChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm">
                <option value="15">15 jours</option>
                <option value="30">30 jours</option>
                <option value="60">60 jours</option>
                <option value="90">90 jours</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuoteEditorPage;
