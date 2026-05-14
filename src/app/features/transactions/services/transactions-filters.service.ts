
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable
} from 'rxjs';

import { Transaction } from '../../../core/models/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionStreamService {

  dateSort$ =
    new BehaviorSubject<'newest' | 'oldest' | ''>('');

  amountSort$ =
    new BehaviorSubject<'high' | 'low' | ''>('');

  buildTransactionsStream(
    transactions$: Observable<Transaction[]>,
    filters$: Observable<any>
  ): Observable<Transaction[]> {

    return combineLatest([

      transactions$,

      filters$,

      this.dateSort$,

      this.amountSort$

    ]).pipe(

      map(([transactions, filters, dateSort, amountSort]) => {

        let filtered = transactions.filter(tx => {

          const fromMatch =
            !filters.fromDate ||
            new Date(tx.date) >= new Date(filters.fromDate);

          const toMatch =
            !filters.toDate ||
            new Date(tx.date) <= new Date(filters.toDate);

          const typeMatch =
            !filters.type ||
            tx.type === filters.type;

          const categoryMatch =
            !filters.category ||
            tx.category === filters.category;

          return (
            fromMatch &&
            toMatch &&
            typeMatch &&
            categoryMatch
          );

        });

        // Date Sort
        if (dateSort === 'newest') {

          filtered.sort((a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
          );

        }

        if (dateSort === 'oldest') {

          filtered.sort((a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
          );

        }

        // Amount Sort
        if (amountSort === 'high') {

          filtered.sort((a, b) =>
            b.amount - a.amount
          );

        }

        if (amountSort === 'low') {

          filtered.sort((a, b) =>
            a.amount - b.amount
          );

        }

        return filtered;

      })

    );

  }

}