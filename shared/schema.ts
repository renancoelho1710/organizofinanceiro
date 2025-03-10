import { pgTable, text, serial, integer, boolean, date, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  type: text("type").notNull(), // 'expense' or 'income'
  category: text("category").notNull(),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  creditCardId: integer("credit_card_id").references(() => creditCards.id),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Bills schema
export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  paid: boolean("paid").default(false).notNull(),
  recurring: boolean("recurring").default(false).notNull(),
  category: text("category"),
  notes: text("notes"),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
});

// Credit Cards schema
export const creditCards = pgTable("credit_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  lastFourDigits: text("last_four_digits").notNull(),
  limit: numeric("limit", { precision: 10, scale: 2 }).notNull(),
  currentBalance: numeric("current_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  dueDate: integer("due_date").notNull(), // Day of month
  closingDate: integer("closing_date").notNull(), // Day of month
  cardType: text("card_type"), // visa, mastercard, etc
  color: text("color").notNull(),
});

export const insertCreditCardSchema = createInsertSchema(creditCards).omit({
  id: true,
});

// Account Balances
export const accountBalances = pgTable("account_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalBalance: numeric("total_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  monthlyIncome: numeric("monthly_income", { precision: 10, scale: 2 }).default("0").notNull(),
  monthlyExpenses: numeric("monthly_expenses", { precision: 10, scale: 2 }).default("0").notNull(),
  creditCardBills: numeric("credit_card_bills", { precision: 10, scale: 2 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAccountBalanceSchema = createInsertSchema(accountBalances).omit({
  id: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;

export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = z.infer<typeof insertCreditCardSchema>;

export type AccountBalance = typeof accountBalances.$inferSelect;
export type InsertAccountBalance = z.infer<typeof insertAccountBalanceSchema>;
