import React, { useState, useEffect } from 'react';
import { Lead, OpportunitySource, ModalityInterest, TimeInterest, FirstContactResult, FinalResult } from '../types';
import { OPPORTUNITY_SOURCES, MODALITIES, TIME_INTERESTS, FIRST_CONTACT_RESULTS, FINAL_RESULTS } from '../constants';
import { X, Save, Calendar } from 'lucide-react';

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
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
      {children}
    </div>
  );

  const inputClass = "w-full rounded-xl border-slate-200 border bg-slate-50 p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {initialData ? 'Editar Lead' : 'Novo Cadastro'}
            </h3>
            <p className="text-sm text-slate-500">Preencha os detalhes da oportunidade.</p>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-5">
              <h4 className="text-sm font-semibold text-violet-600 border-b border-violet-100 pb-2 mb-4">Dados Pessoais</h4>
              
              <InputGroup label="Data do Contato">
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
              </InputGroup>
              
              <InputGroup label="Nome do Cliente">
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Ex: Ana Silva" />
              </InputGroup>
              
              <InputGroup label="Telefone / WhatsApp">
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="(11) 99999-9999" />
              </InputGroup>
              
              <InputGroup label="Email (Opcional)">
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="cliente@email.com" />
              </InputGroup>
            </div>

            {/* Interest Info */}
            <div className="space-y-5">
              <h4 className="text-sm font-semibold text-violet-600 border-b border-violet-100 pb-2 mb-4">Interesse</h4>
              
              <InputGroup label="Origem da Oportunidade">
                <select name="source" value={formData.source} onChange={handleChange} className={inputClass}>
                  {OPPORTUNITY_SOURCES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </InputGroup>
              
              <InputGroup label="Modalidade">
                <select name="modality" value={formData.modality} onChange={handleChange} className={inputClass}>
                  {MODALITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </InputGroup>
              
              <InputGroup label="Horário de Preferência">
                <select name="time" value={formData.time} onChange={handleChange} className={inputClass}>
                  {TIME_INTERESTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </InputGroup>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-violet-600" />
              Resultado e Follow-up
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Resultado 1º Contato">
                <select name="firstContactResult" value={formData.firstContactResult} onChange={handleChange} className={inputClass}>
                  {FIRST_CONTACT_RESULTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Próximo Contato">
                <input type="date" name="nextContactDate" value={formData.nextContactDate} onChange={handleChange} className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">Opcional. Use para agendamentos.</p>
              </InputGroup>

              <InputGroup label="Resultado Final">
                <select name="finalResult" value={formData.finalResult} onChange={handleChange} className={inputClass}>
                  {FINAL_RESULTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </InputGroup>

              <div className="md:col-span-2">
                <InputGroup label="Comentários e Observações">
                  <textarea name="comments" value={formData.comments} onChange={handleChange} rows={2} className={inputClass} placeholder="Detalhes importantes sobre a negociação..."></textarea>
                </InputGroup>
              </div>
            </div>
          </div>

        </form>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 z-10">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
              Cancelar
            </button>
            <button onClick={handleSubmit} type="button" className="px-5 py-2.5 text-sm font-bold text-white bg-violet-600 border border-transparent rounded-xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all flex items-center">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Salvar Alterações' : 'Cadastrar Lead'}
            </button>
        </div>
      </div>
    </div>
  );
};