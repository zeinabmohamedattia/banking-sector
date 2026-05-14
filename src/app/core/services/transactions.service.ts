
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { Transaction, TransactionCategory } from '../models/transaction.interface';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { AccountInsights } from '../models/account-insights.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly httpClient = inject(HttpClient);
  private readonly customerService = inject(CustomerService);

  private allTransactionsSignal = signal<Transaction[]>([]);
  public allTransactions = this.allTransactionsSignal.asReadonly();

  private currentAccountTransactionsSignal = signal<Transaction[]>([]);
  public currentAccountTransactions = this.currentAccountTransactionsSignal.asReadonly();

  public globalInsights = computed(() => this.calculateGlobalInsights(this.allTransactionsSignal()));
 

  addTransaction(tx: Transaction) {
    this.allTransactionsSignal.update(prev => [tx, ...prev]);
  }

  setAllTransactions(txs: Transaction[]) {
    this.allTransactionsSignal.set(txs);
  }


  getAccountTransactions(id: string): Observable<Transaction[]> {
    const cachedData = localStorage.getItem(`cache_tx_${id}`);
    if (cachedData) {
      return of(JSON.parse(cachedData));
    }
    return this.httpClient.get<Transaction[]>(`assets/mock/transactions.json`).pipe(
      map(txs => txs.filter(t => t.accountId === id)),
      tap(filteredTxs => {
        localStorage.setItem(`cache_tx_${id}`, JSON.stringify(filteredTxs));
      })
    );
  }
  getAllSystemTransaction(): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>('assets/mock/transaction.json')
  }

  getTransactionCategory(): Observable<TransactionCategory[]> {
    return this.httpClient.get<TransactionCategory[]>('assets/mock/transaction-categories.json')
  }

  exportToCsv(transactions: Transaction[], filename: string): void {
    if (!transactions || transactions.length === 0) return;

    const headers = 'ID,Date,Type,Merchant,Category,Amount\n';

    const rows = transactions.map(t =>
      `${t.id},${t.date},${t.type},"${t.merchant}",${t.category},${t.amount}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  
  getAllUserTransactions(userCif: string): Observable<Transaction[]> {
    return this.customerService.getCustomerAccounts(userCif).pipe(
      switchMap(accounts => {
        const accountIds = accounts.map(acc => acc.id);

        let allCachedTransactions: Transaction[] = [];
        let hasCache = false;

        accountIds.forEach(id => {
          const cached = localStorage.getItem(`cache_tx_${id}`);
          if (cached) {
            allCachedTransactions = [...allCachedTransactions, ...JSON.parse(cached)];
            hasCache = true;
          }
        });

        if (hasCache) {
          const sortedCache = allCachedTransactions.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.allTransactionsSignal.set(sortedCache);
          return of(sortedCache);
        }

        return this.httpClient.get<Transaction[]>('assets/mock/transactions.json').pipe(
          map(allTransactions => {
            const filtered = allTransactions.filter(tx => accountIds.includes(tx.accountId));

            accountIds.forEach(id => {
              const accTxs = filtered.filter(t => t.accountId === id);
              localStorage.setItem(`cache_tx_${id}`, JSON.stringify(accTxs));
            });

            return filtered;
          }),
          map(filtered => filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),
          tap(txs => this.allTransactionsSignal.set(txs))
        );
      })
    );
  }
  calculateGlobalInsights(transactions: Transaction[]): AccountInsights {
    const txns = transactions || [];
    let totalCredit = 0;
    let totalDebit = 0;
    transactions.forEach(t => {
      if (t.type === 'Credit') {
        totalCredit += t.amount;
      } else {
        totalDebit += t.amount;
      }
    });
    const categoryMap = new Map<string, number>();

    txns
      .filter(t => t.type === 'Debit')
      .forEach(t => {
        categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
      });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalCredit,
      totalDebit,
      netBalance: totalCredit - totalDebit,
      highestCategory: categoryBreakdown[0]?.category ?? '—',
      categoryBreakdown,
    };
  }
 

  clearState() {
    this.allTransactionsSignal.set([]);
    this.currentAccountTransactionsSignal.set([]);
  }
}