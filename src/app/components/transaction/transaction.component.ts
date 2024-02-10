import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TransactionDetialsComponent } from '../transaction-details/transaction-details.component';
import { Transaction } from '../../types/transaction';

/**
 * Displays brief details of a transaction as a list item
 */
@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './transaction.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent {
  @Input() transaction!: Transaction;
  @Input() disabled = false;

  @HostListener('click') open() {
    this.viewTransaction();
  }

  constructor(private _bottomSheet: MatBottomSheet) {}

  viewTransaction(): void {
    if (this.disabled) return;
    this._bottomSheet.open(TransactionDetialsComponent, { data: this.transaction });
  }
}
