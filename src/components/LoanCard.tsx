import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loan } from "@/types/loan";
import { Calendar, DollarSign, TrendingDown, Edit, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface LoanCardProps {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
  onPayment: (loan: Loan) => void;
}

export const LoanCard = ({ loan, onEdit, onDelete, onPayment }: LoanCardProps) => {
  const progressPercentage = ((loan.amount - loan.remainingBalance) / loan.amount) * 100;
  const isOverdue = new Date(loan.dueDate) < new Date() && loan.status !== 'paid';
  
  const getStatusColor = () => {
    if (loan.status === 'paid') return 'success';
    if (isOverdue || loan.status === 'overdue') return 'destructive';
    return 'default';
  };

  const getStatusLabel = () => {
    if (loan.status === 'paid') return 'Paid';
    if (isOverdue || loan.status === 'overdue') return 'Overdue';
    return 'Active';
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{loan.source}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              Due: {format(new Date(loan.dueDate), 'MMM dd, yyyy')}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor()}>{getStatusLabel()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Loan Amount</p>
            <p className="text-2xl font-bold text-foreground">₱{loan.amount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-primary">₱{loan.remainingBalance.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment Progress</span>
            <span className="font-medium text-foreground">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Monthly Installments</span>
            <span className="text-sm text-muted-foreground">₱{loan.monthlyInstallment.toLocaleString()} / month</span>
          </div>
          <div className="space-y-1.5">
            {loan.installments.map((installment) => {
              const isPaid = installment.status === 'paid';
              const isOverdue = installment.status === 'overdue';
              
              return (
                <div 
                  key={installment.id} 
                  className="flex items-center justify-between p-2 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center gap-2">
                    {isPaid ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : isOverdue ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">Month {installment.month}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(installment.dueDate), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm font-semibold">₱{installment.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingDown className="h-4 w-4" />
          <span>Interest Rate: {loan.interestRate}%</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onPayment(loan)} 
            className="flex-1"
            disabled={loan.status === 'paid'}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
          <Button 
            onClick={() => onEdit(loan)} 
            variant="outline" 
            size="icon"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => onDelete(loan.id)} 
            variant="outline" 
            size="icon"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
