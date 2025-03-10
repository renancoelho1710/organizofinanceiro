import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionModal from "@/components/modals/TransactionModal";
import type { Transaction } from "@shared/schema";

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Filter transactions
  const filteredTransactions = transactions?.filter(transaction => {
    // Search term
    const matchesSearch = searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || 
      transaction.category === categoryFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || 
      transaction.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-col sm:flex-row gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 flex-1" />
                ))}
              </div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar transações</AlertTitle>
          <AlertDescription>
            Não foi possível carregar suas transações. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transações</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie todas as suas receitas e despesas
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Histórico de Transações</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus mr-2"></i>Nova Transação
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filters */}
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setTypeFilter("all");
                }}
                className="w-full sm:w-auto"
              >
                Limpar Filtros
              </Button>
            </div>
            
            {/* Transactions list */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <i className="fas fa-receipt text-3xl mb-3"></i>
                <p>Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => {
                  const isExpense = transaction.type === 'expense';
                  const textColor = isExpense ? 'text-danger' : 'text-secondary';
                  const amountPrefix = isExpense ? '- ' : '+ ';
                  
                  return (
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {transaction.category} • {transaction.paymentMethod}
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold ${textColor} tabular-nums`}>
                        {amountPrefix}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
