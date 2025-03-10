import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '@/utils/formatCurrency';

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryExpense = {
  name: string;
  value: number;
  color: string;
  percentage: number;
};

type ExpenseChartProps = {
  expenses: CategoryExpense[];
  month: string;
};

export default function ExpenseChart({ expenses, month }: ExpenseChartProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
  
  // Chart data
  const chartData = {
    labels: expenses.map(expense => expense.name),
    datasets: [
      {
        data: expenses.map(expense => expense.value),
        backgroundColor: expenses.map(expense => expense.color),
        borderColor: expenses.map(expense => expense.color),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += formatCurrency(context.parsed);
            }
            return label;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };
  
  return (
    <div className="bg-white shadow rounded-lg lg:col-span-2">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Gastos por Categoria</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{month}</span>
            <button className="text-gray-400 hover:text-gray-500">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
        <div className="w-full h-64 flex items-center justify-center relative">
          {expenses.length > 0 ? (
            <>
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold tabular-nums">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <i className="fas fa-chart-pie text-4xl mb-2"></i>
              <p>Sem despesas no período</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center">
              <span 
                className="h-3 w-3 rounded-full mr-2" 
                style={{ backgroundColor: expense.color }}
              ></span>
              <span className="text-sm text-gray-700">{expense.name}</span>
              <span className="ml-auto text-sm font-medium tabular-nums">{expense.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
