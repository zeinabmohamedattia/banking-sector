// // dashboard.component.ts

// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { NgClass } from '@angular/common';
// import { CustomerService } from '../../core/services/customer.service';
// import { RouterLink } from "@angular/router";

// interface Customer {
//   CIF: string;
//   name: string;
//   nationalId: string;
//   segment: string;
//   email: string;
//   phone: string;
// }

// @Component({
//   selector: 'app-dashboard',
//   imports: [RouterLink],
//   templateUrl: './dashboard.component.html',
// })
// export class DashboardComponent implements OnInit {
//   private readonly customerService = inject(CustomerService)

//   readonly customers = signal<Customer[]>([]);

//   readonly searchTerm = signal('');

//   ngOnInit(): void {
//     this.getCustomers();
//   }
//   getCustomers():void {
//     this.customerService.getCustomers().subscribe({
//       next: (response) => {
//         this.customers.set(response);
//         console.log(response);
        
//       },

//       error: (error) => {
//         console.error(error);
//       },
//     })
//   }

//   // readonly filteredCustomers = computed(() => {

//   //   const term = this.searchTerm().toLowerCase();

//   //   return this.customers().filter(customer =>
//   //     customer.name.toLowerCase().includes(term) ||
//   //     customer.CIF.toLowerCase().includes(term)
//   //   );
//   // });

//   readonly priorityCustomersCount = computed(() =>
//     this.customers().filter(customer => customer.segment === 'Priority').length
//   );

//   readonly retailCustomersCount = computed(() =>
//     this.customers().filter(customer => customer.segment === 'Retail').length
//   );

//   // searchCustomer(event: Event): void {

//   //   const input = event.target as HTMLInputElement;

//   //   this.searchTerm.set(input.value);
//   // }

// }
// dashboard.component.ts

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

interface Customer {
  CIF: string;
  name: string;
  nationalId: string;
  segment: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CardModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  readonly customers = signal<Customer[]>([]);

  readonly searchTerm = signal('');

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customers.set(response);
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // readonly filteredCustomers = computed(() => {
  //   const term = this.searchTerm().toLowerCase();
  //   return this.customers().filter(customer =>
  //     customer.name.toLowerCase().includes(term) ||
  //     customer.CIF.toLowerCase().includes(term)
  //   );
  // });

  readonly priorityCustomersCount = computed(() =>
    this.customers().filter(customer => customer.segment === 'Priority').length
  );

  readonly retailCustomersCount = computed(() =>
    this.customers().filter(customer => customer.segment === 'Retail').length
  );

  // searchCustomer(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.searchTerm.set(input.value);
  // }
}