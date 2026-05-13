import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Customer } from '../models/customer.interface';
import { Account } from '../models/account.interface';
import { Transaction } from '../models/transaction.interface';


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
  getAccountById(accountId: string): Observable<Account | undefined> {
    return this.httpClient
      .get<Account[]>('assets/mock/accounts.json')
      .pipe(
        map(accounts =>
          accounts.find(acc => acc.id === accountId)
        )
      );
  }

}