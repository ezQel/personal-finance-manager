import { TransactionType } from './transaction-type';

export type Category = {
  _id: string;
  name: string;
  type: TransactionType;
  _rev: string;
};
