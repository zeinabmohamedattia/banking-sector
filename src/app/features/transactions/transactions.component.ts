
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Transaction, TransactionCategory, TransactionType } from '../../core/models/transaction.interface';
import { TransactionsService } from '../../core/services/transactions.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateTransactionComponent } from './components/create-transaction/create-transaction.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CustomerService } from './../../core/services/customer.service';
import { Account } from '../../core/models/account.interface';
import { PaginationHelper } from '../../shared/helpers/pagination.helper';
import { MessageService } from 'primeng/api';
import { SkeletonTableComponent } from "../../shared/components/skeleton-table/skeleton-table.component";

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, DynamicDialogModule,
    SkeletonTableComponent],
  templateUrl: './transactions.component.html',
  providers: [DialogService]
})
export class TransactionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private transactionsService = inject(TransactionsService);
  private customerService = inject(CustomerService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  protected readonly Math = Math;
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ref: DynamicDialogRef | null | undefined;
  currentAccountId = signal('');
  allTransactions = signal<Transaction[]>([]);
  currentAccount = signal<Account | undefined>(undefined);

  filteredTransactions = computed(() => {
    let data = [...this.allTransactions()];
    const f = this.filters();

    if (f.fromDate) data = data.filter(t => new Date(t.date) >= new Date(f.fromDate));
    if (f.toDate) data = data.filter(t => new Date(t.date) <= new Date(f.toDate));
    if (f.type) data = data.filter(t => t.type === f.type);
    if (f.category) data = data.filter(t => t.category === f.category);

    data.sort((a, b) => {
      const isAsc = this.sortDir() === 'asc';
      if (this.sortField() === 'date') {
        return isAsc
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return isAsc ? a.amount - b.amount : b.amount - a.amount;
    });

    return data;
  });
  pagination = new PaginationHelper(this.filteredTransactions)


  currentBalance = signal<number | undefined>(0)
  filters = signal({
    fromDate: '',
    toDate: '',
    type: '' as TransactionType | '',
    category: '' as TransactionCategory | ''
  });

  sortField = signal<'date' | 'amount'>('date');
  sortDir = signal<'asc' | 'desc'>('desc');
  readonly categoryOptions = signal<TransactionCategory[]>([]);

  readonly types = [
    { label: 'Debit', color: 'red' },
    { label: 'Credit', color: 'emerald' }
  ];

  ngOnInit(): void {
    this.getCurrentAccountId()
    this.getTransactionCategories()
    this.getAccountDetails()
  }
  // getCurrentAccountId function
  getCurrentAccountId() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('accountId') ?? '';
      this.currentAccountId.set(id);
      if (id) {
        this.loadTransactions(id);
      }
    });
  }
  getAccountDetails() {
    this.customerService.getAccountById(this.currentAccountId()).subscribe({
      next: (res) => {
        this.currentAccount.set(res)
        this.currentBalance.set(res?.balance)
        console.log(this.currentAccount());

      },
      error: (err) => console.error('Error:', err)
    });
  }

  // getTransactionCategories function
  getTransactionCategories() {
    this.transactionsService.getTransactionCategory().subscribe({
      next: (res) => {
        this.categoryOptions.set(res)
      }
    })
  }
  loadTransactions(id: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.transactionsService.getAccountTransactions(id)
      .subscribe({
        next: (res) => {
          this.allTransactions.set(res)
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err);
          this.isLoading.set(false);
        }
      });
  }

  updateFilters(partial: any) {
    this.filters.update(old => ({ ...old, ...partial }));
    this.pagination.reset();
  }

  setSort(field: 'date' | 'amount') {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('desc');
    }
  }


  exportCsv() {
    const data = this.filteredTransactions();
    const fileName = `transactions_${this.currentAccountId()}`;

    this.transactionsService.exportToCsv(data, fileName);
  }

  showCreateModal() {
    this.ref = this.dialogService.open(CreateTransactionComponent, {
      header: 'New Transaction',
      data: {
        categories: this.categoryOptions(),
        accountInfo: this.currentAccount()
      }
    });

    this.ref?.onClose.subscribe((newTx: any) => {
      if (newTx) {
        try {
          this.persistToLocal(newTx, newTx.accountId);
          this.transactionsService.addTransaction(newTx);
          this.allTransactions.update(list => [newTx, ...list]);

          this.customerService.updateAccountBalance(newTx.accountId, newTx.amount, newTx.type);

          this.currentAccount.update(acc => {
            if (!acc) return acc;
            const amount = Number(newTx.amount);
            const newBalance = newTx.type === 'Credit' ? acc.balance + amount : acc.balance - amount;
            return { ...acc, balance: newBalance };
          });

          this.messageService.add({
            severity: 'success',
            summary: 'Transaction Completed',
            detail: `Successfully added ${newTx.amount} to ${newTx.merchant}`,
            life: 3000
          });

        } catch (e) {
          this.messageService.add({
            severity: 'error',
            summary: 'Transaction Failed',
            detail: 'Something went wrong, please try again.'
          });
        }
      }
    });
  }
  private persistToLocal(tx: any, accountId: string) {
    const cacheKey = `cache_tx_${accountId}`;

    const cachedData = localStorage.getItem(cacheKey);
    let transactions = cachedData ? JSON.parse(cachedData) : [];

    transactions = [tx, ...transactions];

    localStorage.setItem(cacheKey, JSON.stringify(transactions));
  }
}