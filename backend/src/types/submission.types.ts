export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  accident: string;
  treatmentLevel: string;
  weeksOfTreatment: number;
  medicalBills: number;
  lostWages: number;
  sharedFault: number;
  medicalBillsFile: string;
  otherDocuments?: string | null;
}

export interface AIResponse {
  estimateLow: number;
  estimateHigh: number;
  rationale: string;
  similarCases: SimilarCase[];
}

export interface SimilarCase {
  title: string;
  outcome: number;
  summary: string;
}
