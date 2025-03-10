import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSchema, 
  insertTransactionSchema, 
  insertCategorySchema, 
  insertBillSchema, 
  insertCreditCardSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { parse } from "csv-parse";
import fs from "fs";

// Setup multer for file upload
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Apenas arquivos de planilha são permitidos"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Middleware to parse user ID
  const getUserId = (req: Request): number => {
    // For demo purposes using a fixed user ID
    // In a real app, this would come from authentication
    return 1;
  };
  
  // Error handler for zod validation
  const handleValidation = <T>(schema: any, data: any): T => {
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
  
  // =========== User Routes ===========
  app.get("/api/user", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    
    // Adicionando dados extras para demonstração
    // Em uma aplicação real, isso viria do banco de dados
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
  
  // =========== Dashboard Routes ===========
  app.get("/api/dashboard", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    
    // Get account balance
    const balance = await storage.getAccountBalance(userId);
    if (!balance) {
      return res.status(404).json({ message: "Balanço não encontrado" });
    }
    
    // Get recent transactions
    const recentTransactions = await storage.getRecentTransactions(userId, 5);
    
    // Get upcoming bills
    const upcomingBills = await storage.getUpcomingBills(userId, 4);
    
    // Get credit cards
    const creditCards = await storage.getCreditCards(userId);
    
    // Calculate expenses by category (for chart)
    const transactions = await storage.getTransactions(userId);
    const categories = await storage.getCategories(userId);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentMonth && 
             txDate.getFullYear() === currentYear &&
             t.type === 'expense';
    });
    
    const expensesByCategory = categories.map(category => {
      const total = monthlyTransactions
        .filter(t => t.category === category.name)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        name: category.name,
        value: total,
        color: category.color
      };
    }).filter(c => c.value > 0);
    
    // Calculate total expenses
    const totalExpenses = expensesByCategory.reduce((sum, c) => sum + c.value, 0);
    
    // Calculate percentages
    const expensesCategoryData = expensesByCategory.map(c => ({
      ...c,
      percentage: totalExpenses > 0 ? Math.round((c.value / totalExpenses) * 100) : 0
    }));
    
    res.json({
      balance,
      recentTransactions,
      upcomingBills,
      creditCards,
      expensesByCategory: expensesCategoryData,
      currentMonth: now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    });
  });
  
  // =========== Transaction Routes ===========
  app.get("/api/transactions", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  });
  
  app.post("/api/transactions", async (req: Request, res: Response) => {
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
  
  app.put("/api/transactions/:id", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);
    
    try {
      const transaction = await storage.updateTransaction(id, {
        ...req.body,
        userId
      });
      
      if (!transaction) {
        return res.status(404).json({ message: "Transação não encontrada" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/transactions/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTransaction(id);
    
    if (!success) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }
    
    res.status(204).send();
  });
  
  // =========== Category Routes ===========
  app.get("/api/categories", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const categories = await storage.getCategories(userId);
    res.json(categories);
  });
  
  app.post("/api/categories", async (req: Request, res: Response) => {
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
  
  // =========== Bill Routes ===========
  app.get("/api/bills", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const bills = await storage.getBills(userId);
    res.json(bills);
  });
  
  app.post("/api/bills", async (req: Request, res: Response) => {
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
  
  app.put("/api/bills/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const bill = await storage.updateBill(id, req.body);
      
      if (!bill) {
        return res.status(404).json({ message: "Conta não encontrada" });
      }
      
      res.json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // =========== Credit Card Routes ===========
  app.get("/api/credit-cards", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const cards = await storage.getCreditCards(userId);
    res.json(cards);
  });
  
  app.post("/api/credit-cards", async (req: Request, res: Response) => {
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
  
  app.put("/api/credit-cards/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const card = await storage.updateCreditCard(id, req.body);
      
      if (!card) {
        return res.status(404).json({ message: "Cartão não encontrado" });
      }
      
      res.json(card);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // =========== Import Routes ===========
  app.post("/api/import", upload.single('file'), async (req: Request, res: Response) => {
    const userId = getUserId(req);
    
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }
    
    const filePath = req.file.path;
    
    try {
      // Parse CSV file
      const transactions: any[] = [];
      
      const parser = fs
        .createReadStream(filePath)
        .pipe(parse({
          columns: true,
          skip_empty_lines: true
        }));
      
      for await (const record of parser) {
        // Convert CSV record to transaction
        const transaction = {
          userId,
          description: record.description || record.descricao || "",
          amount: parseFloat(record.amount || record.valor || 0),
          date: new Date(record.date || record.data || new Date()),
          type: record.type || record.tipo || "expense",
          category: record.category || record.categoria || "Outros",
          paymentMethod: record.paymentMethod || record.formaPagamento || "",
          notes: record.notes || record.observacoes || "",
          creditCardId: record.creditCardId || record.cartaoId || null
        };
        
        transactions.push(transaction);
      }
      
      // Import transactions
      const importedTransactions = await storage.importTransactions(userId, transactions);
      
      // Delete the temporary file
      fs.unlinkSync(filePath);
      
      res.status(201).json({ 
        message: `${importedTransactions.length} transações importadas com sucesso`,
        count: importedTransactions.length
      });
    } catch (error) {
      // Delete the temporary file in case of error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      res.status(400).json({ message: `Erro ao importar arquivo: ${error.message}` });
    }
  });
  
  return httpServer;
}
