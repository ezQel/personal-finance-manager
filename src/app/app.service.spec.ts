import { TestBed } from '@angular/core/testing';
import PouchDb from 'pouchdb-browser';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { generateTransaction } from './demo-data-init';
import { Month } from './types/month';
import { Transaction } from './types/transaction';

// Testing data/params
const date = new Date();

const month: Month = {
  monthIndex: date.getMonth(),
  year: date.getFullYear(),
};

describe('MasterService', () => {
  let service: AppService;

  beforeEach(() => {
    service = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should have transactionsDb', () => {
    expect(service.transactionsDb).toBeDefined();
    expect(service.transactionsDb).toBeInstanceOf(PouchDb);
  });

  it('should have categoriesDb', () => {
    expect(service.categoriesDb).toBeDefined();
    expect(service.categoriesDb).toBeInstanceOf(PouchDb);
  });

  it('should have transactions$ observable', () => {
    expect(service.transactions$).toBeDefined();
    expect(service.transactions$).toBeInstanceOf(Observable);
  });

  describe('getTransactions', () => {
    let transactions$: Observable<Transaction[]>;
    let fetchTransactionsSpy: jasmine.Spy;

    beforeEach(() => {
      fetchTransactionsSpy = spyOn(service, 'fetchTransactions');
      transactions$ = service.getTransactions(month);
    });

    it('should set transactionsQuery', () => {
      expect(service.transactionsQuery).toBeDefined();
    });

    it('should return an observable', () => {
      expect(transactions$).toBeInstanceOf(Observable);
    });

    it('should call fetchTransactions', () => {
      expect(fetchTransactionsSpy).toHaveBeenCalled();
    });
  });

  describe('addTransaction', () => {
    let fetchTransactionsSpy: jasmine.Spy;
    let result: boolean | Error;

    beforeEach(async () => {
      const transactionDay = 1;
      const transactionId = String(Date.now());
      const transaction = generateTransaction(transactionDay, transactionId);
      fetchTransactionsSpy = spyOn(service, 'fetchTransactions').and.callThrough();
      result = await service.addTransaction(transaction);
    });

    it('should add a transaction', async () => {
      expect(result).toBeTrue();
    });

    it('should call fetchTransactions', () => {
      expect(fetchTransactionsSpy).toHaveBeenCalled();
    });
  });

  describe('fetchTransactions', () => {
    it('should make an early return if transactionsQuery is not set', async () => {
      const spyOnDb = spyOn(service.transactionsDb, 'find').and.callThrough();
      service.transactionsQuery = null;

      await service.fetchTransactions();

      expect(spyOnDb).not.toHaveBeenCalled();
    });

    it('should fetch transactions and update transactions$', async () => {
      const spyNext = spyOn(service.transactions$, 'next').and.callThrough();
      const spyFind = spyOn(service.transactionsDb, 'find').and.callThrough();

      // Create transactions query
      const startDate = new Date(month.year, month.monthIndex, 1);
      const endDate = new Date(month.year, month.monthIndex + 1, 0);
      service.transactionsQuery = {
        selector: { date: { $gte: startDate, $lte: endDate } },
        sort: [{ date: 'desc' }],
      };

      await service.fetchTransactions();

      expect(spyFind).toHaveBeenCalledWith(service.transactionsQuery);
      expect(spyNext).toHaveBeenCalled();
    });
  });
});
