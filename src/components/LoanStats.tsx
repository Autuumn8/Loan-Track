import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Loan } from "@/types/loan";

interface LoanStatsProps {
  loans: Loan[];
}

export const LoanStats = ({ loans }: LoanStatsProps) => {
  const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = totalBorrowed - totalDebt;
  const activeLoans = loans.filter(loan => loan.status === 'active').length;

  const stats = [
    {
      title: "Total Debt",
      value: `₱${totalDebt.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-destructive/10 to-destructive/5",
      iconColor: "text-destructive",
    },
    {
      title: "Total Paid",
      value: `₱${totalPaid.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-success/10 to-success/5",
      iconColor: "text-success",
    },
    {
      title: "Total Borrowed",
      value: `₱${totalBorrowed.toLocaleString()}`,
      icon: Wallet,
      gradient: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
    },
    {
      title: "Active Loans",
      value: activeLoans.toString(),
      icon: TrendingDown,
      gradient: "from-warning/10 to-warning/5",
      iconColor: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className={`bg-gradient-to-br ${stat.gradient} rounded-lg p-3 w-fit mb-3`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
