// import { Transaction } from './../../core/models/transaction.interface.ts';
// import { Component, inject, OnInit, signal, computed } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CustomerService } from '../../core/services/customer.service';
// import { Transaction } from '../../core/models/transaction.interface';
// import { DecimalPipe } from '@angular/common';

// @Component({
//   selector: 'app-transactions',
//   imports: [DecimalPipe],
//   templateUrl: './transactions.component.html',
//   styleUrl: './transactions.component.css',
// })
// export class TransactionsComponent implements OnInit {

//   private readonly route = inject(ActivatedRoute);
//   private readonly service = inject(CustomerService);

//   // account
//   currentAccountId = signal('');

//   // raw data
//   transactions = signal<Transaction[]>([]);

//   // filters
//   filters = signal({
//     fromDate: '',
//     toDate: '',
//     type: '',
//     category: ''
//   });

//   // sort state
//   sort = signal<'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc'>('dateDesc');

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       const id = params.get('accountId') ?? '';
//       this.currentAccountId.set(id);

//       if (id) {
//         this.service.getAccountTransactions(id).subscribe(res => {
//           this.transactions.set(res);
//         });
//       }
//     });
//   }

//   updateFilters(partial: Partial<{ fromDate: string; toDate: string; type: string; category: string }>) {
//     this.filters.update(f => ({
//       ...f,
//       ...partial
//     }));
//   }

//   // setSort(value: 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc') {
//   //   this.sort.set(value);
//   // }
//   toggleSort(field: 'date' | 'amount') {

//     const current = this.sort();

//     if (field === 'date') {
//       this.sort.set(current === 'dateDesc' ? 'dateAsc' : 'dateDesc');
//     }

//     if (field === 'amount') {
//       this.sort.set(current === 'amountDesc' ? 'amountAsc' : 'amountDesc');
//     }

//   }

//   // FINAL STREAM (computed)
//   filteredTransactions = computed(() => {

//     let result = [...this.transactions()];
//     const f = this.filters();
//     const sort = this.sort();

//     // FILTERS
//     if (f.fromDate) {
//       result = result.filter(t =>
//         new Date(t.date) >= new Date(f.fromDate)
//       );
//     }

//     if (f.toDate) {
//       result = result.filter(t =>
//         new Date(t.date) <= new Date(f.toDate)
//       );
//     }

//     if (f.type) {
//       result = result.filter(t => t.type === f.type);
//     }

//     if (f.category) {
//       result = result.filter(t => t.category === f.category);
//     }

//     // SORTING
//     switch (sort) {

//       case 'dateDesc':
//         result.sort((a, b) =>
//           +new Date(b.date) - +new Date(a.date)
//         );
//         break;

//       case 'dateAsc':
//         result.sort((a, b) =>
//           +new Date(a.date) - +new Date(b.date)
//         );
//         break;

//       case 'amountDesc':
//         result.sort((a, b) => b.amount - a.amount);
//         break;

//       case 'amountAsc':
//         result.sort((a, b) => a.amount - b.amount);
//         break;
//     }

//     return result;
//   });
// }
// import { Component, inject, OnInit, signal, computed } from '@angular/core';
// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { CustomerService } from '../../core/services/customer.service';
// import { DecimalPipe } from '@angular/common';
// import { CommonModule } from '@angular/common';


// import { Transaction } from '../../core/models/transaction.interface';
// import { TransactionsService } from '../../core/services/transactions.service';
// import { CreateTransactionComponent } from "./components/create-transaction/create-transaction.component";

// import { TransactionCategory } from '../../core/models/TransactionCategory.type';
// @Component({
//   selector: 'app-transactions',
//   imports: [DecimalPipe, CommonModule, CreateTransactionComponent],
//   templateUrl: './transactions.component.html',
//   styleUrl: './transactions.component.css',
// })
// export class TransactionsComponent implements OnInit {

//   private readonly route = inject(ActivatedRoute);
//   private readonly service = inject(CustomerService);
//   private readonly transactionsService = inject(TransactionsService);

//   // ======================
//   // STATE
//   // ======================

//   currentAccountId = signal ('');

//   transactions = signal<Transaction[]>([]);

