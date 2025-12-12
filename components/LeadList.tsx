import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, LeadStatus, FinalResult } from '../types';
import { LeadForm } from './LeadForm';
import { Edit2, Trash2, Plus, Phone, Calendar, Search, Filter, MoreHorizontal } from 'lucide-react';

export const LeadList: React.FC = () => {
  const { leads, user, addLead, updateLead, deleteLead } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filter leads based on user role and search/status
  const filteredLeads = leads.filter(lead => {
    if (user?.role !== 'admin' && lead.consultantId !== user?.id) return false;

    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = filterStatus === 'ALL' || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSave = (data: any) => {
    if (editingLead) {
      updateLead(editingLead.id, data);
    } else {
      addLead(data);
    }
    setIsModalOpen(false);
    setEditingLead(undefined);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingLead(undefined);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-50 text-blue-700 border-blue-200';
      case LeadStatus.WON: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case LeadStatus.LOST: return 'bg-rose-50 text-rose-700 border-rose-200';
      case LeadStatus.NEGOTIATION: return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const isFollowUpDue = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateStr <= today;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Carteira de Leads</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie suas oportunidades e agendamentos.</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center px-5 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Lead
        </button>
      </div>

      {/* Filters & Search - Floating Bar Style */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 w-full rounded-xl border-slate-200 border-0 bg-slate-50 p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
          />
        </div>
        <div className="relative w-full md:w-56">
          <Filter className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-11 w-full rounded-xl border-slate-200 border-0 bg-slate-50 p-2.5 text-slate-900 focus:ring-2 focus:ring-violet-500 focus:bg-white appearance-none cursor-pointer transition-all"
          >
            <option value="ALL">Todos os Status</option>
            <option value={LeadStatus.NEW}>{LeadStatus.NEW}</option>
            <option value={LeadStatus.NEGOTIATION}>{LeadStatus.NEGOTIATION}</option>
            <option value={LeadStatus.WON}>{LeadStatus.WON}</option>
            <option value={LeadStatus.LOST}>{LeadStatus.LOST}</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-slate-900 text-lg">{lead.name}</h3>
                 <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
                   <Phone className="w-3.5 h-3.5 mr-1.5" /> {lead.phone}
                 </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(lead.status)}`}>
                 {lead.status}
               </span>
             </div>
             
             <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
               <div className="grid grid-cols-2 gap-2">
                 <div>
                    <span className="text-xs text-slate-400 block uppercase tracking-wider">Origem</span>
                    <span className="font-medium">{lead.source}</span>
                 </div>
                 <div>
                    <span className="text-xs text-slate-400 block uppercase tracking-wider">Interesse</span>
                    <span className="font-medium">{lead.modality}</span>
                 </div>
               </div>
             </div>

             {lead.nextContactDate && lead.status !== LeadStatus.WON && lead.status !== LeadStatus.LOST && (
               <div className={`text-sm flex items-center p-3 rounded-xl border ${isFollowUpDue(lead.nextContactDate) ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                 <Calendar className="w-4 h-4 mr-2" />
                 <span className="font-medium">Follow-up: {new Date(lead.nextContactDate).toLocaleDateString('pt-BR')}</span>
                 {isFollowUpDue(lead.nextContactDate) && <span className="ml-2 w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>}
               </div>
             )}

             <div className="flex justify-end pt-2">
               <button onClick={() => openEdit(lead)} className="flex items-center text-violet-600 font-medium bg-violet-50 px-4 py-2 rounded-lg text-sm">
                 <Edit2 className="w-4 h-4 mr-2" /> Gerenciar
               </button>
             </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Interesse</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Próx. Contato</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(lead.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-800">{lead.name}</div>
                    <div className="text-sm text-slate-400 flex items-center mt-0.5"><Phone className="w-3 h-3 mr-1" />{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-medium text-slate-700">{lead.modality}</div>
                     <div className="text-xs text-slate-400">{lead.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {lead.nextContactDate && lead.status !== LeadStatus.WON && lead.status !== LeadStatus.LOST ? (
                        <span className={`flex items-center font-medium ${isFollowUpDue(lead.nextContactDate) ? 'text-rose-600' : 'text-slate-500'}`}>
                          <Calendar className="w-4 h-4 mr-2 opacity-70" />
                          {new Date(lead.nextContactDate).toLocaleDateString('pt-BR')}
                          {isFollowUpDue(lead.nextContactDate) && <span className="ml-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                        </span>
                    ) : (
                        <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(lead)} className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium text-slate-600">Nenhum lead encontrado</p>
                      <p className="text-sm">Tente ajustar seus filtros de busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <LeadForm 
          initialData={editingLead} 
          onSave={handleSave} 
          onCancel={() => { setIsModalOpen(false); setEditingLead(undefined); }} 
        />
      )}
    </div>
  );
};