import React from 'react';
import { CyberProvider, useCyber } from './context/CyberContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Views
import ClientsView from './components/views/ClientsView';
import OverviewView from './components/views/OverviewView';
import EngagementsView from './components/views/EngagementsView';
import FindingsView from './components/views/FindingsView';
import RiskRegisterView from './components/views/RiskRegisterView';
import ManagedITView from './components/views/ManagedITView';
import VendorRiskView from './components/views/VendorRiskView';
import TabletopView from './components/views/TabletopView';
import TeamView from './components/views/TeamView';
import ReportsView from './components/views/ReportsView';

// Modals
import CreateClientModal from './components/modals/CreateClientModal';
import CreateEngagementModal from './components/modals/CreateEngagementModal';
import CreateFindingModal from './components/modals/CreateFindingModal';
import CreateRiskModal from './components/modals/CreateRiskModal';
import CreateVendorModal from './components/modals/CreateVendorModal';
import CreateTTXModal from './components/modals/CreateTTXModal';
import CreateTicketModal from './components/modals/CreateTicketModal';
import ExecutiveReportModal from './components/modals/ExecutiveReportModal';

function DashboardContent() {
  const { activeTab, isReportModalOpen } = useCyber();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'clients':
        return <ClientsView />;
      case 'overview':
        return <OverviewView />;
      case 'engagements':
        return <EngagementsView />;
      case 'findings':
        return <FindingsView />;
      case 'risks':
        return <RiskRegisterView />;
      case 'managedIT':
        return <ManagedITView />;
      case 'vendors':
        return <VendorRiskView />;
      case 'tabletop':
        return <TabletopView />;
      case 'team':
        return <TeamView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <ClientsView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* When the report modal is open, print only the modal */}
      <div className={`flex-1 flex overflow-hidden ${isReportModalOpen ? 'print:hidden' : ''}`}>
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 cyber-grid-pattern">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Action Modals */}
      <CreateClientModal />
      <CreateEngagementModal />
      <CreateFindingModal />
      <CreateRiskModal />
      <CreateVendorModal />
      <CreateTTXModal />
      <CreateTicketModal />
      <ExecutiveReportModal />
    </div>
  );
}

export default function App() {
  return (
    <CyberProvider>
      <DashboardContent />
    </CyberProvider>
  );
}
