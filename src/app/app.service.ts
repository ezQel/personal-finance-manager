import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from './types/category';
import { DayTransactions } from './types/day-transactions';
import { Totals } from './types/totals';
import { Transaction } from './types/transaction';
import { groupBy, reduce } from 'underscore';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  transactions: Transaction[] = [
    {
      amount: 20000,
      date: 1703176019532,
      description: 'Fees',
      id: 1,
      type: 'EXPENSE',
      categoryName: 'Education',
    },
    {
      amount: 200,
      date: 1703276019590,
      description: 'Lunch',
      id: 2,
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 1200000,
      date: 1703176019590,
      description: 'Work',
      id: 12,
      type: 'INCOME',
      categoryName: 'Salary',
    },
    {
      amount: 20000,
      date: 1703176019532,
      description: 'Fees',
      id: 1,
      type: 'EXPENSE',
      categoryName: 'Education',
    },
    {
      amount: 200,
      date: 1703176019590,
      description: 'Supper',
      id: 2,
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 1200000,
      date: 1703176019590,
      description: 'Work',
      id: 12,
      type: 'INCOME',
      categoryName: 'Salary',
    },
    {
      amount: 20000,
      date: 1703176019532,
      description: 'Fees',
      id: 1,
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 200,
      date: 1703176019590,
      description: 'Food',
      id: 2,
      type: 'EXPENSE',
      categoryName: 'Food',
    },
    {
      amount: 1200000,
      date: 1703176019590,
      description: 'Work',
      id: 12,
      type: 'INCOME',
      categoryName: 'Food',
    },
  ];

  constructor() {}

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
