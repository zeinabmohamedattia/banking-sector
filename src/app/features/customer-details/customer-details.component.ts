import { CustomerService } from './../../core/services/customer.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Account } from '../../core/models/account.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
})
export class CustomerDetailsComponent implements OnInit{
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly customerService = inject(CustomerService)
  currentUser = signal('')
  userAccounts = signal<Account[]>([])
  
  ngOnInit(): void {
    this.getCurrentUserCif()
    
  }
  getCurrentUserCif(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.currentUser.set(params.get('cif') ?? '');
      if (this.currentUser()) {
        this.getUserAccounts(this.currentUser());
      }
    });

  }

  getUserAccounts(cif: string): void {
    this.customerService.getCustomerAccounts(cif).subscribe({
      next: (res) => {
        this.userAccounts.set(res);
        console.log(this.userAccounts());
        
      }
    });

  }

//   getCurrentUserCif() {

//     this.activatedRoute.paramMap.subscribe(params => {
//       this.currentUser.set(params.get('cif') ?? '')
//     });
//   }
//   getUserAccounts() {
//     this.customerService.getCustomerAccounts(this.currentUser).subscribe(() =>{
//       next:(res)=>{
//      this.userAccounts.set(res)
//    }
//  })
//   }
}
