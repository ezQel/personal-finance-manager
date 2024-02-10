import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { AppService } from '../../app.service';
import { Transaction } from '../../types/transaction';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { TransactionAddComponent } from '../transaction-add/transaction-add.component';

/**
 * Displays all details of a transactions and provides edit/delete actions
 */
@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [MatListModule, DatePipe, DecimalPipe, MatDivider, ErrorMessageComponent],
  templateUrl: './transaction-details.component.html',
})
export class TransactionDetialsComponent {
  deleted = false;
  errorMessage?: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public transaction: Transaction,
    private _bottomSheet: MatBottomSheet,
    private _bottomSheetRef: MatBottomSheetRef,
    private _app: AppService
  ) {}

  editTransaction(): void {
    this._bottomSheet.open(TransactionAddComponent, { data: this.transaction });
    this.closeSheet();
  }

  deleteTransaction(): void {
    this._app
      .deleteTransaction(this.transaction)
      .then(() => {
        this.deleted = true;
        setTimeout(() => {
          this.closeSheet();
        }, 1000);
      })
      .catch(() => {
        this.errorMessage = 'Deleting transaction failed!';
      });
  }

  closeSheet(): void {
    this._bottomSheetRef.dismiss();
  }
}
