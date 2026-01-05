export interface Loan {
  id: string;
  productName: string;
  source: string;
  amount: number;
  remainingBalance: number;
  dueDate: string;
  paymentTerm: 1 | 3 | 6 | 12;
  monthlyInstallment: number;
  installments: Installment[];
  status: 'active' | 'paid' | 'overdue';
  createdAt: string;
  payments: Payment[];
}

export interface Installment {
  id: string;
  month: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
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
