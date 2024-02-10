import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb-browser';
import find from 'pouchdb-find';
import { Observable, Subject } from 'rxjs';
import { populateDbWithDemoCategories, populateDbWithDemoTransactions } from './demo-data-init';
import { Category } from './types/category';
import { Month } from './types/month';
import { Transaction } from './types/transaction';

PouchDb.plugin(find);

@Injectable({
  providedIn: 'root',
})
export class AppService {
  /**
   * Database where transaction documents will be stored.
   */
  transactionsDb: PouchDB.Database;

  /**
   * Database where category documents will be stored.
   */
  categoriesDb: PouchDB.Database;

  /**
   * Observable subject of transactions for a specific month
   */
  transactions$ = new Subject<Transaction[]>();

  /**
   * Mango query for transactions db
   */
  transactionsQuery?: PouchDB.Find.FindRequest<Transaction> | null;

  constructor() {
    // Initialize databases
    this.transactionsDb = new PouchDb('transactions');
    this.categoriesDb = new PouchDb('categories');

    // Add demo records
    populateDbWithDemoTransactions(this.transactionsDb).then(() => this.fetchTransactions());
    populateDbWithDemoCategories(this.categoriesDb);
  }

  /**
   * Adds a transaction to the pouchDB.
   * @param transaction The transaction to be added.
   * @returns A promise of the PouchDB response.
   */
  async addTransaction(transaction: Transaction): Promise<boolean> {
    try {
      await this.transactionsDb.put(transaction);
    } catch (e) {
      throw new Error('Adding transaction failed');
    }

    this.fetchTransactions(); // Refresh transactions observable
    return true;
  }

  /**
   * Queries transactions within the specified month from the PouchDB.
   * @param month The month for which the trasnactions will be filtered.
   * @returns A promise of a list of transactions.
   */
  getTransactions(month: Month): Observable<Transaction[]> {
    const startDate = new Date(month.year, month.monthIndex, 1);
    const endDate = new Date(month.year, month.monthIndex + 1, 0);
    this.transactionsQuery = {
      selector: { date: { $gte: startDate, $lte: endDate } },
      sort: [{ date: 'desc' }],
    };

    this.fetchTransactions();
    return this.transactions$.asObservable();
  }

  /**
   * Queries transactions from the database and updates the `transactions$` observable
   */
  async fetchTransactions(): Promise<void> {
    if (!this.transactionsQuery) {
      return;
    }

    return this.transactionsDb.find(this.transactionsQuery).then((response) => {
      const transactions = response.docs as Transaction[];
      this.transactions$.next(transactions);
    });
  }

  /**
   * Deletes the specified transaction
   * @param transaction The transaction to be deleted
   */
  async deleteTransaction(transaction: Transaction): Promise<boolean> {
    try {
      await this.transactionsDb.remove(transaction);
    } catch (e) {
      throw new Error('Deleting transaction failed');
    }

    this.fetchTransactions(); // Refresh transactions observable
    return true;
  }

  /**
   * Adds a transaction category to the PouchDB.
   * @param category The category to be added.
   * @returns A promise of the PouchDB response.
   */
  addCategory(category: Category): Promise<PouchDB.Core.Response> {
    return this.categoriesDb.put(category);
  }

  /**
   * Deletes the specified category
   * @param category The category to be deleted
   */
  async deleteCategory(category: Category): Promise<PouchDB.Core.Response> {
    try {
      const isUsedInTransactions = await this.isCategoryUsedInTransactions(category._id);
      if (isUsedInTransactions) {
        throw new Error('Cannot remove! The category is used in transaction(s).');
      }
    } catch (e) {
      throw new Error('An unexpected error occured while deleting the category');
    }

    return this.categoriesDb.remove(category);
  }

  /**
   * Checks if a category has been used in a transaction
   * @param categoryId The id of the category to be checked
   * @returns A promise with a boolean result
   */
  async isCategoryUsedInTransactions(categoryId: string): Promise<boolean> {
    const result = await this.transactionsDb.find({
      selector: {
        'category._id': categoryId,
      },
      fields: ['_id'],
      limit: 1,
    });

    return result.docs.length > 0;
  }

  /**
   * gets a list of transaction categories.
   * @returns A promise of an array of transaction categories.
   */
  async getCategories(): Promise<Category[]> {
    const docs = await this.categoriesDb.allDocs<Category>({ include_docs: true });
    const categories = docs.rows.map((r) => r.doc) as Category[];
    return categories;
  }
}
