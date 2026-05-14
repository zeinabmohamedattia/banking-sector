import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TransactionValidators } from '../../../../validators/transactions.validator';
import { Account } from '../../../../core/models/account.interface';
 
@Component({
  selector: 'app-create-transaction',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-transaction.component.html'
})
export class CreateTransactionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  accountInfo = signal<Account>(this.config.data.accountInfo);

  categoryOptions = signal<string[]>(this.config.data?.categories || []);
  protected readonly Math = Math;
  transactionForm!: FormGroup;

  ngOnInit() {
    console.log(this.accountInfo());
    
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      amount: [null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100000),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      date: ['', [Validators.required, TransactionValidators.noFutureDate]],
      category: ['', Validators.required],
      merchant: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    }, {
      validators: [TransactionValidators.balanceCheck(this.accountInfo().balance)]
    });
  }
  submit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const newTransaction = {
        ...formValue,
        id: crypto.randomUUID(),
        accountId: this.config.data.accountInfo.id, 
        amount: Number(formValue.amount),
        date: new Date(formValue.date).toISOString()
      };
      this.ref.close(newTransaction);
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }
  cancel() {
    this.ref.close();
  }

 
  hasError(controlName: string, errorName: string) {
    return this.transactionForm.get(controlName)?.hasError(errorName) &&
      this.transactionForm.get(controlName)?.touched;
  }
}
