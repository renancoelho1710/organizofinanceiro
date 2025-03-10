import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import UpcomingBills from "@/components/dashboard/UpcomingBills";
import CreditCards from "@/components/dashboard/CreditCards";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ImportExcel from "@/components/dashboard/ImportExcel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
  });
  
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Check if there are upcoming bills
  const hasUpcomingBills = dashboardData?.upcomingBills && dashboardData.upcomingBills.length > 0;
  
  if (isLoading || isUserLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0">
          <Skeleton className="h-80 w-full lg:col-span-2" />
          <Skeleton className="h-80 w-full" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0 mt-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full lg:col-span-2" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados do dashboard. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Olá, {userData?.name || 'Usuário'}!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Resumo financeiro de <span className="font-medium">{dashboardData.currentMonth}</span>
        </p>
      </div>
      
      {/* Alert for upcoming bills */}
      {hasUpcomingBills && (
        <div className="mb-6 px-4 sm:px-0">
          <div className="rounded-md bg-warning/10 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-bell text-warning"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-warning">Atenção</h3>
                <div className="mt-2 text-sm text-warning/80">
                  <p>
                    Você tem {dashboardData.upcomingBills.length} contas prestes a vencer.{' '}
                    <a href="#upcoming-bills" className="font-medium underline">Ver detalhes</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Financial Summary */}
      <FinancialSummary balance={dashboardData.balance} />
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0">
        <ExpenseChart 
          expenses={dashboardData.expensesByCategory} 
          month={dashboardData.currentMonth} 
        />
        <div id="upcoming-bills">
          <UpcomingBills bills={dashboardData.upcomingBills} />
        </div>
      </div>
      
      {/* Content Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0 mt-6">
        <CreditCards cards={dashboardData.creditCards} />
        <RecentTransactions transactions={dashboardData.recentTransactions} />
      </div>
      
      {/* Import Excel */}
      <ImportExcel />
    </div>
  );
}
