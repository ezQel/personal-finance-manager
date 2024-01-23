import { Transaction } from './transaction';

export type DayTransactions = {
  date: string | number;
  totalIncome: number;
  totalExpense: number;
  transactions: Transaction[];
};
