import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeadForm } from './LeadForm';
import { LayoutDashboard, Users, LogOut, Menu, X, Dumbbell, ChevronRight, Plus, Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'leads';
  setActiveTab: (tab: 'dashboard' | 'leads') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout, isModalOpen, editingLead, closeModal, addLead, updateLead, openNewLeadModal, theme, toggleTheme } = useApp();
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
        className={`group flex items-center justify-between w-full px-4 py-3.5 mb-2 rounded-xl transition-all duration-200 ease-in-out ${isActive
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
          : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
          }`}
      >
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-secondary-foreground'}`} />
          <span className="font-medium tracking-wide">{label}</span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm xl:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-out xl:translate-x-0 xl:static xl:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center h-20 px-6 border-b border-border/50">
          {/* Logo with High Energy Gradient (GymFlow Brand) */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-gym-orange to-brand-gym-red shadow-lg shadow-brand-gym-orange/20 mr-3">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold text-foreground tracking-tight">GymFlow</span>
            <span className="block text-xs text-muted-foreground font-medium tracking-wider">CRM PRO</span>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Menu Principal</p>
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="leads" label="Gestão de Leads" icon={Users} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-card/50">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tema</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              title="Alternar Tema"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </Button>
          </div>

          <div className="flex items-center p-3 rounded-xl bg-secondary/50 mb-3 border border-border/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Sistema
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-sm z-10 glass">
          <button onClick={toggleSidebar} className="xl:hidden text-muted-foreground hover:text-foreground focus:outline-none transition-colors">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Spacer for structure */}
          <div className="flex-1 xl:flex-none"></div>

          <div className="flex items-center space-x-4">
            <div className="hidden xl:flex items-center text-muted-foreground text-sm font-medium bg-secondary/50 px-4 py-2 rounded-full border border-border mr-2">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>

            {/* Quick Action Button - Right Aligned */}
            <Button
              onClick={openNewLeadModal}
              className="bg-brand-gym-orange hover:bg-brand-gym-orange/90 text-white shadow-md shadow-brand-gym-orange/20 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
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