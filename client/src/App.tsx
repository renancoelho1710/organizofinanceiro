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
import { useState } from "react";
import TransactionModal from "@/components/modals/TransactionModal";

function App() {
  const [location] = useLocation();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
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
