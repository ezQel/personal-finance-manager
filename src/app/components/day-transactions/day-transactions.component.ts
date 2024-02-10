import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionComponent } from '../transaction/transaction.component';
import { DayTransactions } from '../../types/day-transactions';

/**
 * Lists transactions for a day in the month
 */
@Component({
  selector: 'app-day',
  standalone: true,
  imports: [TransactionComponent],
  templateUrl: './day-transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTransactionComponent {
  @Input() day!: DayTransactions;
  @Input() disabled = false;

  /**
   * Get what day it is in the month. e.g. 'Mon 21'
   */
  get dayName(): string {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    if (today === this.day.date) {
      return 'Today';
    }

    return formatDate(this.day.date, 'EEE dd', 'en');
  }
}
