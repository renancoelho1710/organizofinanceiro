import { formatCurrency } from "@/utils/formatCurrency";
import type { AccountBalance } from "@shared/schema";

type FinancialSummaryProps = {
  balance: AccountBalance;
};

type SummaryCardProps = {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  bgColor: string;
  valueColor?: string;
};

function SummaryCard({ title, value, icon, color, bgColor, valueColor = "text-gray-900" }: SummaryCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <i className={`${icon} ${color}`}></i>
          </div>
          <div className="ml-5">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className={`mt-1 text-2xl font-semibold ${valueColor} tabular-nums`}>{formatCurrency(value)}</dd>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancialSummary({ balance }: FinancialSummaryProps) {
  if (!balance) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="bg-gray-200 w-12 h-12 rounded-md"></div>
                <div className="ml-5 space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 mb-6">
      <SummaryCard
        title="Saldo Total"
        value={balance.totalBalance}
        icon="fas fa-wallet"
        color="text-primary"
        bgColor="bg-primary/10"
      />
      <SummaryCard
        title="Receitas (Set)"
        value={balance.monthlyIncome}
        icon="fas fa-arrow-down"
        color="text-secondary"
        bgColor="bg-green-100"
        valueColor="text-secondary"
      />
      <SummaryCard
        title="Despesas (Set)"
        value={balance.monthlyExpenses}
        icon="fas fa-arrow-up"
        color="text-danger"
        bgColor="bg-red-100"
        valueColor="text-danger"
      />
      <SummaryCard
        title="Faturas Cartões"
        value={balance.creditCardBills}
        icon="fas fa-credit-card"
        color="text-primary"
        bgColor="bg-blue-100"
      />
    </div>
  );
}
