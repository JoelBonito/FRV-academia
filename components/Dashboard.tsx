import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Lead } from '../types';
import { getActionCategory } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, Target, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

// New Palette: Orange (Energy), Blue (Focus), Green (Growth), Yellow (Optimism), Red (Alert), Slate (Neutral)
// Palette mapped to Design System Tokens
const COLORS = [
  'hsl(var(--brand-gym-orange))', // Energy (GymFlow Brand)
  'hsl(var(--info))',             // Focus (Blue)
  'hsl(var(--success))',          // Growth (Green)
  'hsl(var(--warning))',          // Optimism (Yellow)
  'hsl(var(--destructive))',      // Alert (Red)
  'hsl(var(--muted-foreground))'  // Neutral (Slate)
];

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


  // Helper Component for Chart Container using Design System Card
  const ChartCard = ({ title, children, fullWidth = false, height = 300 }: any) => (
    <Card className={`flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 ${fullWidth ? 'lg:col-span-2' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-foreground flex items-center">
          <span className="w-1 h-5 bg-primary rounded-full mr-3"></span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px] p-4">
        <div style={{ height: height }} className="w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Total Leads - Premium Gradient */}
        <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary border-none text-white shadow-lg shadow-brand-primary/20">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10"><Users className="w-6 h-6 text-white" /></div>
              <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded text-blue-100">Visão Geral</span>
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Total de Leads</p>
              <h3 className="text-4xl font-bold mt-1 tracking-tight">{stats.totalLeads}</h3>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Sales */}
        <Card className="hover:border-success/50 transition-colors">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Vendas Realizadas</p>
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{stats.totalSales}</h3>
            <p className="text-xs text-success font-semibold mt-1 flex items-center">
              +12% <span className="text-muted-foreground font-normal ml-1">vs mês anterior</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Conversion */}
        <Card className="hover:border-brand-gym-orange/50 transition-colors">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Taxa de Conversão</p>
              <div className="p-2 bg-brand-gym-orange/10 rounded-lg">
                <Target className="w-5 h-5 text-brand-gym-orange" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{stats.conversionRate}%</h3>
            <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-brand-gym-orange h-full rounded-full" style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium">Meta Anual: 30%</p>
          </CardContent>
        </Card>
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
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={40} label={{ position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Ação */}
        <ChartCard title="Ação (Origem Agrupada)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={actionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="hsl(var(--brand-gym-orange))" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Oportunidade (Detailed) */}
        <ChartCard title="Oportunidade (Detalhamento)" height={500}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={opportunityData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={180}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                interval={0}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="hsl(var(--brand-primary))" radius={[0, 4, 4, 0]} barSize={18} label={{ position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Resultado Primeiro Contato */}
        <ChartCard title="Resultado 1º Contato">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={firstContactData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: 'hsl(var(--muted-foreground))' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Resultado Final */}
        <ChartCard title="Resultado Final">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={finalResultData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="value" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: 'hsl(var(--muted-foreground))' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};