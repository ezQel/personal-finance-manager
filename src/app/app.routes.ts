import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transaction-list/transaction-list.component').then((c) => c.TransactionListComponent),
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing-page/landing-page.component').then((c) => c.LandingPageComponent),
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];
