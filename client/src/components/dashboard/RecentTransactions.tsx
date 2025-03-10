import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeDate } from "@/utils/dateHelpers";
import type { Transaction } from "@shared/schema";
import { useState } from "react";
import { FiFileText, FiX } from "react-icons/fi";

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
  const [isViewingReceipt, setIsViewingReceipt] = useState(false);
  const isExpense = transaction.type === 'expense';
  const iconClass = getCategoryIcon(transaction.category, transaction.type);
  const bgColor = isExpense ? 'bg-red-100' : 'bg-green-100';
  const textColor = isExpense ? 'text-danger' : 'text-secondary';
  const amountPrefix = isExpense ? '- ' : '+ ';
  const hasReceipt = !!transaction.receiptImage;
  
  return (
    <>
      <div className="py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`${bgColor} rounded-full p-2 mr-3`}>
            <i className={`${iconClass} ${textColor}`}></i>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
              {hasReceipt && (
                <button 
                  onClick={() => setIsViewingReceipt(true)}
                  className="text-primary hover:text-primary-dark"
                  title="Ver comprovante"
                >
                  <FiFileText size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {transaction.category} • {formatRelativeDate(transaction.date)}
            </p>
          </div>
        </div>
        <p className={`text-sm font-medium ${textColor} tabular-nums`}>
          {amountPrefix}{formatCurrency(transaction.amount)}
        </p>
      </div>
      
      {/* Modal de visualização do comprovante */}
      {isViewingReceipt && transaction.receiptImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Comprovante: {transaction.description}</h3>
              <button 
                onClick={() => setIsViewingReceipt(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="overflow-auto flex-1">
              <img 
                src={transaction.receiptImage} 
                alt={`Comprovante de ${transaction.description}`} 
                className="max-w-full h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
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
