import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeadForm } from './LeadForm';
import { LayoutDashboard, Users, LogOut, Menu, X, Dumbbell, ChevronRight, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'leads';
  setActiveTab: (tab: 'dashboard' | 'leads') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout, isModalOpen, editingLead, closeModal, addLead, updateLead, openNewLeadModal } = useApp();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSaveLead = (data: any) => {
    if (editingLead) {
      updateLead(editingLead.id, data);
    } else {
      addLead(data);
    }
    closeModal();
  };

  const NavItem = ({ id, label, icon: Icon }: any) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
        className={`group flex items-center justify-between w-full px-4 py-3.5 mb-2 rounded-xl transition-all duration-200 ease-in-out ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
          <span className="font-medium tracking-wide">{label}</span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center h-20 px-6 border-b border-slate-800/50">
          {/* Logo with High Energy Gradient */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 shadow-lg shadow-orange-900/20 mr-3">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold text-white tracking-tight">GymFlow</span>
            <span className="block text-xs text-slate-500 font-medium tracking-wider">CRM PRO</span>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu Principal</p>
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="leads" label="Gestão de Leads" icon={Users} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center p-3 rounded-xl bg-slate-800/50 mb-3 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm z-10">
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-800 focus:outline-none transition-colors">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Spacer for mobile to push right content */}
          <div className="flex-1 lg:hidden"></div>

          <div className="flex items-center space-x-4">
             {/* Quick Action Button - Visible on all screens with text */}
             {/* Uses Orange for High Energy/Action */}
             <button 
              onClick={openNewLeadModal}
              className="flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 transition-all shadow-md shadow-orange-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </button>

            <div className="hidden lg:flex items-center text-slate-500 text-sm font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>

      {/* Global Modal */}
      {isModalOpen && (
        <LeadForm 
          initialData={editingLead} 
          onSave={handleSaveLead} 
          onCancel={closeModal} 
        />
      )}
    </div>
  );
};