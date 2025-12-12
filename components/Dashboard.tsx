import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Lead } from '../types';
import { getActionCategory } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, Target, Filter } from 'lucide-react';

const COLORS = ['#7c3aed', '#db2777', '#2563eb', '#059669', '#d97706', '#dc2626', '#475569'];

export const Dashboard: React.FC = () => {
  const { getDashboardStats } = useApp();
  const stats = getDashboardStats();
  const leads: Lead[] = stats.rawData;

  // --- Data Processors based on PDF Requirements ---

  // 1. Modalidade Interesse
  const modalityData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.modality] = (counts[l.modality] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // 2. Horário Interesse
  const timeData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.time] = (counts[l.time] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // 3. Ação (Grouping Opportunity Source into High Level Categories: Visita, Ligação, etc.)
  const actionData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      const cat = getActionCategory(l.source).toUpperCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // 4. Oportunidade (Detailed Source)
  const opportunityData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // 5. Resultado Primeiro Contato
  const firstContactData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.firstContactResult] = (counts[l.firstContactResult] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // 6. Resultado Final
  const finalResultData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.finalResult] = (counts[l.finalResult] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);


  // Helper Component for Chart Container
  const ChartCard = ({ title, children, fullWidth = false, height = 300 }: any) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col ${fullWidth ? 'lg:col-span-2' : ''}`}>
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
        <span className="w-1 h-6 bg-violet-600 rounded-full mr-3"></span>
        {title}
      </h3>
      <div style={{ height: height }} className="w-full">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-violet-900/20">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-white/10 rounded-xl"><Users className="w-6 h-6" /></div>
             <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-slate-200 text-sm font-medium uppercase tracking-wide">Total de Leads</p>
          <h3 className="text-4xl font-bold mt-1">{stats.totalLeads}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Vendas Realizadas</p>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.totalSales}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">+12% vs mês anterior</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Taxa de Conversão</p>
            <Target className="w-5 h-5 text-violet-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.conversionRate}%</h3>
          <p className="text-xs text-slate-400 mt-1">Meta: 30%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Modalidade Interesse */}
        <ChartCard title="Modalidade de Interesse">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modalityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {modalityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Horário Interesse */}
        <ChartCard title="Horário de Interesse">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={40} label={{ position: 'right', fill: '#64748b', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Ação */}
        <ChartCard title="Ação (Origem Agrupada)">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={actionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Oportunidade (Detailed) */}
        <ChartCard title="Oportunidade (Detalhamento)" height={500}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={opportunityData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={180} 
                tick={{fontSize: 11, fill: '#475569', fontWeight: 500}} 
                interval={0}
              />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={18} label={{ position: 'right', fill: '#64748b', fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Resultado Primeiro Contato */}
        <ChartCard title="Resultado 1º Contato">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={firstContactData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 11, fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#64748b' }} />
              </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Resultado Final */}
        <ChartCard title="Resultado Final">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={finalResultData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 11, fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#64748b' }} />
              </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};