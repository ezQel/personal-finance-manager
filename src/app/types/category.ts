import { TransactionType } from "./transaction-type";

export type Category = {
  id: number;
  name: string;
  type: TransactionType;
};
