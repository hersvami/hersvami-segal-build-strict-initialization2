/* ─── Segal Build — Domain Types ─── */

export type Company = {
  id: string;
  name: string;
  abn: string;
  licence: string;
  phone: string;
  email: string;
  websiteUrl?: string;
  logoUrl: string;
  defaultOverheadPercent: number;
  defaultProfitPercent: number;
};

export type ProjectCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type Project = {
  id: string;
  name: string;
  address: string;
  customer: ProjectCustomer;
  companyId: string;
  createdAt: string;
  geminiApiKey?: string;
  heroPhoto?: string;
};

export type PCItem = {
  id: string;
  description: string;
  allowance: number;
  unit: string;
  actualCost?: number;
  suppliedBy?: string;
};

export type InclusionItem = {
  id: string;
  text: string;
  isDefault: boolean;
};

export type ExclusionItem = {
  id: string;
  text: string;
  isDefault: boolean;
};

export type JobStage = {
  name: string;
  trade: string;
  cost: number;
  duration: number;
  description: string;
  status: 'not-started' | 'in-progress' | 'complete';
  rateOverrideNote?: string;
};

export type Solution = {
  name: string;
  totalCost: number;
  duration: number;
  stages: JobStage[];
  description: string;
};

export type ParametricItem = {
  id: string;
  unitId: string; // reference into the parametric library
  label: string; // e.g. "Double GPO"
  unit: 'each' | 'lm' | 'm2' | 'allow';
  rate: number; // unit rate inc. labour & materials
  quantity: number;
  notes?: string;
  phase?: 'preparation' | 'structure' | 'services' | 'finishes' | 'external';
};

export type QuestionAnswer = {
  questionId: string;
  answer: string;
};

export type QuoteScope = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  description: string; // auto-generated from answers (customer-visible)
  builderNotes?: string; // manual notes from scope input (internal)
  selectedType?: string;
  stages: JobStage[];
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  answers: Record<string, string>;
  questionAnswers?: QuestionAnswer[];
  pcItems: PCItem[];
  inclusions: InclusionItem[];
  exclusions: ExclusionItem[];
  parametricItems?: ParametricItem[];
  photos?: string[];
};

export type ProjectBaseline = {
  totalAreaM2: number; // total project floor area
  storeys: 'single' | 'double' | 'multi';
  siteAccess: 'easy' | 'moderate' | 'difficult';
  ceilingHeightM: number;
  notes?: string;
};

export type QuotePricing = {
  overheadPercent: number;
  profitPercent: number;
  contingencyPercent: number;
  gstPercent: number;
  tradeCost: number;
  overhead: number;
  profit: number;
  contingency: number;
  gst: number;
  clientTotal: number;
  totalIncGst: number;
  total: number;
  overheadAmount: number;
  profitAmount: number;
  contingencyAmount: number;
  subtotalExclGst: number;
  gstAmount: number;
};

export type Signature = {
  name: string;
  date: string;
  dataUrl: string;
};

export type ChangeLogEntry = {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
};

export type EstimatorReviewFlag = {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  scopeId?: string;
  categoryLabel?: string;
};

export type ProgressPhoto = {
  id: string;
  url: string;
  caption: string;
  stage: string;
  date: string;
};

export type ProgressUpdate = {
  text: string;
  timestamp: string;
};

export type ProgressStage = {
  name: string;
  status: 'not-started' | 'in-progress' | 'complete';
};

export type ExternalQuoteReference = {
  referenceNumber: string;
  provider?: string;
  originalQuoteDate?: string;
  originalApprovedAmount: number;
  summaryScope: string;
  notes?: string;
};

export type Variation = {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  documentType: 'quote' | 'variation';
  scopes: QuoteScope[];
  pricing: QuotePricing;
  signature?: Signature;
  changeLog: ChangeLogEntry[];
  referenceQuoteId?: string;
  reasonForChange?: string;
  variationNumber?: string;
  costImpact?: 'additional' | 'credit' | 'no-change';
  source?: 'internal' | 'external';
  externalQuoteRef?: ExternalQuoteReference;
  createdAt: string;
  updatedAt: string;
  internalNotes: string[];
  progressPhotos?: ProgressPhoto[];
  progressStages?: ProgressStage[];
  baseline?: ProjectBaseline;
  progressUpdates?: ProgressUpdate[];
  reviewFlags?: EstimatorReviewFlag[];
};
