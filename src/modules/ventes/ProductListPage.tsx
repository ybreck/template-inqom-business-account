import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, Product } from '../../../types';
import { mockProducts } from './data/products';
import { 
    MagnifyingGlassIcon, 
    FilterIcon,
    PlusIcon,
    ArrowPathIcon,
} from '../../constants/icons';

interface ProductListPageProps extends ModuleComponentProps {}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

const ProductListPage: React.FC<ProductListPageProps> = ({ onSubNavigate }) => {
    const [products] = useState<Product[]>(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterValues, setFilterValues] = useState({
        minPrice: '',
        maxPrice: '',
        minTax: '',
        maxTax: '',
    });

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const { minPrice, maxPrice, minTax, maxTax } = filterValues;
            const searchTermLower = searchTerm.toLowerCase();

            const matchesSearch = searchTermLower === '' ||
                product.name.toLowerCase().includes(searchTermLower) ||
                product.reference.toLowerCase().includes(searchTermLower);

            const minP = parseFloat(minPrice);
            const maxP = parseFloat(maxPrice);
            const matchesMinPrice = !minPrice || isNaN(minP) || product.unitPrice >= minP;
            const matchesMaxPrice = !maxPrice || isNaN(maxP) || product.unitPrice <= maxP;

            const minT = parseFloat(minTax);
            const maxT = parseFloat(maxTax);
            const matchesMinTax = !minTax || isNaN(minT) || product.taxRate >= minT;
            const matchesMaxTax = !maxTax || isNaN(maxT) || product.taxRate <= maxT;

            return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesMinTax && matchesMaxTax;
        });
    }, [products, searchTerm, filterValues]);

    const resetFilters = () => {
        setFilterValues({ minPrice: '', maxPrice: '', minTax: '', maxTax: '' });
        setSearchTerm('');
    };

    const handleViewProductDetail = (productId: string) => {
        if (onSubNavigate) {
            onSubNavigate(`product_detail?id=${productId}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-theme-text">Produits</h2>
                <button
                    onClick={() => onSubNavigate?.('product_detail?id=new')}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Nouveau produit
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Rechercher par nom, référence..."
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <button
                        onClick={() => setShowFilters(prev => !prev)}
                        className={`p-2 rounded-md border transition-colors ${showFilters ? 'bg-theme-primary-100 border-theme-primary-300 text-theme-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                        aria-label="Afficher les filtres"
                        aria-expanded={showFilters}
                    >
                        <FilterIcon className="w-5 h-5" />
                    </button>
                </div>
                {showFilters && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center gap-2">
                             <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                    <label className="text-sm font-medium text-gray-500 pl-2">Prix unitaire HT</label>
                                    <input type="number" placeholder="Min" value={filterValues.minPrice} onChange={e => setFilterValues(prev => ({...prev, minPrice: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                    <span className="text-gray-400">-</span>
                                    <input type="number" placeholder="Max" value={filterValues.maxPrice} onChange={e => setFilterValues(prev => ({...prev, maxPrice: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                </div>
                                 <div className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                    <label className="text-sm font-medium text-gray-500 pl-2">TVA (%)</label>
                                    <input type="number" placeholder="Min" value={filterValues.minTax} onChange={e => setFilterValues(prev => ({...prev, minTax: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                    <span className="text-gray-400">-</span>
                                    <input type="number" placeholder="Max" value={filterValues.maxTax} onChange={e => setFilterValues(prev => ({...prev, maxTax: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                </div>
                             </div>
                            <button onClick={resetFilters} className="flex-shrink-0 flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-white rounded-md hover:bg-gray-100 border border-gray-300">
                                <ArrowPathIcon className="w-3 h-3 mr-1" />
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="space-y-3">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleViewProductDetail(product.id)}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border cursor-pointer border-theme-secondary-gray-200"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleViewProductDetail(product.id)}
                        aria-labelledby={`product-title-${product.id}`}
                    >
                        <div className="p-4 flex items-center">
                            <div className="flex-1 min-w-0">
                                <h3 id={`product-title-${product.id}`} className="text-base font-semibold text-theme-text truncate" title={product.name}>
                                    {product.name}
                                </h3>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                                    <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                                        Référence: <strong className="font-semibold">{product.reference}</strong>
                                    </span>
                                    <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                                        Unité: <strong className="font-semibold">{product.unit}</strong>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8 ml-4">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Prix unitaire HT</p>
                                    <p className="text-lg font-bold text-theme-text">{formatCurrency(product.unitPrice)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">TVA</p>
                                    <p className="text-lg font-bold text-theme-text">{product.taxRate} %</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        Aucun produit ne correspond à vos critères de recherche.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;