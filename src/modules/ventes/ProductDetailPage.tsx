import React, { useState, useEffect } from 'react';
import { ModuleComponentProps, Product } from '../../../types';
import { mockProducts } from './data/products';
import { ArrowLeftIcon } from '../../constants/icons';

const emptyProduct: Product = {
  id: 'new',
  name: '',
  type: 'Livraison de biens',
  category: 'Produit finis',
  reference: '',
  description: '',
  unitPrice: 0,
  unit: 'Unité',
  taxRate: 20,
};

const ProductDetailPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [initialProduct, setInitialProduct] = useState<Product | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('product_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      if (id === 'new') {
        setInitialProduct(emptyProduct);
        setProduct(emptyProduct);
        setIsNew(true);
      } else {
        const foundProduct = mockProducts.find(p => p.id === id);
        if (foundProduct) {
          const deepCopy = JSON.parse(JSON.stringify(foundProduct));
          setInitialProduct(deepCopy);
          setProduct(deepCopy);
          setIsNew(false);
        } else {
          setProduct(null); // Not found
        }
      }
      setIsDirty(false); // Reset dirty state on new product load
    }
  }, [activeSubPageId]);

  useEffect(() => {
    if (product && initialProduct) {
      setIsDirty(JSON.stringify(product) !== JSON.stringify(initialProduct));
    }
  }, [product, initialProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prevProduct => {
      if (!prevProduct) return null;
      // Handle numeric fields
      if (name === 'unitPrice' || name === 'taxRate') {
          return { ...prevProduct, [name]: parseFloat(value) || 0 };
      }
      return { ...prevProduct, [name]: value };
    });
  };

  const handleSave = () => {
    if (!product) return;
    console.log("Saving product:", product);
    alert(`Produit "${product.name}" sauvegardé (simulation).`);
    setInitialProduct(product);
    setIsDirty(false);
    onSubNavigate?.('produits');
  };
  
  const handleArchive = () => {
    if (product && window.confirm(`Êtes-vous sûr de vouloir archiver le produit "${product.name}" ?`)) {
      console.log("Archiving product:", product.id);
      alert(`Produit "${product.name}" archivé (simulation).`);
      onSubNavigate?.('produits');
    }
  };

  const handleCancel = () => {
    onSubNavigate?.('produits');
  };

  if (!product) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Produit non trouvé</h2>
        <button onClick={() => onSubNavigate?.('produits')} className="mt-4 text-theme-primary-500">Retour à la liste</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-semibold text-theme-text">{isNew ? 'Nouveau Produit' : product.name}</h2>
      </div>
      
      <div className="space-y-6">
        {/* Informations Générales */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">INFORMATIONS GÉNÉRALES</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="text-xs text-gray-600">Nom *</label><input type="text" name="name" value={product.name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div><label className="text-xs text-gray-600">Type *</label>
              <select name="type" value={product.type} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                <option value="Livraison de biens">Livraison de biens</option>
                <option value="Prestation de service">Prestation de service</option>
              </select>
            </div>
            <div><label className="text-xs text-gray-600">Catégorie de produit *</label>
              <select name="category" value={product.category} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                <option value="Produit finis">Produit finis</option>
                <option value="Matière première">Matière première</option>
                <option value="Service">Service</option>
              </select>
            </div>
            <div><label className="text-xs text-gray-600">Référence</label><input type="text" name="reference" value={product.reference} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/></div>
            <div className="md:col-span-4"><label className="text-xs text-gray-600">Description</label><textarea name="description" value={product.description} onChange={handleInputChange} rows={4} className="w-full mt-1 p-2 border rounded-md"/></div>
          </div>
        </div>

        {/* Informations Tarifaires */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">INFORMATIONS TARIFAIRES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-600">Prix Unit. HT *</label>
              <div className="relative mt-1">
                <input type="number" name="unitPrice" value={product.unitPrice} onChange={handleInputChange} className="w-full p-2 pr-8 border rounded-md"/>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">€</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Unité *</label>
              <select name="unit" value={product.unit} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                <option value="Unité">Unité</option>
                <option value="Heure">Heure</option>
                <option value="Jour">Jour</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Taux de TVA *</label>
              <select name="taxRate" value={product.taxRate} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                <option value={20}>20 %</option>
                <option value={10}>10 %</option>
                <option value={12}>12 %</option>
                <option value={15}>15 %</option>
                <option value={5.5}>5.5 %</option>
                <option value={0}>0 %</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="mt-8 pt-6 flex justify-end items-center space-x-3">
        <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Annuler</button>
        {!isNew && <button onClick={handleArchive} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Archiver</button>}
        <button onClick={handleSave} disabled={!isDirty} className="px-6 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;