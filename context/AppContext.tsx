import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, User, LeadStatus, OpportunitySource, ModalityInterest, TimeInterest, FirstContactResult, FinalResult } from '../types';
import { MOCK_USER, MOCK_ADMIN, OPPORTUNITY_SOURCES, MODALITIES, TIME_INTERESTS, FIRST_CONTACT_RESULTS, FINAL_RESULTS } from '../constants';

interface AppContextType {
  user: User | null;
  leads: Lead[];
  login: (email: string) => void;
  logout: () => void;
  addLead: (lead: Omit<Lead, 'id' | 'consultantId' | 'consultantName' | 'status'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getDashboardStats: () => any;
  // Modal State
  isModalOpen: boolean;
  editingLead: Lead | undefined;
  openNewLeadModal: () => void;
  openEditLeadModal: (lead: Lead) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to pick a random item from an array
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate realistic dates within the last 30 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split('T')[0];
};

const generateMockLeads = (): Lead[] => {
  const leads: Lead[] = [];
  const consultants = [
    { id: 'u1', name: 'Carlos Silva' },
    { id: 'u2', name: 'Ana Souza' },
    { id: 'u3', name: 'Roberto Santos' }
  ];

  // Generate 120 dummy leads to populate the charts richly
  for (let i = 0; i < 120; i++) {
    const consultant = getRandom(consultants);
    const source = getRandom(OPPORTUNITY_SOURCES);
    const modality = getRandom(MODALITIES);
    const time = getRandom(TIME_INTERESTS);
    
    // Logic to make results somewhat consistent
    let firstContact = getRandom(FIRST_CONTACT_RESULTS);
    let finalResult = FinalResult.PENDENTE;
    let status = LeadStatus.NEW;

    // Simulate realistic funnels
    if (firstContact === FirstContactResult.VENDEU) {
        finalResult = FinalResult.VENDEU;
        status = LeadStatus.WON;
    } else if (firstContact === FirstContactResult.SEM_INTERESSE || firstContact === FirstContactResult.NAO_ATENDE) {
        finalResult = getRandom([FinalResult.VALOR, FinalResult.OUTRA_ACADEMIA, FinalResult.NAO_COMPARECEU, FinalResult.PESQUISA]);
        status = LeadStatus.LOST;
    } else if (firstContact === FirstContactResult.AGENDAMENTO) {
        // 50% chance of closing after scheduling
        if (Math.random() > 0.5) {
            finalResult = FinalResult.VENDEU;
            status = LeadStatus.WON;
        } else {
            finalResult = getRandom([FinalResult.PENDENTE, FinalResult.NAO_COMPARECEU, FinalResult.ADESAO]);
            status = finalResult === FinalResult.PENDENTE ? LeadStatus.NEGOTIATION : LeadStatus.LOST;
        }
    } else {
        status = LeadStatus.NEGOTIATION;
    }

    leads.push({
      id: `lead-${i}`,
      consultantId: consultant.id,
      consultantName: consultant.name,
      date: getRandomDate(),
      name: `Cliente ${i + 1}`,
      phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
      source,
      modality,
      time,
      firstContactResult: firstContact,
      finalResult,
      status,
      nextContactDate: Math.random() > 0.7 ? new Date().toISOString().split('T')[0] : undefined
    });
  }

  return leads;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Global Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);

  useEffect(() => {
    // Load extensive mock data on init
    setLeads(generateMockLeads());
  }, []);

  const login = (email: string) => {
    if (email.includes('admin')) {
      setUser(MOCK_ADMIN);
    } else {
      setUser(MOCK_USER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'consultantId' | 'consultantName' | 'status'>) => {
    if (!user) return;
    
    // Auto-calculate status based on results
    let status = LeadStatus.NEW;
    if (leadData.finalResult === FinalResult.VENDEU) status = LeadStatus.WON;
    else if (
        leadData.finalResult !== FinalResult.PENDENTE
    ) {
        status = LeadStatus.LOST;
    } else if (leadData.firstContactResult === FirstContactResult.AGENDAMENTO) {
        status = LeadStatus.NEGOTIATION;
    }

    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      consultantId: user.id,
      consultantName: user.name,
      status
    };

    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== id) return lead;
      
      const updatedLead = { ...lead, ...updates };
      
      // Recalculate status logic (simplified)
      if (updatedLead.finalResult === FinalResult.VENDEU) updatedLead.status = LeadStatus.WON;
      else if (updatedLead.finalResult !== FinalResult.PENDENTE) updatedLead.status = LeadStatus.LOST;
      else updatedLead.status = LeadStatus.NEGOTIATION;

      return updatedLead;
    }));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const getDashboardStats = () => {
    // If admin, show all. If consultant, show only theirs.
    const relevantLeads = user?.role === 'admin' ? leads : leads.filter(l => l.consultantId === user?.id);

    const totalLeads = relevantLeads.length;
    const totalSales = relevantLeads.filter(l => l.finalResult === FinalResult.VENDEU).length;
    const activeLeads = relevantLeads.filter(l => l.status === LeadStatus.NEGOTIATION || l.status === LeadStatus.NEW).length;
    
    return {
      totalLeads,
      totalSales,
      conversionRate: totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : 0,
      activeLeads,
      rawData: relevantLeads
    };
  };

  // Modal Handlers
  const openNewLeadModal = () => {
    setEditingLead(undefined);
    setIsModalOpen(true);
  };

  const openEditLeadModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(undefined);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      leads, 
      login, 
      logout, 
      addLead, 
      updateLead, 
      deleteLead, 
      getDashboardStats,
      isModalOpen,
      editingLead,
      openNewLeadModal,
      openEditLeadModal,
      closeModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};