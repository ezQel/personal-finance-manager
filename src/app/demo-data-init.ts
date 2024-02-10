import { formatDate } from '@angular/common';
import { Category } from './types/category';
import { Transaction } from './types/transaction';

/**
 * Default categories for demo.
 */
const DEMO_CATEGORIES = [
  {
    _id: '1',
    name: 'Salary',
    type: 'INCOME',
  },
  {
    _id: '2',
    name: 'Dividends',
    type: 'INCOME',
  },
  {
    _id: '3',
    name: 'Allowance',
    type: 'INCOME',
  },
  {
    _id: '4',
    name: 'Fuel',
    type: 'EXPENSE',
  },
  {
    _id: '5',
    name: 'Shopping',
    type: 'EXPENSE',
  },
  {
    _id: '6',
    name: 'Other',
    type: 'EXPENSE',
  },
] as Category[];

/**
 * Generates a transaction for a given day with randomized data
 * @param day The day of the month for which to generate the transaction
 * @param uniqueId A unique id to be assigned to the transaction
 * @returns A transaction with random data
 */
export function generateTransaction(day: number, uniqueId: string): Transaction {
  const amount = Math.floor(Math.random() * 1e5);
  const category: Category = DEMO_CATEGORIES[Math.floor(Math.random() * 6)]; // Get  random category
  const date = new Date();
  date.setDate(day);

  const txn = {
    amount,
    date: formatDate(date, 'yyyy-MM-dd', 'en'),
    category,
    categoryId: category._id,
    type: category.type,
    note: '',
    _id: uniqueId,
  } as Transaction;

  return txn;
}

/**
 * Generates demo transactions from first of current month upto current date
 * @returns A list of demo transactions
 */
export function generateDemoTransactions(): Transaction[] {
  const currentDayOfThemonth = new Date().getDate();
  const txns: Transaction[] = [];

  for (let day = currentDayOfThemonth; day > 0; day--) {
    // Generate random number of transactions for each day
    const numTxns = Math.random() * 4 + 2;
    for (let c = 0; c < numTxns; c++) {
      const uniqueId = `${Date.now() + day + c}`;
      const txn = generateTransaction(day, uniqueId);
      txns.push(txn);
    }
  }

  return txns;
}

/**
 * Populates provided Db with demo categories if the Db is empty
 * @param categoriesDb The categories database
 */
export function populateDbWithDemoCategories(categoriesDb: PouchDB.Database): void {
  categoriesDb.info().then((info) => {
    if (info.doc_count === 0) {
      categoriesDb.bulkDocs(DEMO_CATEGORIES);
    }
  });
}

/**
 * Populates provided Db with generated transactions if the Db is empty
 * @param transactionsDb The transactions database
 */
export async function populateDbWithDemoTransactions(transactionsDb: PouchDB.Database): Promise<boolean> {
  const info = await transactionsDb.info();

  if (info.doc_count === 0) {
    const demoTxns = generateDemoTransactions();
    transactionsDb.createIndex({ index: { fields: ['date', 'category._id'] } });
    await transactionsDb.bulkDocs(demoTxns);
  }

  return true;
}
