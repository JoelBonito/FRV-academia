export type UserRole = 'consultant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum LeadStatus {
  NEW = 'Novo',
  NEGOTIATION = 'Em Negociação',
  WON = 'Venda',
  LOST = 'Perdido',
}

// Mapped exactly from the "OPORTUNIDADE" column in the CSV/PDF
export enum OpportunitySource {
  // Visitas
  VISITA_MORA_PROXIMO = 'VISITA MORA PRÓXIMO',
  VISITA_TRABALHA_PROXIMO = 'VISITA TRABALHA PRÓXIMO',
  VISITA_PASSAGEM = 'VISITA PASSAGEM',
  VISITA_INDICACAO = 'VISITA INDICAÇÃO',
  VISITA_REMATRICULA = 'VISITA REMATRÍCULA',
  
  // Receptivo
  RECEPTIVO_FONE = 'RECEPTIVO FONE',
  RECEPTIVO_WHATSAPP = 'RECEPTIVO WHATSAPP',
  RECEPTIVO_REDES_SOCIAIS = 'RECEPTIVO REDES SOCIAIS',
  RECEPTIVO_EMAIL = 'RECEPTIVO EMAIL',
  RECEPTIVO_GOOGLE_SITE = 'RECEPTIVO GOOGLE ou SITE',

  // Ligações (Ativas)
  LIGACAO_AUSENTE = 'LIGAÇÃO AUSENTE',
  LIGACAO_INATIVO = 'LIGAÇÃO INATIVO',
  LIGACAO_OPORTUNIDADE = 'LIGAÇÃO OPORTUNIDADE',
  LIGACAO_POS_VISITA = 'LIGAÇÃO PÓS-VISITA',
  LIGACAO_RENOVACAO = 'LIGAÇÃO RENOVAÇÃO',

  // Mensagens (Ativas)
  MENSAGEM_AUSENTE = 'MENSAGEM AUSENTE',
  MENSAGEM_INATIVO = 'MENSAGEM INATIVO',
  MENSAGEM_OPORTUNIDADE = 'MENSAGEM OPORTUNIDADE',
  MENSAGEM_POS_VISITA = 'MENSAGEM PÓS-VISITA',
  MENSAGEM_RENOVACAO = 'MENSAGEM RENOVAÇÃO',

  // Outros
  INDICACAO = 'INDICAÇÃO'
}

export enum ModalityInterest {
  MUSCULACAO = 'Musculação',
  AULAS_COLETIVAS = 'Aulas Coletivas',
  // Extras maintained for system flexibility, though CSV only lists top 2
  CROSS_TRAINING = 'Cross Training',
  LUTAS = 'Lutas',
  NATACAO = 'Natação',
}

export enum TimeInterest {
  MANHA = 'Manhã',
  TARDE = 'Tarde',
  NOITE = 'Noite',
}

// Mapped exactly from "RESULTADO PRIMEIRO CONTATO" in CSV
export enum FirstContactResult {
  AGENDAMENTO = 'AGENDAMENTO',
  CADASTRO = 'CADASTRO',
  NAO_ATENDE = 'NÃO ATENDE',
  NOVO_CONTATO = 'NOVO CONTATO',
  SEM_INTERESSE = 'SEM INTERESSE',
  VENDEU = 'VENDEU',
  OUTROS = 'OUTROS'
}

// Mapped exactly from "RESULTADO FINAL" in CSV
export enum FinalResult {
  PENDENTE = 'Pendente', // Internal system state for open leads
  ADESAO = 'ADESÃO', // não inscreveu pois não concorda
  CARTAO = 'CARTÃO', // não possui cartão ou limite
  MODALIDADE = 'MODALIDADE', // não oferecemos a modalidade
  NAO_COMPARECEU = 'NÃO COMPARECEU', // não compareceu aula experimental
  OUTRA_ACADEMIA = 'OUTRA ACADEMIA', // está treinando em outra academia
  PESQUISA = 'PESQUISA', // visitará outras academias
  VALOR = 'VALOR', // achou "caro"
  VENDEU = 'VENDEU', // efetuou a inscrição
  OUTROS = 'OUTROS' // informar coluna COMENTÁRIOS
}

export interface Lead {
  id: string;
  consultantId: string;
  consultantName: string;
  date: string; // ISO Date YYYY-MM-DD
  name: string;
  phone: string;
  email?: string;
  
  source: OpportunitySource;
  modality: ModalityInterest;
  time: TimeInterest;
  
  firstContactResult: FirstContactResult;
  finalResult: FinalResult;
  
  nextContactDate?: string; // ISO Date
  comments?: string;
  
  status: LeadStatus; // Derived helper
}

export interface DashboardStats {
  totalLeads: number;
  totalSales: number;
  conversionRate: number;
  activeLeads: number;
  rawData: Lead[];
}