import { TransactionType } from './transaction-type';

export type Transaction = {
  _id: string;
  date: string | number;
  type: TransactionType;
  amount: number;
  description: string;
  categoryName: string;
};
