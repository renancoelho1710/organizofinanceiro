import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertTransactionSchema } from "@shared/schema";

// Extend the schema with frontend validations
const formSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, "Valor é obrigatório").regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.enum(["expense", "income"], {
    required_error: "Tipo é obrigatório",
  }),
});

// Convert the schema back to use amounts as numbers when submitting
const submitSchema = formSchema.transform((data) => ({
  ...data,
  amount: parseFloat(data.amount),
}));

type FormData = z.infer<typeof formSchema>;

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      type: "expense",
      category: "Outros",
      paymentMethod: "Dinheiro",
      notes: "",
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    
    try {
      // Use the submit schema to transform the data
      const validatedData = submitSchema.parse(data);
      
      // Add userId (this will be set on the server)
      const transaction = {
        ...validatedData,
        creditCardId: null, // Default to no credit card
      };
      
      await apiRequest("POST", "/api/transactions", transaction);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      
      toast({
        title: "Transação registrada",
        description: "Transação registrada com sucesso",
      });
      
      // Close modal and reset form
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar transação",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Mercado, Aluguel, Salário" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <Input 
                        placeholder="0.00" 
                        className="pl-10" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">Despesa</SelectItem>
                        <SelectItem value="income">Receita</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Alimentação">Alimentação</SelectItem>
                      <SelectItem value="Moradia">Moradia</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Lazer">Lazer</SelectItem>
                      <SelectItem value="Vestuário">Vestuário</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                      <SelectItem value="Receita">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações adicionais (opcional)" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button" 
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
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
  );
}
