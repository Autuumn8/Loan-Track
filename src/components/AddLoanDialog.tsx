import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loan, LoanSource, Installment } from "@/types/loan";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addMonths, format } from "date-fns";

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
    productName: '',
    source: '',
    amount: '',
    dueDate: '',
    paymentTerm: '',
  });

  // Open dialog and populate form when editLoan changes
  useEffect(() => {
    if (editLoan) {
      setFormData({
        productName: editLoan.productName || '',
        source: editLoan.source,
        amount: editLoan.amount.toString(),
        dueDate: editLoan.dueDate,
        paymentTerm: editLoan.paymentTerm?.toString() || '',
      });
      setOpen(true);
    }
  }, [editLoan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.source || !formData.amount || !formData.dueDate || !formData.paymentTerm) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const paymentTerm = parseInt(formData.paymentTerm) as 1 | 3 | 6 | 12;
    
    // Calculate monthly installment
    const monthlyInstallment = amount / paymentTerm;
    
    // Generate installments
    const startDate = new Date(formData.dueDate);
    const installments: Installment[] = Array.from({ length: paymentTerm }, (_, index) => ({
      id: `installment-${Date.now()}-${index}`,
      month: index + 1,
      amount: monthlyInstallment,
      dueDate: format(addMonths(startDate, index), 'yyyy-MM-dd'),
      status: 'pending' as const,
    }));

    if (editLoan && onUpdate) {
      onUpdate({
        ...editLoan,
        productName: formData.productName,
        source: formData.source,
        amount,
        dueDate: formData.dueDate,
        paymentTerm,
        monthlyInstallment,
        installments,
      });
    } else {
      onAdd({
        productName: formData.productName,
        source: formData.source,
        amount,
        remainingBalance: amount,
        dueDate: formData.dueDate,
        paymentTerm,
        monthlyInstallment,
        installments,
        status: 'active',
      });
    }

    setFormData({ productName: '', source: '', amount: '', dueDate: '', paymentTerm: '' });
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
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              type="text"
              placeholder="iPhone 15, Laptop, etc."
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

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
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerm">Payment Term</Label>
            <Select value={formData.paymentTerm} onValueChange={(value) => setFormData({ ...formData, paymentTerm: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {editLoan ? 'Update Loan' : 'Add Loan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
