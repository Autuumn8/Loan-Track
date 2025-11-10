import { useState, useEffect } from "react";
import { Loan, Payment } from "@/types/loan";
import { LoanCard } from "@/components/LoanCard";
import { LoanStats } from "@/components/LoanStats";
import { AddLoanDialog } from "@/components/AddLoanDialog";
import { PaymentDialog } from "@/components/PaymentDialog";
import { Wallet } from "lucide-react";

const Index = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Load loans from localStorage on mount
  useEffect(() => {
    const savedLoans = localStorage.getItem('loans');
    if (savedLoans) {
      setLoans(JSON.parse(savedLoans));
    }
  }, []);

  // Save loans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  const addLoan = (loanData: Omit<Loan, 'id' | 'createdAt' | 'payments'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      payments: [],
    };
    setLoans([...loans, newLoan]);
  };

  const updateLoan = (updatedLoan: Loan) => {
    setLoans(loans.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan));
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const addPayment = (loanId: string, payment: Omit<Payment, 'id'>) => {
    setLoans(loans.map(loan => {
      if (loan.id === loanId) {
        const newPayment: Payment = {
          ...payment,
          id: Date.now().toString(),
        };
        const remainingBalance = loan.remainingBalance - payment.amount;
        return {
          ...loan,
          remainingBalance: Math.max(0, remainingBalance),
          status: remainingBalance <= 0 ? 'paid' : loan.status,
          payments: [...loan.payments, newPayment],
        };
      }
      return loan;
    }));
  };

  const handlePaymentClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setPaymentDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Loan Tracker</h1>
                <p className="text-sm text-muted-foreground">Manage your loans efficiently</p>
              </div>
            </div>
            <AddLoanDialog onAdd={addLoan} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <LoanStats loans={loans} />

        {/* Loans Grid */}
        {loans.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-primary p-4 rounded-full w-fit mx-auto mb-4">
              <Wallet className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No loans yet</h2>
            <p className="text-muted-foreground mb-6">Start tracking your loans by adding your first one</p>
            <AddLoanDialog onAdd={addLoan} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Loans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onEdit={(loan) => {/* Will implement edit later */}}
                  onDelete={deleteLoan}
                  onPayment={handlePaymentClick}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Dialog */}
      <PaymentDialog
        loan={selectedLoan}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onAddPayment={addPayment}
      />
    </div>
  );
};

export default Index;
