
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { Account } from '../models/account.interface';
import { Customer } from '../models/customer.interface';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly ACCOUNTS_KEY = 'bank_accounts';
  private readonly CUSTOMERS_KEY = 'bank_customers';

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    const cached = localStorage.getItem(this.CUSTOMERS_KEY);
    if (cached) return of(JSON.parse(cached));

    return this.httpClient.get<Customer[]>('assets/mock/customers.json').pipe(
      tap(data => localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(data)))
    );
  }
  getCustomerById(customerCif: string): Observable<Customer|undefined> {
    return this.getCustomers().pipe(
      map(customers => customers.find(customer => customer.CIF === customerCif))
    );
  }
  private getAllAccounts(): Observable<Account[]> {
    const cached = localStorage.getItem(this.ACCOUNTS_KEY);

    if (cached) {
      return of(JSON.parse(cached));
    }

    return this.httpClient.get<Account[]>('assets/mock/accounts.json').pipe(
      tap(data => localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(data)))
    );
  }

  getCustomerAccounts(userCif: string): Observable<Account[]> {
    return this.getAllAccounts().pipe(
      map(accounts => accounts.filter(acc => acc.customerId === userCif))
    );
  }

  getAccountById(accountId: string): Observable<Account | undefined> {
    return this.getAllAccounts().pipe(
      map(accounts => accounts.find(acc => acc.id === accountId))
    );
  }

  updateAccountBalance(accountId: string, amount: number, type: 'Debit' | 'Credit') {
    const accounts = JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY) || '[]');
    const index = accounts.findIndex((a: any) => a.id === accountId);

    if (index !== -1) {
      if (type === 'Credit') {
        accounts[index].balance += amount;
      } else {
        accounts[index].balance -= amount;
      }
      localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  }
}