//   filters = signal({
//     fromDate: '',
//     toDate: '',
//     type: '',
//     category: ''
//   });
//   // transactionTest = signal<TransactionCategory>('Groceries')
//   transactionCategories = [
//     {
//       label: 'Groceries',
//       activeClass: 'bg-emerald-100 text-emerald-700'
//     },
//     {
//       label: 'Bills',
//       activeClass: 'bg-red-100 text-red-700'
//     },
//     {
//       label: 'Shopping',
//       activeClass: 'bg-indigo-100 text-indigo-700'
//     },
//     {
//       label: 'Transfer',
//       activeClass: 'bg-blue-100 text-blue-700'
//     },
//     {
//       label: 'Income',
//       activeClass: 'bg-green-100 text-green-700'
//     },
//     {
//       label: 'Fees',
//       activeClass: 'bg-orange-100 text-orange-700'
//     },
//     {
//       label: 'Entertainment',
//       activeClass: 'bg-pink-100 text-pink-700'
//     }
//   ];
//   transactionTypes = [
//     {
//       label: 'Debit',
//       color: 'red'
//     },
//     {
//       label: 'Credit',
//       color: 'emerald'
//     }
//   ];
//   // ======================
//   // SORT STATE (IMPROVED)
//   // ======================




//   sortField = signal<'date' | 'amount'>('date');
//   sortDir = signal<'asc' | 'desc'>('desc');

//   // ======================
//   // INIT
//   // ======================

//   ngOnInit(): void {

//     this.route.paramMap.subscribe(params => {
//       const id = params.get('accountId') ?? '';
//       this.currentAccountId.set(id);

//       if (!id) return;

//       this.transactionsService.getAccountTransactions(id).subscribe(res => {
//         this.transactions.set(res);
//       });
//     });

//   }

//   // ======================
//   // FILTERS
//   // ======================

//   updateFilters(
//     partial: Partial<{
//       fromDate: string;
//       toDate: string;
//       type: string;
//       category: string;
//     }>
//   ) {
//     this.filters.update(f => ({
//       ...f,
//       ...partial
//     }));
//   }

//   // ======================
//   // SORTING
//   // ======================

//   setSort(field: 'date' | 'amount') {

//     if (this.sortField() === field) {
//       this.sortDir.set(
//         this.sortDir() === 'asc' ? 'desc' : 'asc'
//       );
//     } else {
//       this.sortField.set(field);
//       this.sortDir.set('desc');
//     }

//   }

//   // ======================
//   // COMPUTED DATA PIPELINE
//   // ======================

//   filteredTransactions = computed(() => {

//     let result = [...this.transactions()];
//     const f = this.filters();
//     const field = this.sortField();
//     const dir = this.sortDir();

//     // ======================
//     // FILTERING
//     // ======================

//     if (f.fromDate) {
//       const from = new Date(f.fromDate);
//       result = result.filter(t =>
//         new Date(t.date) >= from
//       );
//     }

//     if (f.toDate) {
//       const to = new Date(f.toDate);
//       result = result.filter(t =>
//         new Date(t.date) <= to
//       );
//     }

//     if (f.type) {
//       result = result.filter(t => t.type === f.type);
//     }

//     if (f.category) {
//       result = result.filter(t => t.category === f.category);
//     }

//     // ======================
//     // SORTING (CLEAN)
//     // ======================

//     result.sort((a, b) => {

//       if (field === 'date') {
//         const diff =
//           new Date(a.date).getTime() -
//           new Date(b.date).getTime();

//         return dir === 'asc' ? diff : -diff;
//       }

//       if (field === 'amount') {
//         const diff = a.amount - b.amount;
//         return dir === 'asc' ? diff : -diff;
//       }

//       return 0;
//     });

//     return result;
//   });

// }

// import { Component, inject, signal, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { toSignal } from '@angular/core/rxjs-interop';

// import { map, switchMap, filter } from 'rxjs';
// import { TransactionsService } from '../../core/services/transactions.service';
// import { Transaction, TransactionCategory, TransactionType } from '../../core/models/transaction.interface';

// @Component({
//   selector: 'app-transactions',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './transactions.component.html'
// })
// export class TransactionsComponent {
//   private readonly route = inject(ActivatedRoute);
//   private readonly transactionsService = inject(TransactionsService);

//   // --- State Signals ---
//   // نحول الـ accountId لـ signal مراقب تلقائياً
//   accountId = toSignal(this.route.paramMap.pipe(map(p => p.get('accountId') ?? '')));

//   // تحميل البيانات عند تغير الـ accountId
//   private transactions$ = this.route.paramMap.pipe(
//     map(p => p.get('accountId')),
//     filter((id): id is string => !!id),
//     switchMap(id => this.transactionsService.getAccountTransactions(id))
//   );

//   allTransactions = toSignal(this.transactions$, { initialValue: [] as Transaction[] });

//   // الفلاتر
//   filters = signal({
//     fromDate: '',
//     toDate: '',
//     type: '' as TransactionType | '',
//     category: '' as TransactionCategory | ''
//   });

//   sortField = signal<'date' | 'amount'>('date');
//   sortDir = signal<'asc' | 'desc'>('desc');

