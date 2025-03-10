import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatCurrency";
import { FiPlus, FiTarget, FiEdit2, FiTrash2 } from "react-icons/fi";

// Dados de exemplo para metas - serão substituídos pela API real
const DEMO_GOALS = [
  {
    id: 1,
    title: "Viagem para a Europa",
    description: "Economia para viagem em julho",
    targetAmount: 10000,
    currentAmount: 3500,
    deadline: "2025-07-15",
    color: "#8e44ad",
  },
  {
    id: 2,
    title: "Novo Notebook",
    description: "Para trabalho e estudos",
    targetAmount: 5000,
    currentAmount: 2000,
    deadline: "2025-04-30",
    color: "#3498db",
  },
  {
    id: 3,
    title: "Reserva de Emergência",
    description: "6 meses de gastos essenciais",
    targetAmount: 15000,
    currentAmount: 7500,
    deadline: "2025-12-31",
    color: "#2ecc71",
  }
];

export default function Goals() {
  const [goals, setGoals] = useState(DEMO_GOALS);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    color: "#8e44ad"
  });

  // Função para calcular a porcentagem de progresso
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para calcular dias restantes
  const calculateDaysRemaining = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    
    // Reset horas para comparar apenas datas
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Adicionar nova meta (simulado)
  const handleAddGoal = () => {
    const goal = {
      ...newGoal,
      id: goals.length + 1, // Simulando um ID (seria gerado pelo backend)
    };
    
    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      color: "#8e44ad"
    });
    setIsAddingGoal(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metas de Economia</h1>
          <p className="text-gray-500">Acompanhe o progresso de suas metas financeiras</p>
        </div>
        <Button 
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          className="flex items-center gap-2"
        >
          <FiPlus size={18} />
          Nova Meta
        </Button>
      </div>
      
      {/* Formulário para adicionar nova meta */}
      {isAddingGoal && (
        <Card className="mb-8 border-2 border-primary border-dashed">
          <CardHeader>
            <CardTitle>Nova Meta de Economia</CardTitle>
            <CardDescription>Adicione uma nova meta para acompanhar seu progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="Ex: Viagem para a Europa" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description" 
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Ex: Férias na Itália e França" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Valor da Meta (R$)</Label>
                <Input 
                  id="targetAmount" 
                  type="number"
                  value={newGoal.targetAmount || ""}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                  placeholder="Ex: 5000" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Valor Atual (R$)</Label>
                <Input 
                  id="currentAmount" 
                  type="number"
                  value={newGoal.currentAmount || ""}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: Number(e.target.value)})}
                  placeholder="Ex: 1500" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Data limite</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="color" 
                    type="color"
                    value={newGoal.color}
                    onChange={(e) => setNewGoal({...newGoal, color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <div 
                    className="w-10 h-10 rounded-full" 
                    style={{backgroundColor: newGoal.color}}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingGoal(false)}>Cancelar</Button>
            <Button onClick={handleAddGoal}>Salvar Meta</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Lista de metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysRemaining = calculateDaysRemaining(goal.deadline);
          
          return (
            <Card key={goal.id} className="shadow-sm hover:shadow-md transition-shadow">
              <div className="h-2" style={{backgroundColor: goal.color}} />
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{goal.title}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FiEdit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progresso:</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Meta</p>
                    <p className="text-lg font-semibold">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Atual</p>
                    <p className="text-lg font-semibold">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <FiTarget className="mr-1" size={14} />
                      <span>Data limite:</span>
                    </div>
                    <span className="font-medium">{formatDate(goal.deadline)}</span>
                  </div>
                  <div className="mt-1 text-sm text-right">
                    {daysRemaining > 0 ? (
                      <span className="text-primary font-medium">{daysRemaining} dias restantes</span>
                    ) : (
                      <span className="text-red-500 font-medium">Meta vencida</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Adicionar Progresso
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {goals.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <FiTarget size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma meta cadastrada</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Defina metas financeiras para acompanhar seu progresso e realizações
          </p>
          <Button onClick={() => setIsAddingGoal(true)}>
            Criar Primeira Meta
          </Button>
        </div>
      )}
    </div>
  );
}