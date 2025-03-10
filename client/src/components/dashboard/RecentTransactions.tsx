import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeDate } from "@/utils/dateHelpers";
import type { Transaction } from "@shared/schema";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

type TransactionItemProps = {
  transaction: Transaction;
};

function getCategoryIcon(category: string, type: string) {
  if (type === 'income') {
    return 'fas fa-building';
  }
  
  switch (category.toLowerCase()) {
    case 'alimentação':
      return category.toLowerCase().includes('ifood') ? 'fas fa-hamburger' : 'fas fa-shopping-bag';
    case 'moradia':
      return 'fas fa-home';
    case 'transporte':
      return 'fas fa-gas-pump';
    case 'saúde':
      return 'fas fa-heartbeat';
    case 'lazer':
      return 'fas fa-film';
    case 'educação':
      return 'fas fa-graduation-cap';
    case 'vestuário':
      return 'fas fa-tshirt';
    default:
      return 'fas fa-tags';
  }
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.type === 'expense';
  const iconClass = getCategoryIcon(transaction.category, transaction.type);
  const bgColor = isExpense ? 'bg-red-100' : 'bg-green-100';
  const textColor = isExpense ? 'text-danger' : 'text-secondary';
  const amountPrefix = isExpense ? '- ' : '+ ';
  
  return (
    <div className="py-3 flex justify-between items-center">
      <div className="flex items-center">
        <div className={`${bgColor} rounded-full p-2 mr-3`}>
          <i className={`${iconClass} ${textColor}`}></i>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500">
            {transaction.category} • {formatRelativeDate(transaction.date)}
          </p>
        </div>
      </div>
      <p className={`text-sm font-medium ${textColor} tabular-nums`}>
        {amountPrefix}{formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg lg:col-span-2">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Transações Recentes</h2>
            <a href="#" className="text-sm font-medium text-primary hover:text-blue-700">Ver todas</a>
          </div>
          <div className="text-center py-10 text-gray-500">
            <i className="fas fa-receipt text-3xl mb-3"></i>
            <p>Nenhuma transação registrada</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg lg:col-span-2">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Transações Recentes</h2>
          <a href="/transactions" className="text-sm font-medium text-primary hover:text-blue-700">Ver todas</a>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}
