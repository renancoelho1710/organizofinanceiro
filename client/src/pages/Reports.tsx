import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatMonthYear } from "@/utils/dateHelpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import type { Transaction, Category } from "@shared/schema";
import { exportTransactionsToPDF, exportTransactionsToXML } from "@/utils/exportUtils";
import { Download, FileText, FileCode } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Helper to group transactions by month
function groupTransactionsByMonth(transactions: Transaction[]) {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = {
        income: 0,
        expense: 0,
        month: new Date(year, month, 1),
      };
    }
    
    if (transaction.type === 'income') {
      acc[key].income += Number(transaction.amount);
    } else {
      acc[key].expense += Number(transaction.amount);
    }
    
    return acc;
  }, {} as Record<string, { income: number; expense: number; month: Date }>);
  
  return Object.values(grouped).sort((a, b) => a.month.getTime() - b.month.getTime());
}

// Helper to group transactions by category
function groupTransactionsByCategory(transactions: Transaction[], type: 'income' | 'expense') {
  const filtered = transactions.filter(t => t.type === type);
  
  const grouped = filtered.reduce((acc, transaction) => {
    const category = transaction.category;
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += Number(transaction.amount);
    
    return acc;
  }, {} as Record<string, number>);
  
  return grouped;
}

// Helper to get the period label
function getPeriodLabel(period: string): string {
  switch (period) {
    case 'lastmonth': return 'Último mês';
    case 'last3months': return 'Últimos 3 meses';
    case 'last6months': return 'Últimos 6 meses';
    case 'thisyear': return 'Este ano';
    case 'lastyear': return 'Ano anterior';
    case 'all': return 'Todo período';
    default: return 'Período personalizado';
  }
}

