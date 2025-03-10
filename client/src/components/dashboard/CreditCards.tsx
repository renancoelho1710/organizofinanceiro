import { formatCurrency } from "@/utils/formatCurrency";
import type { CreditCard } from "@shared/schema";

type CreditCardsProps = {
  cards: CreditCard[];
  onAddCard?: () => void;
};

type CardItemProps = {
  card: CreditCard;
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

function CardItem({ card }: CardItemProps) {
  const cardIcon = getCardIcon(card.cardType);
  
  // Current date
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate closing date
  const closingDate = new Date(currentYear, currentMonth, card.closingDate);
  if (now > closingDate) {
    closingDate.setMonth(closingDate.getMonth() + 1);
  }
  
  const formattedClosingDate = closingDate.toLocaleDateString('pt-BR');
  
  return (
    <div className="rounded-xl p-4 shadow-md text-white"
         style={{ background: `linear-gradient(to right, ${card.color}, ${card.color}CC)` }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs opacity-80">{card.name}</p>
          <p className="text-sm mt-3 tracking-wider">•••• •••• •••• {card.lastFourDigits}</p>
        </div>
        <i className={`${cardIcon} text-xl`}></i>
      </div>
      <div className="mt-4">
        <p className="text-xs opacity-80">Fatura Atual</p>
        <p className="text-lg font-bold tabular-nums">{formatCurrency(card.currentBalance)}</p>
        <div className="mt-1 text-xs">
          <span className="opacity-80">Limite: </span>
          <span className="font-medium">{formatCurrency(card.limit)}</span>
        </div>
        <div className="mt-1 text-xs">
          <span className="opacity-80">Fecha em: </span>
          <span className="font-medium">{formattedClosingDate}</span>
        </div>
      </div>
    </div>
  );
}

export default function CreditCards({ cards, onAddCard }: CreditCardsProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Seus Cartões</h2>
            <button
              className="text-sm font-medium text-primary hover:text-blue-700"
              onClick={onAddCard}
            >
              <i className="fas fa-plus mr-1"></i> Adicionar
            </button>
          </div>
          <div className="text-center py-10 text-gray-500">
            <i className="fas fa-credit-card text-3xl mb-3"></i>
            <p className="mb-2">Você ainda não possui cartões cadastrados</p>
            <button
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-blue-700"
              onClick={onAddCard}
            >
              <i className="fas fa-plus mr-2"></i> Adicionar Cartão
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Seus Cartões</h2>
          <button
            className="text-sm font-medium text-primary hover:text-blue-700"
            onClick={onAddCard}
          >
            <i className="fas fa-plus mr-1"></i> Adicionar
          </button>
        </div>
        <div className="space-y-4">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
