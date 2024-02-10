import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from '../../app.service';
import { Category } from '../../types/category';
import { Transaction } from '../../types/transaction';
import { CategoriesComponent } from '../categories/categories.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

/**
 * Provides a form for adding a transaction
 */
@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonToggleModule, MatSelectModule, ErrorMessageComponent],
  providers: [MatDatepickerModule],
  templateUrl: './transaction-add.component.html',
})
export class TransactionAddComponent implements OnInit {
  errorMessage?: string | null;
  categories?: Category[];
  today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  saving = false;

  transactionForm = new FormGroup({
    date: new FormControl(this.today),
    type: new FormControl('EXPENSE'),
    amount: new FormControl(),
    note: new FormControl(),
    categoryId: new FormControl(),
    category: new FormControl(),
    _id: new FormControl(),
    _rev: new FormControl(),
  });

  constructor(
    private _dialog: MatDialog,
    private _app: AppService,
    private _bottomSheetRef: MatBottomSheetRef<TransactionAddComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private _transaction: Transaction
  ) {}

  ngOnInit(): void {
    if (this._transaction) {
      // Fill form with transaction details for editing
      this.transactionForm.patchValue(this._transaction);
    }

    this.getCategories();
    this.transactionForm.get('type')?.valueChanges.subscribe(() => {
      // Clear category whenever transaction type is changed
      this.transactionForm.get('category')?.reset();
    });
  }

  getCategories(): void {
    this._app.getCategories().then((categories) => {
      this.categories = categories;
    });
  }

  addCategory(): void {
    const dialogRef = this._dialog.open(CategoriesComponent, { data: this.transactionForm.get('type')?.value });
    dialogRef.afterClosed().subscribe(() => this.getCategories());
  }

  saveTransaction(): void {
    if (this.transactionForm.invalid) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.saving = true;
    const transaction = this.transactionForm.value;
    transaction.category = <Category>this.categories?.find((cat) => cat._id === transaction.categoryId);

    if (!transaction._id) {
      //Set id for a new transaction, transactions that are being edited will already have an id field.
      transaction._id = String(Date.now());
      delete transaction._rev;
    }

    this._app
      .addTransaction(transaction as Transaction)
      .then(() => {
        this.closeSheet();
      })
      .catch((error) => {
        this.errorMessage = error.message;
        this.saving = false;
      });
  }

  closeSheet(): void {
    this._bottomSheetRef.dismiss();
  }
}
