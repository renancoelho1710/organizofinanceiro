import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { CreditCard } from "@shared/schema";

// Form schema for credit card
const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  lastFourDigits: z.string().min(4, "Últimos 4 dígitos são obrigatórios").max(4),
  limit: z.string().min(1, "Limite é obrigatório"),
  currentBalance: z.string().default("0"),
  dueDate: z.string().min(1, "Dia de vencimento é obrigatório"),
  closingDate: z.string().min(1, "Dia de fechamento é obrigatório"),
  cardType: z.string().min(1, "Tipo de cartão é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreditCardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: creditCards, isLoading, error } = useQuery<CreditCard[]>({
    queryKey: ["/api/credit-cards"],
  });
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastFourDigits: "",
      limit: "",
      currentBalance: "0",
      dueDate: "",
      closingDate: "",
      cardType: "mastercard",
      color: "#9333ea", // Default purple
    },
  });
  
  const handleAddCard = async (data: FormData) => {
    setIsPending(true);
    
    try {
      const cardData = {
        ...data,
        limit: parseFloat(data.limit),
        currentBalance: parseFloat(data.currentBalance || "0"),
        dueDate: parseInt(data.dueDate),
        closingDate: parseInt(data.closingDate),
      };
      
      await apiRequest("POST", "/api/credit-cards", cardData);
      
      queryClient.invalidateQueries({ queryKey: ["/api/credit-cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      toast({
        title: "Cartão adicionado",
        description: "Cartão adicionado com sucesso",
      });
      
      form.reset();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar cartão",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };
  
  function getCardIcon(cardType: string | null) {
    switch (cardType?.toLowerCase()) {
      case 'visa':
        return 'fab fa-cc-visa';
      case 'mastercard':
        return 'fab fa-cc-mastercard';
      case 'amex':
        return 'fab fa-cc-amex';
      default:
        return 'fas fa-credit-card';
    }
  }
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar cartões</AlertTitle>
          <AlertDescription>
            Não foi possível carregar seus cartões de crédito. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Calculate the current month's closing date for each card
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cartões de Crédito</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie todos os seus cartões em um só lugar
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus mr-2"></i>Adicionar Cartão
        </Button>
      </div>
      
      {creditCards?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10 text-gray-500">
              <i className="fas fa-credit-card text-4xl mb-3"></i>
              <p className="mb-2">Você ainda não possui cartões cadastrados</p>
              <Button 
                className="mt-2" 
                onClick={() => setIsModalOpen(true)}
              >
                <i className="fas fa-plus mr-2"></i>Adicionar Cartão
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
          {creditCards?.map((card) => {
            // Calculate closing date
            const closingDate = new Date(currentYear, currentMonth, card.closingDate);
            if (today > closingDate) {
              closingDate.setMonth(closingDate.getMonth() + 1);
            }
            
            // Calculate due date
            const dueDate = new Date(currentYear, currentMonth, card.dueDate);
            if (today > dueDate) {
              dueDate.setMonth(dueDate.getMonth() + 1);
            }
            
            // Format dates
            const formattedClosingDate = closingDate.toLocaleDateString('pt-BR');
            const formattedDueDate = dueDate.toLocaleDateString('pt-BR');
            
            // Calculate usage percentage
            const usagePercentage = Math.min(100, Math.round((Number(card.currentBalance) / Number(card.limit)) * 100));
            
            return (
              <Card key={card.id} className="overflow-hidden">
                <div 
                  className="h-32 flex justify-between items-start p-4 text-white"
                  style={{ background: `linear-gradient(to right, ${card.color}, ${card.color}CC)` }}
                >
                  <div>
                    <p className="text-sm opacity-80">{card.name}</p>
                    <p className="text-sm mt-3 tracking-wider">•••• •••• •••• {card.lastFourDigits}</p>
                  </div>
                  <i className={`${getCardIcon(card.cardType)} text-xl`}></i>
                </div>
                
                <CardContent className="p-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">Fatura Atual</p>
                      <p className="text-lg font-bold tabular-nums">{formatCurrency(card.currentBalance)}</p>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className={`h-2.5 rounded-full ${usagePercentage > 80 ? 'bg-danger' : 'bg-primary'}`}
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Limite</p>
                        <p className="font-medium tabular-nums">{formatCurrency(card.limit)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Disponível</p>
                        <p className="font-medium tabular-nums">{formatCurrency(Number(card.limit) - Number(card.currentBalance))}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha em</p>
                        <p className="font-medium">{formattedClosingDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Vence em</p>
                        <p className="font-medium">{formattedDueDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Add Card Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCard)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do cartão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Nubank, Itaú Platinum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastFourDigits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Últimos 4 dígitos</FormLabel>
                      <FormControl>
                        <Input placeholder="1234" maxLength={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite</FormLabel>
                      <FormControl>
                        <Input placeholder="5000" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="closingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de fechamento</FormLabel>
                      <FormControl>
                        <Input placeholder="15" type="number" min="1" max="31" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de vencimento</FormLabel>
                      <FormControl>
                        <Input placeholder="22" type="number" min="1" max="31" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="cardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bandeira</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                        <SelectItem value="other">Outra</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor do cartão</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-10 p-1"
                        />
                        <span className="text-sm">{field.value}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
