import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { ModuleComponentProps, BankAccount } from '../types';
import { mockBankAccounts } from '../data';
import { ArrowLeftIcon, PencilIcon, ArrowPathIcon, TrashIcon } from '../../../constants/icons';

const formatCurrency = (value: number) => {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const generateBalanceHistory = (currentBalance: number): { name: string; solde: number }[] => {
  const data = [];
  let balance = currentBalance;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.45) * (currentBalance / 50); 
    balance -= change;
    data.push({ name: `J-${29 - i}`, solde: balance });
  }
  return data.reverse(); 
};

const BankAccountDetailPage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, themeColors }) => {
    const [account, setAccount] = useState<BankAccount | null>(null);

    useEffect(() => {
        if (activeSubPageId && activeSubPageId.startsWith('bank_detail?id=')) {
            const id = activeSubPageId.split('?id=')[1];
            const foundAccount = mockBankAccounts.find(acc => acc.id === id);
            if(foundAccount) {
                setAccount(foundAccount);
            } else {
                setAccount(null);
            }
        }
    }, [activeSubPageId]);

    const balanceHistory = useMemo(() => {
        return account ? generateBalanceHistory(account.balance) : [];
    }, [account]);

    const handleDeleteAccount = () => {
        if (account && window.confirm(`Êtes-vous sûr de vouloir supprimer le compte "${account.accountName}" ? Cette action est irréversible.`)) {
            console.log(`Deleting account ${account.id}... (simulation)`);
            // In a real app, you would also remove the account from the mock data or call an API
            alert("Le compte a été supprimé (simulation).");
            onSubNavigate?.('banque'); // Navigate back to the list
        }
    };

    if (!account) {
        return (
            <div className="p-6 bg-white rounded-lg shadow text-center">
                <p className="text-lg font-semibold text-theme-text">Compte non trouvé</p>
                <p className="text-sm text-gray-500 mb-4">L'identifiant du compte est manquant ou incorrect.</p>
                <button
                    onClick={() => onSubNavigate?.('banque')}
                    className="flex items-center mx-auto px-4 py-2 text-sm font-medium text-theme-primary-600 hover:text-theme-primary-800"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-1.5" />
                    Retour à la gestion des banques
                </button>
            </div>
        );
    }
    
    const { logo: Logo } = account;
    const chartColor = themeColors?.primary || '#2F30E0';

    return (
        <div className="space-y-6">
            <button
                onClick={() => onSubNavigate?.('banque')}
                className="flex items-center text-sm font-medium text-theme-primary-600 hover:text-theme-primary-800"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-1.5" />
                Retour à la gestion des banques
            </button>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="flex items-center space-x-4">
                        <Logo />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{account.accountName}</h2>
                            <p className="text-base text-gray-500">{account.bankName}</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                           <ArrowPathIcon className="w-4 h-4 mr-1.5"/> Synchroniser
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                           <PencilIcon className="w-4 h-4 mr-1.5"/> Modifier
                        </button>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <p className="text-gray-500">Solde actuel</p>
                        <p className="text-xl font-semibold text-theme-text">{formatCurrency(account.balance)}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">IBAN</p>
                        <p className="font-mono text-theme-text">{account.iban}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">BIC / Statut</p>
                        <p className="font-mono text-theme-text">{account.bic} / <span className={account.status === 'Actif' ? 'text-green-600' : 'text-gray-600'}>{account.status}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold text-theme-text mb-4">Évolution du solde (30 jours)</h3>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ fontSize: '12px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}
                            formatter={(value: number) => [formatCurrency(value as number), 'Solde']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area type="monotone" dataKey="solde" stroke={chartColor} fill="url(#colorBalance)" strokeWidth={2} />
                    </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            <div className="mt-8 pt-6 border-t border-red-200">
                <h3 className="text-lg font-semibold text-red-700">Zone de danger</h3>
                <div className="mt-4 bg-red-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-medium text-red-800">Supprimer ce compte bancaire</p>
                        <p className="text-sm text-red-700 mt-1">
                            Une fois le compte supprimé, toutes les données associées seront définitivement perdues. Cette action ne peut pas être annulée.
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Supprimer le compte
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankAccountDetailPage;