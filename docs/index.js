// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  transactions;
  categories;
  bills;
  creditCards;
  accountBalances;
  userIdCounter;
  transactionIdCounter;
  categoryIdCounter;
  billIdCounter;
  creditCardIdCounter;
  accountBalanceIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.bills = /* @__PURE__ */ new Map();
    this.creditCards = /* @__PURE__ */ new Map();
    this.accountBalances = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.transactionIdCounter = 1;
    this.categoryIdCounter = 1;
    this.billIdCounter = 1;
    this.creditCardIdCounter = 1;
    this.accountBalanceIdCounter = 1;
    this.initializeDemoData();
  }
  initializeDemoData() {
    const demoUser = {
      username: "demo",
      password: "demo123",
      name: "Jo\xE3o Silva",
      email: "joao@example.com"
    };
    const id = this.userIdCounter++;
    const user = { ...demoUser, id };
    this.users.set(id, user);
    const accountBalance = {
      id: this.accountBalanceIdCounter++,
      userId: user.id,
      totalBalance: "5450.00",
      monthlyIncome: "5250.00",
      monthlyExpenses: "1750.00",
      creditCardBills: "950.00",
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.accountBalances.set(accountBalance.id, accountBalance);
    const categories2 = [
      { userId: user.id, name: "Moradia", color: "#2563eb" },
      { userId: user.id, name: "Alimenta\xE7\xE3o", color: "#10b981" },
      { userId: user.id, name: "Transporte", color: "#f59e0b" },
      { userId: user.id, name: "Sa\xFAde", color: "#ef4444" },
      { userId: user.id, name: "Lazer", color: "#dc2626" },
      { userId: user.id, name: "Receita", color: "#8b5cf6" },
      { userId: user.id, name: "Outros", color: "#9ca3af" }
    ];
    categories2.forEach((cat) => this.createCategory(cat));
    const creditCards2 = [
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
        name: "Ita\xFA Platinum",
        lastFourDigits: "7845",
        limit: "8000",
        currentBalance: "599.76",
        dueDate: 15,
        closingDate: 10,
        cardType: "visa",
        color: "#0284c7"
      }
    ];
    creditCards2.forEach((card) => this.createCreditCard(card));
    const now = /* @__PURE__ */ new Date();
    const yesterday = /* @__PURE__ */ new Date();
    yesterday.setDate(now.getDate() - 1);
    const lastWeek = /* @__PURE__ */ new Date();
    lastWeek.setDate(now.getDate() - 7);
    const transactions2 = [
      {
        userId: user.id,
        description: "Mercado P\xE3o de A\xE7\xFAcar",
        amount: 128.47,
        date: now,
        type: "expense",
        category: "Alimenta\xE7\xE3o",
        paymentMethod: "Cart\xE3o de Cr\xE9dito",
        notes: "",
        creditCardId: 1
      },
      {
        userId: user.id,
        description: "iFood",
        amount: 42.9,
        date: yesterday,
        type: "expense",
        category: "Alimenta\xE7\xE3o",
        paymentMethod: "Cart\xE3o de Cr\xE9dito",
        notes: "",
        creditCardId: 1
      },
      {
        userId: user.id,
        description: "Posto Shell",
        amount: 150,
        date: lastWeek,
        type: "expense",
        category: "Transporte",
        paymentMethod: "Cart\xE3o de Cr\xE9dito",
        notes: "",
        creditCardId: 2
      },
      {
        userId: user.id,
        description: "Sal\xE1rio",
        amount: 5250,
        date: lastWeek,
        type: "income",
        category: "Receita",
        paymentMethod: "Transfer\xEAncia",
        notes: "",
        creditCardId: null
      },
      {
        userId: user.id,
        description: "Cinema Shopping",
        amount: 72,
        date: lastWeek,
        type: "expense",
        category: "Lazer",
        paymentMethod: "Cart\xE3o de D\xE9bito",
        notes: "",
        creditCardId: null
      }
    ];
    transactions2.forEach((tx) => this.createTransaction(tx));
    const dueDate1 = /* @__PURE__ */ new Date();
    dueDate1.setDate(now.getDate() + 3);
    const dueDate2 = /* @__PURE__ */ new Date();
    dueDate2.setDate(now.getDate() + 5);
    const dueDate3 = /* @__PURE__ */ new Date();
    dueDate3.setDate(now.getDate() + 7);
    const dueDate4 = /* @__PURE__ */ new Date();
    dueDate4.setDate(now.getDate() + 10);
    const bills2 = [
      {
        userId: user.id,
        description: "Aluguel",
        amount: 1800,
        dueDate: dueDate1,
        paid: false,
        recurring: true,
        category: "Moradia",
        notes: ""
      },
      {
        userId: user.id,
        description: "Energia El\xE9trica",
        amount: 245.78,
        dueDate: dueDate2,
        paid: false,
        recurring: true,
        category: "Moradia",
        notes: ""
      },
      {
        userId: user.id,
        description: "Fatura Cart\xE3o Nubank",
        amount: 1240.56,
        dueDate: dueDate3,
        paid: false,
        recurring: true,
        category: "Cart\xE3o de Cr\xE9dito",
        notes: ""
      },
      {
        userId: user.id,
        description: "Internet",
        amount: 119.9,
        dueDate: dueDate4,
        paid: false,
        recurring: true,
        category: "Moradia",
        notes: ""
      }
    ];
    bills2.forEach((bill) => this.createBill(bill));
    this.updateAccountBalance(user.id, {
      userId: user.id,
      totalBalance: "4628.90",
      monthlyIncome: "5250.00",
      monthlyExpenses: "3187.45",
      creditCardBills: "1840.32"
    });
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Transaction operations
  async getTransactions(userId) {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  async getTransactionsByMonth(userId, year, month) {
    return Array.from(this.transactions.values()).filter((transaction) => {
      const txDate = new Date(transaction.date);
      return transaction.userId === userId && txDate.getFullYear() === year && txDate.getMonth() === month;
    });
  }
  async getRecentTransactions(userId, limit) {
    return Array.from(this.transactions.values()).filter((transaction) => transaction.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  }
  async createTransaction(insertTransaction) {
    const id = this.transactionIdCounter++;
    const transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    await this.updateBalanceAfterTransaction(insertTransaction);
    return transaction;
  }
  async updateTransaction(id, transactionUpdate) {
    const transaction = this.transactions.get(id);
    if (!transaction) return void 0;
    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  async deleteTransaction(id) {
    return this.transactions.delete(id);
  }
  // Category operations
  async getCategories(userId) {
    return Array.from(this.categories.values()).filter(
      (category) => category.userId === userId
    );
  }
  async createCategory(insertCategory) {
    const id = this.categoryIdCounter++;
    const category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  async updateCategory(id, categoryUpdate) {
    const category = this.categories.get(id);
    if (!category) return void 0;
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  async deleteCategory(id) {
    return this.categories.delete(id);
  }
  // Bill operations
  async getBills(userId) {
    return Array.from(this.bills.values()).filter(
      (bill) => bill.userId === userId
    );
  }
  async getUpcomingBills(userId, limit) {
    const now = /* @__PURE__ */ new Date();
    return Array.from(this.bills.values()).filter(
      (bill) => bill.userId === userId && new Date(bill.dueDate) >= now && !bill.paid
    ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, limit);
  }
  async createBill(insertBill) {
    const id = this.billIdCounter++;
    const bill = { ...insertBill, id };
    this.bills.set(id, bill);
    return bill;
  }
  async updateBill(id, billUpdate) {
    const bill = this.bills.get(id);
    if (!bill) return void 0;
    const updatedBill = { ...bill, ...billUpdate };
    this.bills.set(id, updatedBill);
    return updatedBill;
  }
  async deleteBill(id) {
    return this.bills.delete(id);
  }
  // Credit Card operations
  async getCreditCards(userId) {
    return Array.from(this.creditCards.values()).filter(
      (card) => card.userId === userId
    );
  }
  async createCreditCard(insertCreditCard) {
    const id = this.creditCardIdCounter++;
    const creditCard = { ...insertCreditCard, id };
    this.creditCards.set(id, creditCard);
    return creditCard;
  }
  async updateCreditCard(id, creditCardUpdate) {
    const creditCard = this.creditCards.get(id);
    if (!creditCard) return void 0;
    const updatedCreditCard = { ...creditCard, ...creditCardUpdate };
    this.creditCards.set(id, updatedCreditCard);
    return updatedCreditCard;
  }
  async deleteCreditCard(id) {
    return this.creditCards.delete(id);
  }
  // Account Balance operations
  async getAccountBalance(userId) {
    return Array.from(this.accountBalances.values()).find(
      (balance) => balance.userId === userId
    );
  }
  async updateAccountBalance(userId, balanceUpdate) {
    let balance = Array.from(this.accountBalances.values()).find(
      (balance2) => balance2.userId === userId
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
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.accountBalances.set(id, balance);
    }
    const updatedBalance = {
      ...balance,
      ...balanceUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.accountBalances.set(balance.id, updatedBalance);
    return updatedBalance;
  }
  // Helper to update account balance after transactions
  async updateBalanceAfterTransaction(transaction) {
    const balance = await this.getAccountBalance(transaction.userId);
    if (!balance) return;
    let totalBalance = Number(balance.totalBalance);
    let monthlyIncome = Number(balance.monthlyIncome);
    let monthlyExpenses = Number(balance.monthlyExpenses);
    const transactionAmount = Number(transaction.amount);
    if (transaction.type === "income") {
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
  async importTransactions(userId, transactions2) {
    const createdTransactions = [];
    for (const transaction of transactions2) {
      const createdTransaction = await this.createTransaction({
        ...transaction,
        userId
      });
      createdTransactions.push(createdTransaction);
    }
    return createdTransactions;
  }
};
var storage = new MemStorage();

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, date, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  type: text("type").notNull(),
  // 'expense' or 'income'
  category: text("category").notNull(),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  creditCardId: integer("credit_card_id").references(() => creditCards.id),
  receiptImage: text("receipt_image")
  // URL or path to receipt image
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  color: text("color").notNull()
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  paid: boolean("paid").default(false).notNull(),
  recurring: boolean("recurring").default(false).notNull(),
  category: text("category"),
  notes: text("notes")
});
var insertBillSchema = createInsertSchema(bills).omit({
  id: true
});
var creditCards = pgTable("credit_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  lastFourDigits: text("last_four_digits").notNull(),
  limit: numeric("limit", { precision: 10, scale: 2 }).notNull(),
  currentBalance: numeric("current_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  dueDate: integer("due_date").notNull(),
  // Day of month
  closingDate: integer("closing_date").notNull(),
  // Day of month
  cardType: text("card_type"),
  // visa, mastercard, etc
  color: text("color").notNull()
});
var insertCreditCardSchema = createInsertSchema(creditCards).omit({
  id: true
});
var accountBalances = pgTable("account_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalBalance: numeric("total_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  monthlyIncome: numeric("monthly_income", { precision: 10, scale: 2 }).default("0").notNull(),
  monthlyExpenses: numeric("monthly_expenses", { precision: 10, scale: 2 }).default("0").notNull(),
  creditCardBills: numeric("credit_card_bills", { precision: 10, scale: 2 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  deadline: date("deadline"),
  category: text("category"),
  color: text("color").notNull().default("#8b5cf6"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertSavingsGoalSchema = createInsertSchema(savingsGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAccountBalanceSchema = createInsertSchema(accountBalances).omit({
  id: true,
  updatedAt: true
});

// server/routes.ts
import multer from "multer";
import path from "path";
import { parse } from "csv-parse";
import fs from "fs";
var upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Apenas arquivos de planilha s\xE3o permitidos"));
    }
  }
});
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const getUserId = (req) => {
    return 1;
  };
  const handleValidation = (schema, data) => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        throw new Error(validationError.message);
      }
      throw error;
    }
  };
  app2.get("/api/user", async (req, res) => {
    const userId = getUserId(req);
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
    }
    const { password, ...userWithoutPassword } = user;
    const enhancedUser = {
      ...userWithoutPassword,
      username: "joaosilva",
      phone: "+55 11 98765-4321",
      notificationPreferences: {
        whatsapp: true,
        sms: false
      }
    };
    res.json(enhancedUser);
  });
  app2.get("/api/dashboard", async (req, res) => {
    const userId = getUserId(req);
    const balance = await storage.getAccountBalance(userId);
    if (!balance) {
      return res.status(404).json({ message: "Balan\xE7o n\xE3o encontrado" });
    }
    const recentTransactions = await storage.getRecentTransactions(userId, 5);
    const upcomingBills = await storage.getUpcomingBills(userId, 4);
    const creditCards2 = await storage.getCreditCards(userId);
    const transactions2 = await storage.getTransactions(userId);
    const categories2 = await storage.getCategories(userId);
    const now = /* @__PURE__ */ new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyTransactions = transactions2.filter((t) => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && t.type === "expense";
    });
    const expensesByCategory = categories2.map((category) => {
      const total = monthlyTransactions.filter((t) => t.category === category.name).reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        name: category.name,
        value: total,
        color: category.color
      };
    }).filter((c) => c.value > 0);
    const totalExpenses = expensesByCategory.reduce((sum, c) => sum + c.value, 0);
    const expensesCategoryData = expensesByCategory.map((c) => ({
      ...c,
      percentage: totalExpenses > 0 ? Math.round(c.value / totalExpenses * 100) : 0
    }));
    res.json({
      balance,
      recentTransactions,
      upcomingBills,
      creditCards: creditCards2,
      expensesByCategory: expensesCategoryData,
      currentMonth: now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    });
  });
  app2.get("/api/transactions", async (req, res) => {
    const userId = getUserId(req);
    const transactions2 = await storage.getTransactions(userId);
    res.json(transactions2);
  });
  app2.post("/api/transactions", async (req, res) => {
    const userId = getUserId(req);
    try {
      const transaction = handleValidation(insertTransactionSchema, {
        ...req.body,
        userId
      });
      const createdTransaction = await storage.createTransaction(transaction);
      res.status(201).json(createdTransaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/transactions/:id", async (req, res) => {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);
    try {
      const transaction = await storage.updateTransaction(id, {
        ...req.body,
        userId
      });
      if (!transaction) {
        return res.status(404).json({ message: "Transa\xE7\xE3o n\xE3o encontrada" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/transactions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTransaction(id);
    if (!success) {
      return res.status(404).json({ message: "Transa\xE7\xE3o n\xE3o encontrada" });
    }
    res.status(204).send();
  });
  app2.get("/api/categories", async (req, res) => {
    const userId = getUserId(req);
    const categories2 = await storage.getCategories(userId);
    res.json(categories2);
  });
  app2.post("/api/categories", async (req, res) => {
    const userId = getUserId(req);
    try {
      const category = handleValidation(insertCategorySchema, {
        ...req.body,
        userId
      });
      const createdCategory = await storage.createCategory(category);
      res.status(201).json(createdCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/bills", async (req, res) => {
    const userId = getUserId(req);
    const bills2 = await storage.getBills(userId);
    res.json(bills2);
  });
  app2.post("/api/bills", async (req, res) => {
    const userId = getUserId(req);
    try {
      const bill = handleValidation(insertBillSchema, {
        ...req.body,
        userId
      });
      const createdBill = await storage.createBill(bill);
      res.status(201).json(createdBill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/bills/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const bill = await storage.updateBill(id, req.body);
      if (!bill) {
        return res.status(404).json({ message: "Conta n\xE3o encontrada" });
      }
      res.json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/credit-cards", async (req, res) => {
    const userId = getUserId(req);
    const cards = await storage.getCreditCards(userId);
    res.json(cards);
  });
  app2.post("/api/credit-cards", async (req, res) => {
    const userId = getUserId(req);
    try {
      const card = handleValidation(insertCreditCardSchema, {
        ...req.body,
        userId
      });
      const createdCard = await storage.createCreditCard(card);
      res.status(201).json(createdCard);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/credit-cards/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const card = await storage.updateCreditCard(id, req.body);
      if (!card) {
        return res.status(404).json({ message: "Cart\xE3o n\xE3o encontrado" });
      }
      res.json(card);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/import", upload.single("file"), async (req, res) => {
    const userId = getUserId(req);
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }
    const filePath = req.file.path;
    try {
      const transactions2 = [];
      const parser = fs.createReadStream(filePath).pipe(parse({
        columns: true,
        skip_empty_lines: true
      }));
      for await (const record of parser) {
        const transaction = {
          userId,
          description: record.description || record.descricao || "",
          amount: parseFloat(record.amount || record.valor || 0),
          date: new Date(record.date || record.data || /* @__PURE__ */ new Date()),
          type: record.type || record.tipo || "expense",
          category: record.category || record.categoria || "Outros",
          paymentMethod: record.paymentMethod || record.formaPagamento || "",
          notes: record.notes || record.observacoes || "",
          creditCardId: record.creditCardId || record.cartaoId || null
        };
        transactions2.push(transaction);
      }
      const importedTransactions = await storage.importTransactions(userId, transactions2);
      fs.unlinkSync(filePath);
      res.status(201).json({
        message: `${importedTransactions.length} transa\xE7\xF5es importadas com sucesso`,
        count: importedTransactions.length
      });
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(400).json({ message: `Erro ao importar arquivo: ${error.message}` });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  base: "/organizofinanceiro/",
  // ✅ ESSA LINHA É A CHAVE
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared")
    }
  },
  root: __dirname,
  build: {
    outDir: path2.resolve(__dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
