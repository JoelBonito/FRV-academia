import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      // Simulating network request for better UX feel
      setTimeout(() => {
        login(email);
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* Left Side - Brand / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-slate-950/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Gym Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 animate-fade-in"
        />
        <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center space-x-3 animate-enter">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
              <Dumbbell className="h-8 w-8 text-orange-500" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide drop-shadow-md">GymFlow</span>
          </div>

          <div className="space-y-6 max-w-lg animate-enter" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-5xl font-bold text-white leading-tight drop-shadow-sm">
              Potencialize sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">energia</span> e suas vendas.
            </h1>
            <p className="text-slate-200 text-lg leading-relaxed font-light">
              A ferramenta definitiva para consultores de alta performance.
              <span className="block mt-2 text-white font-medium">Foco nos resultados. Motivação nas vendas.</span>
            </p>
          </div>

          <div className="text-slate-400 text-sm font-medium animate-enter" style={{ animationDelay: '0.2s' }}>
            © {new Date().getFullYear()} GymFlow CRM. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="max-w-md w-full space-y-10 animate-enter">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Bem-vindo de volta</h2>
            <p className="text-muted-foreground text-lg">
              Digite suas credenciais para acessar o painel de alta performance.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-sm font-semibold text-foreground ml-1">Email Corporativo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="email-address"
                    name="email"
                    type="text"
                    required
                    className="pl-10 py-5 text-base rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-sm"
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

            <Button
              type="submit"
              variant="default" // Usando default mas estilizado com classes para o gradiente específico
              size="lg"
              className="w-full py-6 text-base font-bold rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
              isLoading={isLoading}
            >
              {!isLoading && (
                <span className="flex items-center">
                  Acessar Painel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <Card variant="glass" className="bg-secondary/30 border-dashed border-2">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Ambiente de Teste Seguro</span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-sm p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                  <span className="flex items-center text-muted-foreground"><User className="w-4 h-4 mr-2" /> Consultor</span>
                  <code className="bg-secondary px-2 py-1 rounded text-foreground font-mono text-xs cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => setEmail('user@gymflow.com')}>user@gymflow.com</code>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                  <span className="flex items-center text-muted-foreground"><User className="w-4 h-4 mr-2 text-purple-500" /> Gerente</span>
                  <code className="bg-secondary px-2 py-1 rounded text-foreground font-mono text-xs cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => setEmail('admin@gymflow.com')}>admin@gymflow.com</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};