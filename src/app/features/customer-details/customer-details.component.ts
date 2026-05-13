import { CustomerService } from './../../core/services/customer.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Account } from '../../core/models/account.interface';

@Component({
  selector: 'app-customer-details',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
})
export class CustomerDetailsComponent implements OnInit{
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly customerService = inject(CustomerService)
  currentCustomer = signal('')
  customerAccounts = signal<Account[]>([])
  
  ngOnInit(): void {
    this.getCurrentUserCif()
    
  }
  getCurrentUserCif(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.currentCustomer.set(params.get('cif') ?? '');
      if (this.currentCustomer()) {
        this.getCustomerAccounts(this.currentCustomer());
      }
    });

  }

  getCustomerAccounts(cif: string): void {
    this.customerService.getCustomerAccounts(cif).subscribe({
      next: (res) => {
        this.customerAccounts.set(res);
        console.log(this.customerAccounts());
        
      }
    });

  }

}
