import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { Transaction } from '../../core/models/transaction.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [DecimalPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit{

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly customerService = inject(CustomerService)
  currentAccount = signal('')
  accountTransactions = signal<Transaction[]>([])

  ngOnInit(): void {
    this.getCurrentAccount()

  }
  getCurrentAccount(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.currentAccount.set(params.get('accountId') ?? '');
      if (this.currentAccount()) {
        this.getAccountTransactions(this.currentAccount());
      }
    });

  }

  getAccountTransactions(accountId: string): void {
    this.customerService.getAccountTransactions(accountId).subscribe({
      next: (res) => {
        this.accountTransactions.set(res);
        console.log(this.accountTransactions());

      }
    });

  }
  // filters = {
  //   fromDate: '',
  //   toDate: '',
  //   type: '',
  //   category: ''
  // };

  // clearFilters(): void {
  //   this.filters = {
  //     fromDate: '',
  //     toDate: '',
  //     type: '',
  //     category: ''
  //   };
  // }
}
