import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loan, Installment } from "@/types/loan";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface PaymentDialogProps {
  loan: Loan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayInstallment: (loanId: string, installmentId: string) => void;
}

export const PaymentDialog = ({ loan, open, onOpenChange, onPayInstallment }: PaymentDialogProps) => {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);

  const handleInstallmentClick = (installment: Installment) => {
    if (!loan || installment.status === 'paid') return;
    setSelectedInstallment(installment);
    setConfirmOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!loan || !selectedInstallment) return;
    
    onPayInstallment(loan.id, selectedInstallment.id);
    
    toast({
      title: "Payment Recorded",
      description: `Month ${selectedInstallment.month} payment of ₱${selectedInstallment.amount.toLocaleString()} has been marked as paid`,
    });
    
    setConfirmOpen(false);
    setSelectedInstallment(null);
  };

  if (!loan || !loan.installments || loan.installments.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              This loan doesn't have installment tracking. Please edit the loan to add payment terms.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pay Installment - {loan.source}</DialogTitle>
            <DialogDescription>
              Click on a month to mark it as paid. Monthly payment: ₱{loan.monthlyInstallment?.toLocaleString() || '0'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {loan.installments.map((installment) => {
              const isPaid = installment.status === 'paid';
              const isOverdue = installment.status === 'overdue';
              
              return (
                <Button
                  key={installment.id}
                  onClick={() => handleInstallmentClick(installment)}
                  disabled={isPaid}
                  variant={isPaid ? "secondary" : "outline"}
                  className="w-full h-auto p-4 justify-between hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    {isPaid ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : isOverdue ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="text-left">
                      <div className="font-semibold">Month {installment.month}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {format(new Date(installment.dueDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    ₱{installment.amount.toLocaleString()}
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to proceed with the payment for Month {selectedInstallment?.month}? 
              This will mark ₱{selectedInstallment?.amount.toLocaleString()} as paid.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPayment}>
              Yes, Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
