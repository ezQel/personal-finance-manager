import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from '../app.service';
import { Transaction } from '../types/transaction';
import { CategoryAddComponent } from '../category-add/category-add.component';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatChipsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  providers: [MatDatepickerModule],
  templateUrl: './transaction-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionAddComponent {
  errorMessage?: string | null;
  categories$ = this.app.getCategories();
  today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  transactionForm = new FormGroup({
    date: new FormControl(this.today),
    type: new FormControl('EXPENSE'),
    amount: new FormControl(),
    description: new FormControl(),
    categoryId: new FormControl(),
  });

  constructor(
    private dialog: MatDialog,
    private app: AppService,
    public dialogRef: MatDialogRef<TransactionAddComponent>
  ) {}

  addCategory(): void {
    this.dialog.open(CategoryAddComponent);
  }

  saveTransaction(): void {
    const transaction = this.transactionForm.value as Transaction;
    this.app.addTransaction(transaction).subscribe({
      next: this.dialogRef.close,
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
