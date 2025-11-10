export interface Loan {
  id: string;
  source: string;
  amount: number;
  interestRate: number;
  remainingBalance: number;
  dueDate: string;
  status: 'active' | 'paid' | 'overdue';
  createdAt: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export type LoanSource = 
  | 'Shopee PayLater'
  | 'GCash GLoan'
  | 'GrabPay PayLater'
  | 'BillEase'
  | 'Cashalo'
  | 'Home Credit'
  | 'Other';
