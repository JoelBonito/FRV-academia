import { FinalResult, FirstContactResult, ModalityInterest, OpportunitySource, TimeInterest } from "./types";

export const OPPORTUNITY_SOURCES = Object.values(OpportunitySource);
export const MODALITIES = Object.values(ModalityInterest);
export const TIME_INTERESTS = Object.values(TimeInterest);
export const FIRST_CONTACT_RESULTS = Object.values(FirstContactResult);
export const FINAL_RESULTS = Object.values(FinalResult);

export const MOCK_USER = {
  id: 'u1',
  name: 'Carlos Silva',
  email: 'carlos@gymflow.com',
  role: 'consultant' as const
};

export const MOCK_ADMIN = {
  id: 'a1',
  name: 'Fernanda Gerente',
  email: 'fernanda@gymflow.com',
  role: 'admin' as const
};

// Helper to categorize sources into the "AÇÃO" buckets from the PDF
// Updated to check against the Uppercase values in types.ts
export const getActionCategory = (source: OpportunitySource): string => {
  const s = source.toString();
  if (s.startsWith('VISITA')) return 'VISITA';
  if (s.startsWith('RECEPTIVO')) return 'RECEPTIVO';
  if (s.startsWith('LIGAÇÃO') || s.startsWith('LIGACAO')) return 'LIGAÇÃO';
  if (s.startsWith('MENSAGEM')) return 'MENSAGEM';
  if (s.startsWith('INDICAÇÃO') || s.startsWith('INDICACAO')) return 'INDICAÇÃO';
  return 'OUTROS';
};