export default function Reports() {
  const [period, setPeriod] = useState("last6months");
  const [chartView, setChartView] = useState("line");
  
  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Filter transactions based on selected period
  const filteredTransactions = transactions?.filter(transaction => {
    const txDate = new Date(transaction.date);
    const now = new Date();
    
    if (period === "lastmonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
    } else if (period === "last3months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return txDate >= threeMonthsAgo;
    } else if (period === "last6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return txDate >= sixMonthsAgo;
    } else if (period === "thisyear") {
      return txDate.getFullYear() === now.getFullYear();
    } else if (period === "lastyear") {
      return txDate.getFullYear() === now.getFullYear() - 1;
    }
    
    return true;
  }) || [];
  
  // Prepare data for charts
  const monthlyData = groupTransactionsByMonth(filteredTransactions);
  const categoryExpenses = groupTransactionsByCategory(filteredTransactions, 'expense');
  const categoryIncome = groupTransactionsByCategory(filteredTransactions, 'income');
  
  // Map category names to colors
  const categoryColors = categories ? categories.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {} as Record<string, string>) : {};
  
  // Monthly overview chart data
  const monthlyChartData = {
    labels: monthlyData.map(data => {
      return data.month.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Receitas',
        data: monthlyData.map(data => data.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Despesas',
        data: monthlyData.map(data => data.expense),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.3,
      }
    ],
  };
  
  // Expense by category chart data
  const expenseCategoryChartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: Object.keys(categoryExpenses).map(category => 
          categoryColors[category] || `hsl(${Math.random() * 360}, 70%, 50%)`
        ),
        borderWidth: 1,
      }
    ],
  };
  
  // Income by category chart data
  const incomeCategoryChartData = {
    labels: Object.keys(categoryIncome),
    datasets: [
      {
        data: Object.values(categoryIncome),
        backgroundColor: Object.keys(categoryIncome).map(category => 
          categoryColors[category] || `hsl(${Math.random() * 360}, 70%, 50%)`
        ),
        borderWidth: 1,
      }
    ],
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, { notation: 'compact' });
          }
        }
      }
    }
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, { notation: 'compact' });
          }
        }
      }
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += formatCurrency(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };
  
  // Calculate summary data
  const totalIncome = monthlyData.reduce((sum, data) => sum + data.income, 0);
  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expense, 0);
  const balance = totalIncome - totalExpenses;
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4 sm:px-0">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar relatórios</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados para os relatórios. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
        <p className="mt-1 text-sm text-gray-600">
          Acompanhe seus dados financeiros de forma visual
        </p>
      </div>
      
      {/* Period selector and export buttons */}
      <div className="flex justify-between px-4 sm:px-0 mb-6">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() => exportTransactionsToPDF(
              filteredTransactions, 
              categories || [],
              {
                title: 'Relatório de Transações',
                fileName: `transacoes-${formatMonthYear(new Date())}`,
                period: getPeriodLabel(period)
              }
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Exportar PDF</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() => exportTransactionsToXML(
              filteredTransactions,
              {
                title: 'Relatório de Transações',
                fileName: `transacoes-${formatMonthYear(new Date())}`,
                period: getPeriodLabel(period)
              }
            )}
          >
            <FileCode className="h-4 w-4" />
            <span>Exportar XML</span>
          </Button>
        </div>
        
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastmonth">Último mês</SelectItem>
            <SelectItem value="last3months">Últimos 3 meses</SelectItem>
            <SelectItem value="last6months">Últimos 6 meses</SelectItem>
            <SelectItem value="thisyear">Este ano</SelectItem>
            <SelectItem value="lastyear">Ano anterior</SelectItem>
            <SelectItem value="all">Todo período</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4 sm:px-0">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <i className="fas fa-arrow-down text-secondary"></i>
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Receitas</dt>
                <dd className="mt-1 text-2xl font-semibold text-secondary tabular-nums">{formatCurrency(totalIncome)}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <i className="fas fa-arrow-up text-danger"></i>
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Despesas</dt>
                <dd className="mt-1 text-2xl font-semibold text-danger tabular-nums">{formatCurrency(totalExpenses)}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${balance >= 0 ? 'bg-primary/10' : 'bg-red-100'} rounded-md p-3`}>
                <i className={`fas fa-wallet ${balance >= 0 ? 'text-primary' : 'text-danger'}`}></i>
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Saldo no Período</dt>
                <dd className={`mt-1 text-2xl font-semibold ${balance >= 0 ? 'text-primary' : 'text-danger'} tabular-nums`}>
                  {formatCurrency(balance)}
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly overview chart */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Visão Mensal</CardTitle>
          <div className="flex space-x-2">
            <Select value={chartView} onValueChange={setChartView}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tipo de gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Linha</SelectItem>
                <SelectItem value="bar">Barras</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <i className="fas fa-chart-line text-4xl mb-3"></i>
                  <p>Sem dados para o período selecionado</p>
                </div>
              </div>
            ) : chartView === 'line' ? (
              <Line data={monthlyChartData} options={lineChartOptions} />
            ) : (
              <Bar data={monthlyChartData} options={barChartOptions} />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Category charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {Object.keys(categoryExpenses).length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <i className="fas fa-chart-pie text-4xl mb-3"></i>
                    <p>Sem despesas no período selecionado</p>
                  </div>
                </div>
              ) : (
                <Doughnut data={expenseCategoryChartData} options={doughnutChartOptions} />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {Object.keys(categoryIncome).length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <i className="fas fa-chart-pie text-4xl mb-3"></i>
                    <p>Sem receitas no período selecionado</p>
                  </div>
                </div>
              ) : (
                <Doughnut data={incomeCategoryChartData} options={doughnutChartOptions} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed metrics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Métricas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Mensais</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Mês</th>
                      <th className="py-2 text-right font-medium">Receitas</th>
                      <th className="py-2 text-right font-medium">Despesas</th>
                      <th className="py-2 text-right font-medium">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          Sem dados para o período selecionado
                        </td>
                      </tr>
                    ) : (
                      monthlyData.map((data, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">
                            {data.month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </td>
                          <td className="py-2 text-right tabular-nums text-secondary">
                            {formatCurrency(data.income)}
                          </td>
                          <td className="py-2 text-right tabular-nums text-danger">
                            {formatCurrency(data.expense)}
                          </td>
                          <td className={`py-2 text-right tabular-nums ${data.income - data.expense >= 0 ? 'text-primary' : 'text-danger'}`}>
                            {formatCurrency(data.income - data.expense)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="expenses" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Categoria</th>
                      <th className="py-2 text-right font-medium">Valor</th>
                      <th className="py-2 text-right font-medium">% do Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(categoryExpenses).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">
                          Sem despesas no período selecionado
                        </td>
                      </tr>
                    ) : (
                      Object.entries(categoryExpenses)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount], index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 flex items-center">
                              <span 
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: categoryColors[category] || '#9ca3af' }}
                              ></span>
                              {category}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {formatCurrency(amount)}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {totalExpenses ? ((amount / totalExpenses) * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Categoria</th>
                      <th className="py-2 text-right font-medium">Valor</th>
                      <th className="py-2 text-right font-medium">% do Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(categoryIncome).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">
                          Sem receitas no período selecionado
                        </td>
                      </tr>
                    ) : (
                      Object.entries(categoryIncome)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount], index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 flex items-center">
                              <span 
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: categoryColors[category] || '#9ca3af' }}
                              ></span>
                              {category}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {formatCurrency(amount)}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {totalIncome ? ((amount / totalIncome) * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
