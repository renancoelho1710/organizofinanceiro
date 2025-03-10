import { Link } from "wouter";
import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiCloud } from "react-icons/fi";
import { WiDaySunnyOvercast, WiDayCloudy } from "react-icons/wi";

type NavbarProps = {
  currentPath: string;
  onNewTransaction: () => void;
};

type TimeOfDay = 'morning' | 'afternoon' | 'night' | 'cloudy';

export default function Navbar({ currentPath, onNewTransaction }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [userName, setUserName] = useState("João");
  
  useEffect(() => {
    // Determinar o período do dia com base na hora atual
    const getCurrentTimeOfDay = (): TimeOfDay => {
      const currentHour = new Date().getHours();
      
      // Dias de semana são "nublados" (para fins de demonstração - segunda-feira)
      const isMonday = new Date().getDay() === 1;
      if (isMonday) return 'cloudy';
      
      if (currentHour >= 5 && currentHour < 12) {
        return 'morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        return 'afternoon';
      } else {
        return 'night';
      }
    };
    
    setTimeOfDay(getCurrentTimeOfDay());
    
    // Buscar nome do usuário (poderia vir de uma API)
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        if (userData && userData.name) {
          const firstName = userData.name.split(' ')[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <FiSun className="text-yellow-500" />;
      case 'afternoon':
        return <WiDaySunnyOvercast className="text-orange-400" />;
      case 'night':
        return <FiMoon className="text-indigo-400" />;
      case 'cloudy':
        return <WiDayCloudy className="text-gray-400" />;
      default:
        return <FiSun className="text-yellow-500" />;
    }
  };
  
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
            <nav className="hidden sm:ml-6 sm:flex space-x-6">
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
              <Link href="/goals">
                <a className={`${currentPath === '/goals' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Metas
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
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={onNewTransaction}
            >
              <i className="fas fa-plus mr-2"></i>Nova Transação
            </button>
            
            {/* Usuário com ícone de clima */}
            <div className="ml-4 flex items-center text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-1">
                <span className="text-xl">
                  {getTimeIcon()}
                </span>
                <span className="ml-1">Olá, {userName}</span>
              </div>
            </div>
            
            <div className="ml-3 relative">
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
          <Link href="/goals">
            <a className={`${currentPath === '/goals' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'} block px-3 py-2 rounded-md text-base font-medium`}>
              Metas
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
