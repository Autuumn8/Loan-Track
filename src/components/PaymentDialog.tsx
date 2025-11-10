import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loan, Payment } from "@/types/loan";
import { useToast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  loan: Loan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (loanId: string, payment: Omit<Payment, 'id'>) => void;
}

export const PaymentDialog = ({ loan, open, onOpenChange, onAddPayment }: PaymentDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loan || !formData.amount) {
      toast({
        title: "Error",
        description: "Please enter payment amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    
    if (amount <= 0 || amount > loan.remainingBalance) {
      toast({
        title: "Error",
        description: "Invalid payment amount",
        variant: "destructive",
      });
      return;
    }

    onAddPayment(loan.id, {
      amount,
      date: formData.date,
      note: formData.note,
    });

    setFormData({ amount: '', date: new Date().toISOString().split('T')[0], note: '' });
    onOpenChange(false);
    
    toast({
      title: "Payment Added",
      description: `Successfully added payment of ₱${amount.toLocaleString()}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            {loan && `Add a payment for ${loan.source}. Remaining balance: ₱${loan.remainingBalance.toLocaleString()}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Payment Amount (₱)</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0"
              max={loan?.remainingBalance}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-date">Payment Date</Label>
            <Input
              id="payment-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-note">Note (Optional)</Label>
            <Textarea
              id="payment-note"
              placeholder="Add any notes about this payment..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
