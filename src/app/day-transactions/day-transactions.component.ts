import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DayTransactions } from '../types/day-transactions';
import { TransactionComponent } from '../transaction/transaction.component';

/**
 * List transactions for a certain day in the month
 */
@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, TransactionComponent],
  templateUrl: './day-transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTransactionComponent {
  @Input() day!: DayTransactions;

  get dayName(): string {
    const today = new Date().toLocaleDateString();
    const transactionsDate = new Date(
      this.day.date
    ).toLocaleTimeString();

    if (today === transactionsDate) {
      return 'Today';
    }

    return formatDate(this.day.date, 'EEE dd', 'en');
  }
}
