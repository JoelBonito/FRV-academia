import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LeadList } from './components/LeadList';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads'>('dashboard');

  if (!user) {
    return <Login />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' ? <Dashboard /> : <LeadList />}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}