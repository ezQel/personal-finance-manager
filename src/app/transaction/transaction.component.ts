import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Transaction } from '../types/transaction';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent {
  @Input() transaction?: Transaction;
}
