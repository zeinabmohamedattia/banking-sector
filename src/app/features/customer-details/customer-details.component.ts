import { CustomerService } from './../../core/services/customer.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Account } from '../../core/models/account.interface';
import { SkeletonCardComponent } from "../../shared/components/skeleton-card/skeleton-card.component";
import { Customer } from '../../core/models/customer.interface';
import { TransactionsService } from '../../core/services/transactions.service';
import { Transaction } from '../../core/models/transaction.interface';
import { AccountInsights } from '../../core/models/account-insights.interface';
@Component({
  selector: 'app-customer-details',
  imports: [DecimalPipe, RouterLink, SkeletonCardComponent, DatePipe],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
})
export class CustomerDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly customerService = inject(CustomerService)
  public readonly transactionsService = inject(TransactionsService) 
  currentCustomerId = signal('')
  currentCustomer = signal<Customer | undefined>(undefined)
  customerAccounts = signal<Account[]>([])

  allTransactions = this.transactionsService.allTransactions;

  insights = this.transactionsService.globalInsights;

  readonly MINI_STATEMENT_LIMIT = 5;

  lastTransactions = computed(() => {
    return this.allTransactions().slice(0, this.MINI_STATEMENT_LIMIT);
  });

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  totalBalance = computed(() => {
    return this.customerAccounts().reduce((sum, acc) => sum + acc.balance, 0);
  });

  ngOnInit(): void {
    this.getCurrentUserCif()
    this.getCurrentCustomer()
    if (this.transactionsService.allTransactions().length === 0) {
      this.loadAllUserTransactions();
    }
  }

  getCurrentUserCif(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const newCif = params.get('cif') ?? '';

      if (newCif) {
        this.transactionsService.clearState();

        this.currentCustomerId.set(newCif);

        this.getCustomerAccounts(newCif);
        this.getCurrentCustomer();
        this.loadAllUserTransactions(); 
      }
    });
  }
  getCurrentCustomer() {
    this.isLoading.set(true)
    this.errorMessage.set(null)
    this.customerService.getCustomerById(this.currentCustomerId()).subscribe({
      next: (res) => {
        this.currentCustomer.set(res);
        this.isLoading.set(false)
      },
      error: (error) => {
        this.errorMessage.set(error)
        this.isLoading.set(false)
      }
    });
  }

  getCustomerAccounts(cif: string): void {
    this.isLoading.set(true)
    this.errorMessage.set(null)
    this.customerService.getCustomerAccounts(cif).subscribe({
      next: (res) => {
        this.customerAccounts.set(res);
        this.isLoading.set(false)
      },
      error: (error) => {
        this.errorMessage.set(error)
        this.isLoading.set(false)
      }
    });
  }

  loadAllUserTransactions() {
    this.transactionsService.getAllUserTransactions(this.currentCustomerId()).subscribe({
      next: (data) => {
        this.transactionsService.setAllTransactions(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}