import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DayTransactionComponent } from '../../components/day-transactions/day-transactions.component';
import { DayTransactions } from '../../types/day-transactions';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, DayTransactionComponent],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  days: DayTransactions[] = [
    {
      date: '2024-02-05',
      totalIncome: 0,
      totalExpense: 5000,
      transactions: [
        {
          amount: 5000,
          date: '2024-02-05',
          category: {
            _id: '4',
            _rev: '',
            name: 'Fuel',
            type: 'EXPENSE',
          },
          categoryId: '4',
          type: 'EXPENSE',
          note: '',
          _id: '1707134501715',
          _rev: '',
        },
      ],
    },
    {
      date: '2024-02-04',
      totalIncome: 254000,
      totalExpense: 20000,
      transactions: [
        {
          amount: 20000,
          date: '2024-02-04',
          category: {
            _id: '5',
            _rev: '',
            name: 'Shopping',
            type: 'EXPENSE',
          },
          categoryId: '5',
          type: 'EXPENSE',
          note: '',
          _rev: '',
          _id: '1707134501715',
        },
        {
          amount: 254000,
          date: '2024-02-04',
          category: {
            _id: '1',
            _rev: '',
            name: 'Salary',
            type: 'INCOME',
          },
          categoryId: '1',
          type: 'INCOME',
          note: '',
          _rev: '',
          _id: '1707134501716',
        },
      ],
    },
  ];
}
