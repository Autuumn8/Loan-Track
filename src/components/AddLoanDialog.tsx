import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loan, LoanSource } from "@/types/loan";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddLoanDialogProps {
  onAdd: (loan: Omit<Loan, 'id' | 'createdAt' | 'payments'>) => void;
  editLoan?: Loan | null;
  onUpdate?: (loan: Loan) => void;
}

const loanSources: LoanSource[] = [
  'Shopee PayLater',
  'GCash GLoan',
  'GrabPay PayLater',
  'BillEase',
  'Cashalo',
  'Home Credit',
  'Other',
];

export const AddLoanDialog = ({ onAdd, editLoan, onUpdate }: AddLoanDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    source: editLoan?.source || '',
    amount: editLoan?.amount?.toString() || '',
    interestRate: editLoan?.interestRate?.toString() || '',
    dueDate: editLoan?.dueDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source || !formData.amount || !formData.interestRate || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const interestRate = parseFloat(formData.interestRate);

    if (editLoan && onUpdate) {
      onUpdate({
        ...editLoan,
        source: formData.source,
        amount,
        interestRate,
        dueDate: formData.dueDate,
      });
    } else {
      onAdd({
        source: formData.source,
        amount,
        interestRate,
        remainingBalance: amount,
        dueDate: formData.dueDate,
        status: 'active',
      });
    }

    setFormData({ source: '', amount: '', interestRate: '', dueDate: '' });
    setOpen(false);
    
    toast({
      title: editLoan ? "Loan Updated" : "Loan Added",
      description: editLoan ? "Your loan has been updated successfully" : "Your loan has been added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          {editLoan ? 'Edit Loan' : 'Add New Loan'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editLoan ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
          <DialogDescription>
            {editLoan ? 'Update your loan details below' : 'Enter your loan details below'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Loan Source</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select loan source" />
              </SelectTrigger>
              <SelectContent>
                {loanSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount (₱)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="5000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              placeholder="5"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            {editLoan ? 'Update Loan' : 'Add Loan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
