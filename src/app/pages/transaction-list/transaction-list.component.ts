import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, map, tap } from 'rxjs';
import { AppService } from '../../app.service';
import { DayTransactionComponent } from '../../components/day-transactions/day-transactions.component';
import { MonthFilterComponent } from '../../components/month-filter/month-filter.component';
import { TransactionAddComponent } from '../../components/transaction-add/transaction-add.component';
import { DayTransactions } from '../../types/day-transactions';
import { Month } from '../../types/month';
import { Transaction } from '../../types/transaction';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, AsyncPipe, MonthFilterComponent, DayTransactionComponent, TransactionAddComponent],
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent implements OnInit {
  days$?: Observable<DayTransactions[]>;
  totalIncome?: number;
  totalExpense?: number;
  balance?: number;

  constructor(private _bottomSheet: MatBottomSheet, private _app: AppService) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(month?: Month): void {
    if (!month) {
      const today = new Date();
      month = { monthIndex: today.getMonth(), year: today.getFullYear() };
    }

    this.days$ = this._app.getTransactions(month).pipe(
      map(this.groupTransactionsByDay),
      tap((days) => {
        this.totalIncome = days.reduce((sum, day) => sum + day.totalIncome, 0);
        this.totalExpense = days.reduce((sum, day) => sum + day.totalExpense, 0);
        this.balance = this.totalIncome - this.totalExpense;
      })
    );
  }

  /**
   * Groups transactions made on the same day together
   * @param transactions A list of all of the month's transactions
   * @returns An array of grouped transactions
   */
  groupTransactionsByDay(transactions: Transaction[]): DayTransactions[] {
    const groups = new Map<string, DayTransactions>();

    transactions.forEach((txn) => {
      const txnIsIncome = txn.type === 'INCOME';

      // Get the group of the transaction's date
      let group = groups.get(txn.date);

      if (group) {
        // If the group exists, append the transaction
        group.transactions.push(txn);

        // Sum up the group's totals
        group.totalIncome += txnIsIncome ? txn.amount : 0;
        group.totalExpense += !txnIsIncome ? txn.amount : 0;
      } else {
        // Create the group
        group = {
          date: txn.date,
          totalIncome: txnIsIncome ? txn.amount : 0,
          totalExpense: !txnIsIncome ? txn.amount : 0,
          transactions: [txn],
        };

        groups.set(txn.date, group);
      }
    });

    return Array.from(groups.values());
  }

  addTransaction(): void {
    this._bottomSheet.open(TransactionAddComponent);
  }
}
