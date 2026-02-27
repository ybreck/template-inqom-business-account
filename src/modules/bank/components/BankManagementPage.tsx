import React from 'react';
import { ModuleComponentProps } from '../types';
import { mockBankAccounts } from '../data';
import BankAccountCard from './BankAccountCard';
import { PlusIcon } from '../../../constants/icons';

const BankManagementPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-end gap-4">
                <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                    Ajouter un compte
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBankAccounts.map(account => (
                    <BankAccountCard key={account.id} account={account} onSubNavigate={onSubNavigate} />
                ))}
            </div>
        </div>
    );
};

export default BankManagementPage;
