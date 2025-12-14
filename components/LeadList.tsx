import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeadStatus } from '../types';
import { Edit2, Trash2, Phone, Calendar, Search, Filter, Clock, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

export const LeadList: React.FC = () => {
  const { leads, user, deleteLead, openEditLeadModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
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

  const getStatusVariant = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'secondary';
      case LeadStatus.WON: return 'success';
      case LeadStatus.LOST: return 'destructive';
      case LeadStatus.NEGOTIATION: return 'warning';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return <Circle className="w-2.5 h-2.5 fill-current" />;
      case LeadStatus.WON: return <CheckCircle2 className="w-3.5 h-3.5" />;
      case LeadStatus.LOST: return <XCircle className="w-3.5 h-3.5" />;
      case LeadStatus.NEGOTIATION: return <Clock className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const isFollowUpDue = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateStr <= today;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Carteira de Leads</h2>
          <p className="text-muted-foreground mt-1">Gerencie suas oportunidades e agendamentos.</p>
        </div>
      </div>

      {/* Filters & Search - Floating Bar Style */}
      <Card variant="glass" className="p-2 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 bg-secondary/30 border-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative w-full md:w-56">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-11 w-full h-10 rounded-lg bg-secondary/30 border-none text-sm text-foreground focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-all outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value={LeadStatus.NEW}>{LeadStatus.NEW}</option>
            <option value={LeadStatus.NEGOTIATION}>{LeadStatus.NEGOTIATION}</option>
            <option value={LeadStatus.WON}>{LeadStatus.WON}</option>
            <option value={LeadStatus.LOST}>{LeadStatus.LOST}</option>
          </select>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="xl:hidden space-y-4">
        {filteredLeads.map(lead => (
          <Card key={lead.id} className="group">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{lead.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Phone className="w-3.5 h-3.5 mr-1.5" /> {lead.phone}
                  </div>
                </div>
                <Badge variant={getStatusVariant(lead.status)}>
                  {getStatusIcon(lead.status)}
                  {lead.status}
                </Badge>
              </div>

              <div className="text-sm bg-secondary/50 p-3 rounded-lg border border-border/50">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold">Origem</span>
                    <span className="font-medium text-foreground">{lead.source}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold">Interesse</span>
                    <span className="font-medium text-foreground">{lead.modality}</span>
                  </div>
                </div>
              </div>

              {lead.nextContactDate && lead.status !== LeadStatus.WON && lead.status !== LeadStatus.LOST && (
                <div className={`text-sm flex items-center p-3 rounded-xl border ${isFollowUpDue(lead.nextContactDate) ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-secondary/30 border-border text-muted-foreground'}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Follow-up: {new Date(lead.nextContactDate).toLocaleDateString('pt-BR')}</span>
                  {isFollowUpDue(lead.nextContactDate) && <span className="ml-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditLeadModal(lead)} className="text-primary hover:text-primary hover:bg-primary/10">
                  <Edit2 className="w-4 h-4 mr-2" /> Gerenciar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden xl:block overflow-hidden border-border bg-card/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Interesse</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Próx. Contato</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/30">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-secondary/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(lead.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-foreground">{lead.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center mt-0.5"><Phone className="w-3 h-3 mr-1" />{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{lead.modality}</div>
                    <div className="text-xs text-muted-foreground">{lead.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(lead.status)}>
                      {getStatusIcon(lead.status)}
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {lead.nextContactDate && lead.status !== LeadStatus.WON && lead.status !== LeadStatus.LOST ? (
                      <span className={`flex items-center font-medium ${isFollowUpDue(lead.nextContactDate) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar className="w-4 h-4 mr-2 opacity-70" />
                        {new Date(lead.nextContactDate).toLocaleDateString('pt-BR')}
                        {isFollowUpDue(lead.nextContactDate) && <span className="ml-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEditLeadModal(lead)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLead(lead.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium text-foreground">Nenhum lead encontrado</p>
                      <p className="text-sm">Tente ajustar seus filtros de busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};