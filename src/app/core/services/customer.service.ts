import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Customer } from '../models/customer.interface';
import { Account } from '../models/account.interface';
import { Transaction, TransactionType } from '../models/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService{

  private readonly httpClient = inject(HttpClient)

  
  getCustomers(): Observable<Customer[]>{
    return this.httpClient.get<Customer[]>('assets/mock/customers.json')
  }


  getCustomerAccounts(userCif: string): Observable<Account[]> {
    return this.httpClient
      .get<Account[]>('assets/mock/accounts.json')
      .pipe(
        map(accounts =>
          accounts.filter(acc => acc.customerId === userCif)
        )
      );
  }
  getAccountTransactions(accId: string): Observable<Transaction[]> {
    return this.httpClient
      .get<Transaction[]>('assets/mock/transactions.json')
      .pipe(
        map(transactions =>
          transactions.filter(t => t.accountId === accId)
        )
      );
  }

}