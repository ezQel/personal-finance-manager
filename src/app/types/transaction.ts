import { TransactionType } from './transaction-type';

export type Transaction = {
  id: number;
  date: string | number;
  type: TransactionType;
  amount: number;
  description: string;
  categoryName: string;
};
