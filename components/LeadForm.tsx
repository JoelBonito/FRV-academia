import React, { useState, useEffect } from 'react';
import { Lead, OpportunitySource, ModalityInterest, TimeInterest, FirstContactResult, FinalResult } from '../types';
import { OPPORTUNITY_SOURCES, MODALITIES, TIME_INTERESTS, FIRST_CONTACT_RESULTS, FINAL_RESULTS } from '../constants';
import { X, Save, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface LeadFormProps {
  initialData?: Lead;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    email: '',
    source: OPPORTUNITY_SOURCES[0],
    modality: MODALITIES[0],
    time: TIME_INTERESTS[0],
    firstContactResult: FIRST_CONTACT_RESULTS[0],
    finalResult: FinalResult.PENDENTE,
    nextContactDate: '',
    comments: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email || '',
        source: initialData.source,
        modality: initialData.modality,
        time: initialData.time,
        firstContactResult: initialData.firstContactResult,
        finalResult: initialData.finalResult,
        nextContactDate: initialData.nextContactDate || '',
        comments: initialData.comments || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const InputGroup = ({ label, children }: any) => (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide ml-1">{label}</label>
      {children}
    </div>
  );

  const selectClass = "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>

      {/* Modal Content */}
      <Card className="relative w-full max-w-3xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border bg-card">
          <div>
            <CardTitle>{initialData ? 'Editar Lead' : 'Novo Cadastro'}</CardTitle>
            <CardDescription>Preencha os detalhes da oportunidade.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <div className="overflow-y-auto max-h-[70vh] p-8 space-y-8 bg-card">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-primary border-b border-primary/20 pb-2 mb-4">Dados Pessoais</h4>

                <InputGroup label="Data do Contato">
                  <Input required type="date" name="date" value={formData.date} onChange={handleChange} />
                </InputGroup>

                <InputGroup label="Nome do Cliente">
                  <Input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Ana Silva" />
                </InputGroup>

                <InputGroup label="Telefone / WhatsApp">
                  <Input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999" />
                </InputGroup>

                <InputGroup label="Email (Opcional)">
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="cliente@email.com" />
                </InputGroup>
              </div>

              {/* Interest Info */}
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-primary border-b border-primary/20 pb-2 mb-4">Interesse</h4>

                <InputGroup label="Origem da Oportunidade">
                  <select name="source" value={formData.source} onChange={handleChange} className={selectClass}>
                    {OPPORTUNITY_SOURCES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </InputGroup>

                <InputGroup label="Modalidade">
                  <select name="modality" value={formData.modality} onChange={handleChange} className={selectClass}>
                    {MODALITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </InputGroup>

                <InputGroup label="Horário de Preferência">
                  <select name="time" value={formData.time} onChange={handleChange} className={selectClass}>
                    {TIME_INTERESTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </InputGroup>
              </div>
            </div>

            <div className="bg-secondary/20 p-6 rounded-xl border border-border/50">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                Resultado e Follow-up
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Resultado 1º Contato">
                  <select name="firstContactResult" value={formData.firstContactResult} onChange={handleChange} className={selectClass}>
                    {FIRST_CONTACT_RESULTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </InputGroup>

                <InputGroup label="Próximo Contato">
                  <Input type="date" name="nextContactDate" value={formData.nextContactDate} onChange={handleChange} />
                  <p className="text-xs text-muted-foreground mt-1">Opcional. Use para agendamentos.</p>
                </InputGroup>

                <InputGroup label="Resultado Final">
                  <select name="finalResult" value={formData.finalResult} onChange={handleChange} className={selectClass}>
                    {FINAL_RESULTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </InputGroup>

                <div className="md:col-span-2">
                  <InputGroup label="Comentários e Observações">
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      rows={2}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Detalhes importantes sobre a negociação..."
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

          </div>

          <CardFooter className="justify-end space-x-3 pt-6 border-t border-border bg-card">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Salvar Alterações' : 'Cadastrar Lead'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};