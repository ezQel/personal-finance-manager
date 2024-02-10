import { Category } from './category';
import { TransactionType } from './transaction-type';

export type Transaction = {
  _id: string;
  _rev: string;
  date: string;
  type: TransactionType;
  amount: number;
  note: string;
  categoryId: string;
  category: Category;
};
