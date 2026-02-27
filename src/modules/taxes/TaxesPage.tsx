import React, { useState } from 'react';
import { Deadline, ModuleComponentProps } from './types';
import { vatSummaryData, deadlinesData, eReportingData, mockEreportingHistory } from './data';
import VatSummaryCard from './components/VatSummaryCard';
import VatCreditAlert from './components/VatCreditAlert';
import DeadlinesCarousel from './components/DeadlinesCarousel';
import EReportingCard from './components/EReportingCard';
import DeclarationsHistoryList from './components/DeclarationsHistoryList';
import ContactExpertComptableModal from './components/ContactExpertComptableModal'; // Import modal
import EReportingStatusHistoryModal from './components/EReportingStatusHistoryModal';

const TaxesPage: React.FC<ModuleComponentProps> = (props) => {
  const [activeTab, setActiveTab] = useState('taxes');
  
  // State for the contact modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState('');
  const [modalReason, setModalReason] = useState('');

  // State for the history modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleOpenModal = (subject: string, reason: string) => {
    setModalSubject(subject);
    setModalReason(reason);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContactForVatCredit = () => {
    handleOpenModal('Point sur la TVA (Juillet 2025)', 'Question sur le crédit de TVA');
  };

  const handleRequestVatRefund = () => {
    handleOpenModal('Point sur la TVA (Juillet 2025)', 'Demander le crédit de TVA');
  };

  const handleContactForDeadline = (deadline: Deadline) => {
    handleOpenModal(`Échéance: ${deadline.title}`, 'Question sur une échéance');
  };

  return (
    <div className="space-y-6">
      <ContactExpertComptableModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subject={modalSubject}
        defaultReason={modalReason}
      />
      <EReportingStatusHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={mockEreportingHistory}
      />
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('taxes')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm ${
              activeTab === 'taxes'
                ? 'border-theme-primary-500 text-theme-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === 'taxes' ? 'page' : undefined}
          >
            Taxes
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm ${
              activeTab === 'history'
                ? 'border-theme-primary-500 text-theme-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historique des déclarations
          </button>
        </nav>
      </div>
      
      {activeTab === 'taxes' && (
        <div className="space-y-8">
            <VatSummaryCard data={vatSummaryData} onContact={handleContactForVatCredit} />
            {vatSummaryData.credit > 0 && <VatCreditAlert creditAmount={vatSummaryData.credit} onRequestRefund={handleRequestVatRefund} />}
            <DeadlinesCarousel deadlines={deadlinesData} onContactDeadline={handleContactForDeadline} />
            <EReportingCard data={eReportingData} onViewHistory={() => setIsHistoryModalOpen(true)} />
        </div>
      )}
      
      {activeTab === 'history' && (
        <DeclarationsHistoryList />
      )}
    </div>
  );
};

export default TaxesPage;
