import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from './types/category';
import { DayTransactions } from './types/day-transactions';
import { Totals } from './types/totals';
import { Transaction } from './types/transaction';
import { groupBy, reduce } from 'underscore';
import { formatDate } from '@angular/common';
import PouchDb from 'pouchdb-browser';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  db: PouchDB.Database;

  transactions: Transaction[] = [
    {
      amount: 20000,
      date: 1703176019532,
      description: 'Fees',
      _id: '1',
      type: 'EXPENSE',
      categoryName: 'Education',
    },
    {
      amount: 200,
      date: 1718276019590,
      description: 'Lunch',
      _id: '2',
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 1200000,
      date: 1703176019590,
      description: 'Work',
      _id: '12',
      type: 'INCOME',
      categoryName: 'Salary',
    },
    {
      amount: 20000,
      date: 1706001607906,
      description: 'Fees',
      _id: '3',
      type: 'EXPENSE',
      categoryName: 'Education',
    },
    {
      amount: 200,
      date: 1706001607906,
      description: 'Supper',
      _id: '4',
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 1200000,
      date: 1703176019590,
      description: 'Work',
      _id: '5',
      type: 'INCOME',
      categoryName: 'Salary',
    },
    {
      amount: 20000,
      date: 1703176019532,
      description: 'Fees',
      _id: '6',
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 200,
      date: 1703176019590,
      description: 'Food',
      _id: '7',
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 1200000,
      date: 1709176019590,
      description: 'Work',
      _id: '8',
      type: 'INCOME',
      categoryName: 'Food',
    },
  ];

  constructor() {
    this.db = new PouchDb('transactions');
  }

  addTransaction(transaction: Transaction): Observable<unknown> {
    return of();
  }

  getTransactions(): Observable<unknown> {
    return of();
  }

  getDayTransactions(): Observable<DayTransactions[]> {
    const grouped = groupBy(this.transactions, (txn) =>
      formatDate(txn.date, 'yyyy-MM-dd', 'en')
    );

    const transactions: DayTransactions[] = Object.entries(grouped).map(
      ([date, transactions]) => {
        const { totalIncome, totalExpense } = reduce(
          transactions,
          (totals, txn) => {
            if (txn.type === 'EXPENSE') {
              totals.totalExpense += txn.amount;
              return totals;
            }

            totals.totalIncome += txn.amount;
            return totals;
          },
          { totalIncome: 0, totalExpense: 0 }
        );
        return {
          date,
          transactions,
          totalIncome,
          totalExpense,
        };
      }
    );

    console.log(transactions);
    return of(transactions);
  }

  getTotals(): Observable<Totals> {
    return of({ balance: 200000, totalExpense: 233400, totalIncome: 540000 });
  }

  addCategory(category: Category): Observable<unknown> {
    return of();
  }

  getCategories(): Observable<Category[]> {
    const categories: Category[] = [
      {
        id: 1,
        name: 'Salary',
        type: 'EXPENSE',
      },
      {
        id: 2,
        name: 'Food',
        type: 'INCOME',
      },
    ];
    return of(categories);
  }
}
