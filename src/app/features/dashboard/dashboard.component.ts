
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';



import { PaginationHelper } from '../../shared/helpers/pagination.helper';
import { SkeletonTableComponent } from "../../shared/components/skeleton-table/skeleton-table.component";
import { Customer } from '../../core/models/customer.interface';



@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    SkeletonTableComponent
],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  readonly customers = signal<Customer[]>([]);
  pagination = new PaginationHelper(this.customers);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  readonly searchTerm = signal('');

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.isLoading.set(true)
    this.customerService.getCustomers()
      .subscribe({
      next: (response) => {
        this.customers.set(response);
        console.log(response);
        this.isLoading.set(false)

      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set(error)
        this.isLoading.set(false)

      },
    });
  }
  protected readonly Math = Math;
  
  readonly priorityCustomersCount = computed(() =>
    this.customers().filter(customer => customer.segment === 'Priority').length
  );

  readonly retailCustomersCount = computed(() =>
    this.customers().filter(customer => customer.segment === 'Retail').length
  );

}