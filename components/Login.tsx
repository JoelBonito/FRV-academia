import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, ArrowRight, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Brand / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-slate-900/90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
          alt="Gym Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-20 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center space-x-3">
             <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                <Dumbbell className="h-8 w-8 text-orange-500" />
             </div>
             <span className="text-2xl font-bold text-white tracking-wide">GymFlow</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Potencialize sua <span className="text-orange-500">energia</span> e vendas.
            </h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
              A ferramenta definitiva para consultores de alta performance. Foco nos resultados e motivação nas vendas.
            </p>
          </div>
          <div className="text-slate-500 text-sm">
            © 2025 GymFlow CRM. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Bem-vindo de volta</h2>
            <p className="mt-2 text-slate-500">
              Digite suas credenciais para acessar o painel.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">Email Corporativo</label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="text"
                    required
                    className="w-full rounded-xl border-slate-200 border bg-white p-3.5 pl-4 text-slate-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
                    placeholder="voce@gymflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-lg shadow-orange-600/30"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className="h-5 w-5 text-orange-200 group-hover:text-white transition-colors" />
              </span>
              Acessar Painel
            </button>
          </form>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Ambiente de Teste</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-600">Consultor</span>
                <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono">user@gymflow.com</code>
              </div>
              <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-600">Gerente</span>
                <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono">admin@gymflow.com</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};