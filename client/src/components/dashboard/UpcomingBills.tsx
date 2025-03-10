import { formatCurrency } from "@/utils/formatCurrency";
import { formatDaysRemaining } from "@/utils/dateHelpers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Bill } from "@shared/schema";

type UpcomingBillsProps = {
  bills: Bill[];
};

type BillItemProps = {
  bill: Bill;
};

function BillItem({ bill }: BillItemProps) {
  const dueDate = new Date(bill.dueDate);
  const daysRemaining = formatDaysRemaining(dueDate);
  
  // Choose icon based on category
  let icon = "fas fa-file-invoice-dollar";
  let iconColor = "text-primary";
  
  if (bill.category === "Cartão de Crédito") {
    icon = "fas fa-credit-card";
    iconColor = "text-warning";
  } else if (bill.description.toLowerCase().includes("energia") || bill.description.toLowerCase().includes("luz")) {
    icon = "fas fa-bolt";
    iconColor = "text-primary";
  } else if (bill.description.toLowerCase().includes("internet") || bill.description.toLowerCase().includes("wifi")) {
    icon = "fas fa-wifi";
    iconColor = "text-primary";
  }
  
  return (
    <div className="flex items-center p-3 border rounded-lg bg-gray-50">
      <div className={`mr-3 ${iconColor}`}>
        <i className={icon}></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{bill.description}</p>
        <p className="text-xs text-gray-500">{daysRemaining}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums text-danger">{formatCurrency(bill.amount)}</p>
        <p className="text-xs text-gray-500">{format(dueDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
      </div>
    </div>
  );
}

export default function UpcomingBills({ bills }: UpcomingBillsProps) {
  if (!bills || bills.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Próximas Contas</h2>
            <a href="#" className="text-sm font-medium text-primary hover:text-blue-700">Ver todas</a>
          </div>
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-calendar-check text-3xl mb-2"></i>
            <p>Nenhuma conta próxima</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Próximas Contas</h2>
          <a href="#" className="text-sm font-medium text-primary hover:text-blue-700">Ver todas</a>
        </div>
        <div className="space-y-3">
          {bills.map((bill) => (
            <BillItem key={bill.id} bill={bill} />
          ))}
        </div>
      </div>
    </div>
  );
}
