import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Transaction, TransactionCategory } from '../models/transaction.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly httpClient = inject(HttpClient)

  getAccountTransactions(accId: string): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>('assets/mock/transactions.json').pipe(
      map((transactions: Transaction[]) =>
        transactions.filter(t => t.accountId === accId)
      )
    );
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

    // تنظيف الذاكرة
    URL.revokeObjectURL(url);
  }

}
