import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import CreditCardPage from "@/pages/CreditCardPage";
import Reports from "@/pages/Reports";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import TransactionModal from "@/components/modals/TransactionModal";
import { NotificationBanner } from "@/components/ui/notification-banner";

function App() {
  const [location] = useLocation();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "default" | "success" | "warning" | "error" | "info";
    visible: boolean;
  }>({
    message: "Bem-vindo ao Organizo Financeiro! Gerencie suas finanças de forma simples e eficaz.",
    variant: "default",
    visible: true,
  });

  // Efeito para esconder a notificação após alguns segundos (opcional)
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        {notification.visible && (
          <NotificationBanner 
            variant={notification.variant}
            onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
          >
            {notification.message}
          </NotificationBanner>
        )}
        <Navbar 
          currentPath={location} 
          onNewTransaction={() => setIsTransactionModalOpen(true)} 
        />
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/cards" component={CreditCardPage} />
            <Route path="/reports" component={Reports} />
            <Route path="/goals">
              <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Metas de Economia</h1>
                <div className="text-center py-10 text-gray-500">
                  Funcionalidade em desenvolvimento...
                </div>
              </div>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />

        {/* Transaction Modal */}
        <TransactionModal 
          isOpen={isTransactionModalOpen} 
          onClose={() => setIsTransactionModalOpen(false)} 
        />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
