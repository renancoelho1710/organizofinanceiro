import {
  users, transactions, categories, bills, creditCards, accountBalances,
  type User, type InsertUser,
  type Transaction, type InsertTransaction,
  type Category, type InsertCategory,
  type Bill, type InsertBill,
  type CreditCard, type InsertCreditCard,
  type AccountBalance, type InsertAccountBalance
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransactionsByMonth(userId: number, year: number, month: number): Promise<Transaction[]>;
  getRecentTransactions(userId: number, limit: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;

  // Category operations
  getCategories(userId: number): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Bill operations
  getBills(userId: number): Promise<Bill[]>;
  getUpcomingBills(userId: number, limit: number): Promise<Bill[]>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill | undefined>;
  deleteBill(id: number): Promise<boolean>;
  
  // Credit Card operations
  getCreditCards(userId: number): Promise<CreditCard[]>;
  createCreditCard(creditCard: InsertCreditCard): Promise<CreditCard>;
  updateCreditCard(id: number, creditCard: Partial<InsertCreditCard>): Promise<CreditCard | undefined>;
  deleteCreditCard(id: number): Promise<boolean>;
  
  // Balance operations
  getAccountBalance(userId: number): Promise<AccountBalance | undefined>;
  updateAccountBalance(userId: number, balance: Partial<InsertAccountBalance>): Promise<AccountBalance | undefined>;
  
  // Import operations
  importTransactions(userId: number, transactions: InsertTransaction[]): Promise<Transaction[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private categories: Map<number, Category>;
  private bills: Map<number, Bill>;
  private creditCards: Map<number, CreditCard>;
  private accountBalances: Map<number, AccountBalance>;
  
  private userIdCounter: number;
  private transactionIdCounter: number;
  private categoryIdCounter: number;
  private billIdCounter: number;
  private creditCardIdCounter: number;
  private accountBalanceIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.categories = new Map();
    this.bills = new Map();
    this.creditCards = new Map();
    this.accountBalances = new Map();
    
    this.userIdCounter = 1;
    this.transactionIdCounter = 1;
    this.categoryIdCounter = 1;
    this.billIdCounter = 1;
    this.creditCardIdCounter = 1;
    this.accountBalanceIdCounter = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }
  
  private initializeDemoData() {
    // Create a demo user
    const demoUser: InsertUser = {
      username: "demo",
      password: "demo123",
      name: "João Silva",
      email: "joao@example.com"
    };
    
    // User should be created synchronously for initializeDemoData
    const id = this.userIdCounter++;
    const user: User = { ...demoUser, id };
    this.users.set(id, user);
    
    // Create account balance for the user
    const accountBalance: AccountBalance = {
      id: this.accountBalanceIdCounter++,
      userId: user.id,
      totalBalance: "5450.00",
      monthlyIncome: "5250.00",
      monthlyExpenses: "1750.00",
      creditCardBills: "950.00",
      updatedAt: new Date()
    };
    this.accountBalances.set(accountBalance.id, accountBalance);
    
    // Create demo categories
    const categories = [
      { userId: user.id, name: "Moradia", color: "#2563eb" },
      { userId: user.id, name: "Alimentação", color: "#10b981" },
      { userId: user.id, name: "Transporte", color: "#f59e0b" },
      { userId: user.id, name: "Saúde", color: "#ef4444" },
      { userId: user.id, name: "Lazer", color: "#dc2626" },
      { userId: user.id, name: "Receita", color: "#8b5cf6" },
      { userId: user.id, name: "Outros", color: "#9ca3af" }
    ];
    
    categories.forEach(cat => this.createCategory(cat));
    
    // Create demo credit cards
    const creditCards = [
      {
        userId: user.id,
        name: "Nubank",
        lastFourDigits: "4587",
        limit: "5000",
        currentBalance: "1240.56",
        dueDate: 9,
        closingDate: 2,
        cardType: "mastercard",
        color: "#9333ea"
      },
      {
        userId: user.id,
        name: "Itaú Platinum",
        lastFourDigits: "7845",
        limit: "8000",
        currentBalance: "599.76",
        dueDate: 15,
        closingDate: 10,
        cardType: "visa",
        color: "#0284c7"
      }
    ];
    
    creditCards.forEach(card => this.createCreditCard(card));
    
    // Create demo transactions
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    
    const transactions = [
      {
        userId: user.id,
        description: "Mercado Pão de Açúcar",
        amount: 128.47,
        date: now,
        type: "expense",
        category: "Alimentação",
        paymentMethod: "Cartão de Crédito",
        notes: "",
        creditCardId: 1
      },
      {
        userId: user.id,
        description: "iFood",
        amount: 42.90,
        date: yesterday,
        type: "expense",
        category: "Alimentação",
        paymentMethod: "Cartão de Crédito",
        notes: "",
        creditCardId: 1
      },
      {
        userId: user.id,
        description: "Posto Shell",
        amount: 150.00,
        date: lastWeek,
        type: "expense",
        category: "Transporte",
        paymentMethod: "Cartão de Crédito",
        notes: "",
        creditCardId: 2
      },
      {
        userId: user.id,
        description: "Salário",
        amount: 5250.00,
        date: lastWeek,
        type: "income",
        category: "Receita",
        paymentMethod: "Transferência",
        notes: "",
        creditCardId: null
      },
      {
        userId: user.id,
        description: "Cinema Shopping",
        amount: 72.00,
        date: lastWeek,
        type: "expense",
        category: "Lazer",
        paymentMethod: "Cartão de Débito",
        notes: "",
        creditCardId: null
      }
    ];
    
    transactions.forEach(tx => this.createTransaction(tx as InsertTransaction));
    
    // Create demo bills
    const dueDate1 = new Date();
    dueDate1.setDate(now.getDate() + 3);
    const dueDate2 = new Date();
    dueDate2.setDate(now.getDate() + 5);
    const dueDate3 = new Date();
    dueDate3.setDate(now.getDate() + 7);
    const dueDate4 = new Date();
    dueDate4.setDate(now.getDate() + 10);
    
    const bills = [
      {
        userId: user.id,
        description: "Aluguel",
        amount: 1800.00,
        dueDate: dueDate1,
        paid: false,
        recurring: true,
        category: "Moradia",
        notes: ""
      },
      {
        userId: user.id,
        description: "Energia Elétrica",
        amount: 245.78,
        dueDate: dueDate2,
        paid: false,
        recurring: true,
        category: "Moradia",
        notes: ""
      },
      {
        userId: user.id,
        description: "Fatura Cartão Nubank",
        amount: 1240.56,
        dueDate: dueDate3,
        paid: false,
        recurring: true,
        category: "Cartão de Crédito",
        notes: ""
      },
      {
        userId: user.id,
        description: "Internet",
        amount: 119.90,
        dueDate: dueDate4,
        paid: false,
        recurring: true,
        category: "Moradia",
        notes: ""
      }
    ];
    
    bills.forEach(bill => this.createBill(bill));
    
    // Create account balance
    this.updateAccountBalance(user.id, {
      userId: user.id,
      totalBalance: "4628.90",
      monthlyIncome: "5250.00",
      monthlyExpenses: "3187.45",
      creditCardBills: "1840.32"
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Transaction operations
  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async getTransactionsByMonth(userId: number, year: number, month: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(transaction => {
      const txDate = new Date(transaction.date);
      return transaction.userId === userId && 
             txDate.getFullYear() === year && 
             txDate.getMonth() === month;
    });
  }
  
  async getRecentTransactions(userId: number, limit: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    
    // Update account balance
    await this.updateBalanceAfterTransaction(insertTransaction);
    
    return transaction;
  }
  
  async updateTransaction(id: number, transactionUpdate: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    
    return updatedTransaction;
  }
  
  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }
  
  // Category operations
  async getCategories(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.userId === userId
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Bill operations
  async getBills(userId: number): Promise<Bill[]> {
    return Array.from(this.bills.values()).filter(
      (bill) => bill.userId === userId
    );
  }
  
  async getUpcomingBills(userId: number, limit: number): Promise<Bill[]> {
    const now = new Date();
    
    return Array.from(this.bills.values())
      .filter(bill => 
        bill.userId === userId && 
        new Date(bill.dueDate) >= now && 
        !bill.paid
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, limit);
  }
  
  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = this.billIdCounter++;
    const bill: Bill = { ...insertBill, id };
    this.bills.set(id, bill);
    return bill;
  }
  
  async updateBill(id: number, billUpdate: Partial<InsertBill>): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (!bill) return undefined;
    
    const updatedBill = { ...bill, ...billUpdate };
    this.bills.set(id, updatedBill);
    
    return updatedBill;
  }
  
  async deleteBill(id: number): Promise<boolean> {
    return this.bills.delete(id);
  }
  
  // Credit Card operations
  async getCreditCards(userId: number): Promise<CreditCard[]> {
    return Array.from(this.creditCards.values()).filter(
      (card) => card.userId === userId
    );
  }
  
  async createCreditCard(insertCreditCard: InsertCreditCard): Promise<CreditCard> {
    const id = this.creditCardIdCounter++;
    const creditCard: CreditCard = { ...insertCreditCard, id };
    this.creditCards.set(id, creditCard);
    return creditCard;
  }
  
  async updateCreditCard(id: number, creditCardUpdate: Partial<InsertCreditCard>): Promise<CreditCard | undefined> {
    const creditCard = this.creditCards.get(id);
    if (!creditCard) return undefined;
    
    const updatedCreditCard = { ...creditCard, ...creditCardUpdate };
    this.creditCards.set(id, updatedCreditCard);
    
    return updatedCreditCard;
  }
  
  async deleteCreditCard(id: number): Promise<boolean> {
    return this.creditCards.delete(id);
  }
  
  // Account Balance operations
  async getAccountBalance(userId: number): Promise<AccountBalance | undefined> {
    return Array.from(this.accountBalances.values()).find(
      (balance) => balance.userId === userId
    );
  }
  
  async updateAccountBalance(userId: number, balanceUpdate: Partial<InsertAccountBalance>): Promise<AccountBalance | undefined> {
    let balance = Array.from(this.accountBalances.values()).find(
      (balance) => balance.userId === userId
    );
    
    if (!balance) {
      const id = this.accountBalanceIdCounter++;
      balance = { 
        id, 
        userId,
        totalBalance: "0",
        monthlyIncome: "0",
        monthlyExpenses: "0",
        creditCardBills: "0",
        updatedAt: new Date()
      };
      this.accountBalances.set(id, balance);
    }
    
    const updatedBalance = { 
      ...balance, 
      ...balanceUpdate, 
      updatedAt: new Date() 
    };
    
    this.accountBalances.set(balance.id, updatedBalance);
    
    return updatedBalance;
  }
  
  // Helper to update account balance after transactions
  private async updateBalanceAfterTransaction(transaction: InsertTransaction): Promise<void> {
    const balance = await this.getAccountBalance(transaction.userId);
    if (!balance) return;
    
    let totalBalance = Number(balance.totalBalance);
    let monthlyIncome = Number(balance.monthlyIncome);
    let monthlyExpenses = Number(balance.monthlyExpenses);
    
    const transactionAmount = Number(transaction.amount);
    
    if (transaction.type === 'income') {
      totalBalance += transactionAmount;
      monthlyIncome += transactionAmount;
    } else {
      totalBalance -= transactionAmount;
      monthlyExpenses += transactionAmount;
    }
    
    await this.updateAccountBalance(transaction.userId, {
      totalBalance: totalBalance.toString(),
      monthlyIncome: monthlyIncome.toString(),
      monthlyExpenses: monthlyExpenses.toString()
    });
  }
  
  // Import operations
  async importTransactions(userId: number, transactions: InsertTransaction[]): Promise<Transaction[]> {
    const createdTransactions: Transaction[] = [];
    
    for (const transaction of transactions) {
      const createdTransaction = await this.createTransaction({
        ...transaction,
        userId
      });
      createdTransactions.push(createdTransaction);
    }
    
    return createdTransactions;
  }
}

export const storage = new MemStorage();
