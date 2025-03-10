import { Link } from "wouter";
import { useState } from "react";

type NavbarProps = {
  currentPath: string;
  onNewTransaction: () => void;
};

export default function Navbar({ currentPath, onNewTransaction }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-wallet text-primary text-2xl mr-2"></i>
              <span className="text-xl font-bold text-primary">FinControl</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex space-x-8">
              <Link href="/">
                <a className={`${currentPath === '/' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/transactions">
                <a className={`${currentPath === '/transactions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Transações
                </a>
              </Link>
              <Link href="/cards">
                <a className={`${currentPath === '/cards' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Cartões
                </a>
              </Link>
              <Link href="/reports">
                <a className={`${currentPath === '/reports' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Relatórios
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button 
              className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={onNewTransaction}
            >
              <i className="fas fa-plus mr-2"></i>Nova Transação
            </button>
            <div className="ml-4 relative">
              <button className="flex text-sm rounded-full focus:outline-none">
                <span className="sr-only">Abrir menu de usuário</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fas fa-user text-gray-500"></i>
                </div>
              </button>
            </div>
            <button
              className="ml-4 sm:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleMobileMenu}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden border-t border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`${currentPath === '/' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'} block px-3 py-2 rounded-md text-base font-medium`}>
              Dashboard
            </a>
          </Link>
          <Link href="/transactions">
            <a className={`${currentPath === '/transactions' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'} block px-3 py-2 rounded-md text-base font-medium`}>
              Transações
            </a>
          </Link>
          <Link href="/cards">
            <a className={`${currentPath === '/cards' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'} block px-3 py-2 rounded-md text-base font-medium`}>
              Cartões
            </a>
          </Link>
          <Link href="/reports">
            <a className={`${currentPath === '/reports' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'} block px-3 py-2 rounded-md text-base font-medium`}>
              Relatórios
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
