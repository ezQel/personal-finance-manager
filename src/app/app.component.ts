import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { DayTransactionComponent } from './day-transactions/day-transactions.component';
import { MonthFilterComponent } from './month-filter/month-filter.component';
import { SummaryComponent } from './summary/summary.component';
import { TotalsComponent } from './totals/totals.component';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { Totals } from './types/totals';
import { DayTransactions } from './types/day-transactions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    MonthFilterComponent,
    TotalsComponent,
    DayTransactionComponent,
    TransactionAddComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  totals$?: Observable<Totals>;
  days$?: Observable<DayTransactions[]>;

  constructor(private dialog: MatDialog, private app: AppService) {}

  ngOnInit(): void {
    this.getDays();
  }

  getDays(): void {
    this.days$ = this.app.getDayTransactions();
    this.totals$ = this.app.getTotals();
  }

  viewSummary(): void {
    this.dialog.open(SummaryComponent);
  }

  addTransaction(): void {
    const dialogRef = this.dialog.open(TransactionAddComponent);
    dialogRef.afterClosed().subscribe(() => this.getDays());
  }
}
