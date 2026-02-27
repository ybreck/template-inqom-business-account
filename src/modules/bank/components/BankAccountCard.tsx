import React from 'react';
import { BankAccount } from '../types';
import { PencilIcon, ArrowPathIcon } from '../../../constants/icons';

interface BankAccountCardProps {
    account: BankAccount;
    onSubNavigate?: (subPageId: string) => void;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return `le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
};

const BankAccountCard: React.FC<BankAccountCardProps> = ({ account, onSubNavigate }) => {
    const { logo: Logo, accountName, bankName, balance, iban, bic, status, lastUpdated } = account;

    const statusClasses = status === 'Actif' 
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-200 text-gray-800';

    const handleCardClick = () => {
        if (onSubNavigate) {
            onSubNavigate(`bank_detail?id=${account.id}`);
        }
    }

    return (
        <div 
            onClick={handleCardClick}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-xl hover:border-theme-primary-300 transition-all duration-200"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <Logo />
                    <div>
                        <h3 className="font-semibold text-gray-800">{accountName}</h3>
                        <p className="text-sm text-gray-500">{bankName}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses}`}>
                    {status}
                </span>
            </div>

            <div>
                <p className="text-sm text-gray-500">Solde</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
            </div>

            <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                    <span className="bg-gray-200 text-gray-700 font-semibold rounded px-1.5 py-0.5 text-[10px]">IBAN</span>
                    <span>{iban}</span>
                </div>
                 <div className="flex items-center space-x-2">
                    <span className="bg-gray-200 text-gray-700 font-semibold rounded px-1.5 py-0.5 text-[10px]">BIC</span>
                    <span>{bic}</span>
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
                 <div className="flex items-center text-xs text-gray-500">
                    <ArrowPathIcon className="w-3.5 h-3.5 mr-1.5"/>
                    <span>M.à.j {formatLastUpdated(lastUpdated)}</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); alert('Fonctionnalité d\'édition à implémenter.'); }} 
                    className="text-gray-400 hover:text-theme-primary-500"
                    aria-label={`Modifier le compte ${accountName}`}
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default BankAccountCard;