export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <i className="fas fa-wallet text-primary text-lg mr-2"></i>
            <span className="text-sm font-medium text-gray-900">FinControl</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Suporte</span>
              <i className="fas fa-question-circle"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Contato</span>
              <i className="fas fa-envelope"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} FinControl. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
