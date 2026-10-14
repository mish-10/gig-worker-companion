export type Language = 'en' | 'hi';

export type Platform =
  | 'Swiggy'
  | 'Zomato'
  | 'Zepto'
  | 'Blinkit'
  | 'Uber'
  | 'Ola'
  | 'Rapido'
  | 'Porter'
  | 'Urban Company'
  | 'Amazon Flex'
  | 'Other';

export interface EarningsEntry {
  id: string;
  date: string; // YYYY-MM-DD
  platform: Platform;
  grossEarnings: number; // ₹ Base fare + surge + trip earnings
  incentives: number; // ₹ Target bonus / peak pay
  tips: number; // ₹ Customer tips
  fuelExpense: number; // ₹ Petrol / diesel / EV charging
  maintenanceExpense: number; // ₹ Puncture / oil change / service
  foodAndDataExpense: number; // ₹ Mobile data + snacks during shift
  deductions: number; // ₹ Platform TDS / penal charges / uniform
  netEarnings: number; // Calculated take-home
  hoursWorked: number;
  tripsCount: number;
  notes?: string;
  isDemo?: boolean;
}

export interface GovernmentScheme {
  id: string;
  titleEn: string;
  titleHi: string;
  tagEn: string;
  tagHi: string;
  category: 'social_security' | 'insurance' | 'health' | 'credit' | 'state_board';
  coverageEn: string;
  coverageHi: string;
  officialPortal: string;
  portalName: string;
  descriptionEn: string;
  descriptionHi: string;
  eligibilityEn: string[];
  eligibilityHi: string[];
  benefitsEn: string[];
  benefitsHi: string[];
  procedureEn: string[];
  procedureHi: string[];
  documentsRequiredEn: string[];
  documentsRequiredHi: string[];
}

export interface SafetyGuide {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'road_safety' | 'monsoon_heat' | 'accident_protocol' | 'police_challan' | 'customer_dispute';
  iconName: string;
  summaryEn: string;
  summaryHi: string;
  pointsEn: string[];
  pointsHi: string[];
}

export interface WorkerDocument {
  id: string;
  nameEn: string;
  nameHi: string;
  authorityEn: string;
  authorityHi: string;
  purposeEn: string;
  purposeHi: string;
  whyNeededEn: string;
  whyNeededHi: string;
  stepsEn: string[];
  stepsHi: string[];
  commonMistakesEn: string[];
  commonMistakesHi: string[];
  officialUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface ComplaintRequest {
  platform: Platform | string;
  workerName: string;
  workerId: string;
  city: string;
  phoneNumber: string;
  disputeType: string;
  disputeDate: string;
  amountInDispute: string;
  incidentDetails: string;
  language: Language;
}