//   // --- Static Data ---
//   readonly categories: { label: TransactionCategory; class: string }[] = [
//     { label: 'Groceries', class: 'bg-emerald-100 text-emerald-700' },
//     { label: 'Bills', class: 'bg-red-100 text-red-700' },
//     { label: 'Shopping', class: 'bg-indigo-100 text-indigo-700' },
//     { label: 'Transfer', class: 'bg-blue-100 text-blue-700' },
//     { label: 'Income', class: 'bg-green-100 text-green-700' },
//     { label: 'Fees', class: 'bg-orange-100 text-orange-700' },
//     { label: 'Entertainment', class: 'bg-pink-100 text-pink-700' }
//   ];

//   readonly types = [
//     { label: 'Debit', colorClass: 'text-red-600' },
//     { label: 'Credit', colorClass: 'text-emerald-600' }
//   ];

//   // --- Computed Pipeline (The Magic) ---
//   filteredTransactions = computed(() => {
//     let data = [...this.allTransactions()];
//     const { fromDate, toDate, type, category } = this.filters();
//     const field = this.sortField();
//     const dir = this.sortDir();

//     // 1. Filtering
//     if (fromDate) data = data.filter(t => new Date(t.date) >= new Date(fromDate));
//     if (toDate) data = data.filter(t => new Date(t.date) <= new Date(toDate));
//     if (type) data = data.filter(t => t.type === type);
//     if (category) data = data.filter(t => t.category === category);

//     // 2. Sorting
//     return data.sort((a, b) => {
//       const valA = field === 'date' ? new Date(a.date).getTime() : a.amount;
//       const valB = field === 'date' ? new Date(b.date).getTime() : b.amount;
//       return dir === 'asc' ? valA - valB : valB - valA;
//     });
//   });

//   // --- Methods ---
//   updateFilters(partial: Partial<ReturnType<typeof this.filters>>) {
//     this.filters.update(f => ({ ...f, ...partial }));
//   }

//   toggleSort(field: 'date' | 'amount') {
//     if (this.sortField() === field) {
//       this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
//     } else {
//       this.sortField.set(field);
//       this.sortDir.set('desc');
//     }
//   }
// }
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

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, DynamicDialogModule],
  templateUrl: './transactions.component.html',
  providers: [DialogService]
})
export class TransactionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private transactionsService = inject(TransactionsService);
  private customerService = inject(CustomerService);
  private dialogService = inject(DialogService);
  // ref!: DynamicDialogRef | undefined;
  ref: DynamicDialogRef | null | undefined;
  // --- الحالة (State) ---
  currentAccountId = signal('');
  allTransactions = signal<Transaction[]>([]);
  currentAccount = signal<any>('');
  currentBalance=signal<number|undefined>(0)
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
    // this.getCurrentCustomerBalance()
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
        console.log(this.currentBalance());
        
      },
      error: (err) => console.error('Error:', err)
    });
  }
  // getCurrentCustomerBalance function
  // getCurrentCustomerBalance() {
  //   this.customerService.getTotalCustomerBalance(this.currentAccountId()).subscribe({
  //     next: (res) => {
  //       this.currentBalance.set(res)
  //       console.log(res);
        
  //     },
  //     error: (err) => console.error('Error:', err)
  //   });
  // }
  // getTransactionCategories function
  getTransactionCategories() {
    this.transactionsService.getTransactionCategory().subscribe({
      next: (res) => {
        this.categoryOptions.set(res)
      }
    })
  }
  loadTransactions(id: string) {
    this.transactionsService.getAccountTransactions(id).subscribe({
      next: (res) => this.allTransactions.set(res),
      error: (err) => console.error('Error:', err)
    });
  }

  updateFilters(partial: Partial<{ fromDate: string, toDate: string, type: any, category: any }>) {
    this.filters.update(old => ({ ...old, ...partial }));
  }

  setSort(field: 'date' | 'amount') {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('desc');
    }
  }

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
  exportCsv() {
    const data = this.filteredTransactions();
    const fileName = `transactions_${this.currentAccountId()}`;

    this.transactionsService.exportToCsv(data, fileName);
  }
  showCreateModal() {
    

    this.ref = this.dialogService.open(CreateTransactionComponent, {
      header: 'New Transaction',
      width: '500px',
      data: {
        balance: this.currentBalance(),
        categories: this.categoryOptions(),
        accountId: this.currentAccountId()
      }
    });

    this.ref?.onClose.subscribe((newTx) => {
      if (newTx) {
        // 4.4. التحديث الفوري في الواجهة
        this.allTransactions.update(txs => [newTx, ...txs]);

        // 3.2 & 3.3 تحديث الرصيد (مثال لو كان الرصيد Signal)
        // if (newTx.type === 'Debit') this.balance.update(b => b - newTx.amount);
        // else this.balance.update(b => b + newTx.amount);
      }
    });
  }
 
}