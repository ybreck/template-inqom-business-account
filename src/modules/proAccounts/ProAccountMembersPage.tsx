import React, { useState } from 'react';
import { ModuleComponentProps } from './types';
import { Eye, ArrowLeftRight, UserPlus, Settings, CreditCard, Pencil, MoreHorizontal, X } from 'lucide-react';
import { mockPaymentCards } from './data';

export interface MemberPermission {
  accessAccount: boolean;
  makeTransfer: boolean;
  addBeneficiary: boolean;
  editSettings: boolean;
  addCard: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  permissions: MemberPermission;
  isInvited: boolean;
}

const generateRandomPhone = () => {
  const prefix = '+33';
  const secondDigit = Math.random() > 0.5 ? '6' : '7';
  const rest = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${secondDigit}${rest}`;
};

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Thomas Schrobitgen',
    email: 'thomas.schrobitgen@visma.com',
    phone: generateRandomPhone(),
    permissions: { accessAccount: true, makeTransfer: true, addBeneficiary: true, editSettings: true, addCard: true },
    isInvited: false,
  },
  {
    id: '2',
    name: 'Test User',
    email: 'yann.breck+testswan2@visma.com',
    phone: generateRandomPhone(),
    permissions: { accessAccount: true, makeTransfer: true, addBeneficiary: true, editSettings: false, addCard: false },
    isInvited: false,
  },
  {
    id: '3',
    name: 'Romain Valat',
    email: 'romain.valat@visma.com',
    phone: generateRandomPhone(),
    permissions: { accessAccount: true, makeTransfer: true, addBeneficiary: true, editSettings: true, addCard: true },
    isInvited: false,
  },
  {
    id: '4',
    name: 'Yann Breck',
    email: 'emilien@inqom.com',
    phone: generateRandomPhone(),
    permissions: { accessAccount: true, makeTransfer: true, addBeneficiary: true, editSettings: true, addCard: true },
    isInvited: false,
  },
  {
    id: '5',
    name: 'Nouveau User',
    email: 'nouveau@inqom.com',
    phone: generateRandomPhone(),
    permissions: { accessAccount: false, makeTransfer: false, addBeneficiary: false, editSettings: false, addCard: false },
    isInvited: true,
  }
];

const ProAccountMembersPage: React.FC<ModuleComponentProps> = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'cartes'>('details');

  const handleInvite = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isInvited: false, permissions: { accessAccount: true, makeTransfer: false, addBeneficiary: false, editSettings: false, addCard: false } } : m));
  };

  const handleSave = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    setEditingMember(null);
  };

  const openEditPanel = (member: Member) => {
    setEditingMember(member);
    setActiveTab('details');
  };

  const memberCards = editingMember ? mockPaymentCards.filter(card => card.cardholderName === editingMember.name && card.status === 'Active') : [];

  return (
    <div className="flex h-full relative">
      <div className={`flex-1 space-y-6 transition-all duration-300 ${editingMember ? 'mr-96' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-slate-900">Liste des membres</h3>
        </div>

        <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Numéro de téléphone</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {member.isInvited ? (
                        <button 
                          onClick={() => handleInvite(member.id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Inviter
                        </button>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          {member.permissions.accessAccount ? <Eye className="w-5 h-5 text-slate-700" /> : <Eye className="w-5 h-5 text-slate-300" />}
                          {member.permissions.makeTransfer ? <ArrowLeftRight className="w-5 h-5 text-slate-700" /> : <ArrowLeftRight className="w-5 h-5 text-slate-300" />}
                          {member.permissions.addBeneficiary ? <UserPlus className="w-5 h-5 text-slate-700" /> : <UserPlus className="w-5 h-5 text-slate-300" />}
                          {member.permissions.editSettings ? <Settings className="w-5 h-5 text-slate-700" /> : <Settings className="w-5 h-5 text-slate-300" />}
                          {member.permissions.addCard ? <CreditCard className="w-5 h-5 text-slate-700" /> : <CreditCard className="w-5 h-5 text-slate-300" />}
                          <button 
                            onClick={() => openEditPanel(member)}
                            className="ml-4 p-1 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side Panel for Editing */}
      {editingMember && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-900">Gérer un membre</h2>
            <button 
              onClick={() => setEditingMember(null)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
              onClick={() => setActiveTab('details')}
            >
              Détails
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'cartes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
              onClick={() => setActiveTab('cartes')}
            >
              Cartes ({memberCards.length})
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Nom</h4>
                  <p className="text-sm text-slate-600">{editingMember.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Email</h4>
                  <p className="text-sm text-slate-600">{editingMember.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Numéro de téléphone</h4>
                  <p className="text-sm text-slate-600">{editingMember.phone}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Droits</h4>
                  <div className="space-y-4">
                    <PermissionToggle 
                      label="Accéder au compte" 
                      icon={<Eye className="w-5 h-5 text-slate-500" />} 
                      checked={editingMember.permissions.accessAccount} 
                      onChange={(checked) => setEditingMember({...editingMember, permissions: {...editingMember.permissions, accessAccount: checked}})} 
                    />
                    <PermissionToggle 
                      label="Effectuer un virement" 
                      icon={<ArrowLeftRight className="w-5 h-5 text-slate-500" />} 
                      checked={editingMember.permissions.makeTransfer} 
                      onChange={(checked) => setEditingMember({...editingMember, permissions: {...editingMember.permissions, makeTransfer: checked}})} 
                    />
                    <PermissionToggle 
                      label="Ajouter un bénéficiaire" 
                      icon={<UserPlus className="w-5 h-5 text-slate-500" />} 
                      checked={editingMember.permissions.addBeneficiary} 
                      onChange={(checked) => setEditingMember({...editingMember, permissions: {...editingMember.permissions, addBeneficiary: checked}})} 
                    />
                    <PermissionToggle 
                      label="Modifier les paramètres du compte" 
                      icon={<Settings className="w-5 h-5 text-slate-500" />} 
                      checked={editingMember.permissions.editSettings} 
                      onChange={(checked) => setEditingMember({...editingMember, permissions: {...editingMember.permissions, editSettings: checked}})} 
                    />
                    <PermissionToggle 
                      label="Ajouter une carte" 
                      icon={<CreditCard className="w-5 h-5 text-slate-500" />} 
                      checked={editingMember.permissions.addCard} 
                      onChange={(checked) => setEditingMember({...editingMember, permissions: {...editingMember.permissions, addCard: checked}})} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Cartes actives</h4>
                {memberCards.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Aucune carte active pour ce membre.</p>
                ) : (
                  memberCards.map(card => (
                    <div key={card.id} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">•••• {card.last4Digits}</p>
                          <p className="text-xs text-slate-500">{card.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-900">{card.currentMonthSpending?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        <p className="text-[10px] text-slate-500">dépensé ce mois</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button 
              onClick={() => setEditingMember(null)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={() => handleSave(editingMember)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionToggle = ({ label, icon, checked, onChange }: { label: string, icon: React.ReactNode, checked: boolean, onChange: (checked: boolean) => void }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Custom Toggle Switch */}
        <button 
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
          role="switch"
          aria-checked={checked}
        >
          <span className="sr-only">Use setting</span>
          <span 
            aria-hidden="true" 
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm text-slate-700">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default ProAccountMembersPage;
