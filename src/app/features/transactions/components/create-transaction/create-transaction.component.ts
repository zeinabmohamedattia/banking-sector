// import { Component, inject, OnInit, signal } from '@angular/core';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { TransactionCategory } from '../../../../core/models/transaction.interface';
// import { TransactionsService } from '../../../../core/services/transactions.service';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { TransactionValidators } from '../../../../validators/transactions.validator';
// import { DecimalPipe } from '@angular/common';

// @Component({
//   selector: 'app-create-transaction',
//   imports: [ReactiveFormsModule,DecimalPipe],
//   templateUrl: './create-transaction.component.html',
//   styleUrl: './create-transaction.component.css',
// })
// export class CreateTransactionComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private ref = inject(DynamicDialogRef);
//   private config = inject(DynamicDialogConfig);

//   public transactionsService = inject(TransactionsService);
//   transactionForm!: FormGroup;
//   accountBalance = this.config.data.balance; // الرصيد القادم من المكون الأب
//   categories = this.config.data.categories;

//   targetAccountId = this.config.data.accountId;
//   readonly categoryOptions = signal<TransactionCategory[]>([]);

//   ngOnInit(): void {
//     this.transactionsService.getTransactionCategory().subscribe({
//       next: (res) => {
//         this.categoryOptions.set(res)
//         console.log(this.categoryOptions());
        
//       }
//     })
//     this.transactionForm = this.fb.group({
//       type: ['', Validators.required],
//       amount: [null, [
//         Validators.required,
//         Validators.min(0.01),
//         Validators.max(100000),
//         Validators.pattern(/^\d+(\.\d{1,2})?$/) // 2.2.2. رقمين عشريين بحد أقصى
//       ]],
//       date: ['', [Validators.required, TransactionValidators.noFutureDate]],
//       merchant: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
//       category: ['', Validators.required]
//     }, {
//       validators: [TransactionValidators.balanceCheck(this.accountBalance)]
//     });
//   }
//   confirm() {
//     console.log('Transaction Confirmed for:', this.targetAccountId);

//     this.ref.close(true);
//     console.log('confirmed');
    
//   }
//   submit() {
//     if (this.transactionForm.valid) {
//       const formValue = this.transactionForm.value;
//       const newTransaction = {
//         ...formValue,
//         id: crypto.randomUUID(), // 3.4. توليد ID فريد
//         amount: Number(formValue.amount),
//         date: new Date(formValue.date).toISOString()
//       };

//       // 4.5. Optional: حفظ في localStorage
//       this.persistToLocal(newTransaction);

//       this.ref.close(newTransaction);
//     } else {
//       this.transactionForm.markAllAsTouched();
//     }
//   }
//   private persistToLocal(tx: any) {
//     const existing = JSON.parse(localStorage.getItem('temp_transactions') || '[]');
//     localStorage.setItem('temp_transactions', JSON.stringify([tx, ...existing]));
//   }
//   cancel() {
//     // إغلاق المودال بدون فعل شيء
//     this.ref.close();
//     console.log('canceled')
//   }
// }
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TransactionValidators } from '../../../../validators/transactions.validator';
 
@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-transaction.component.html'
})
export class CreateTransactionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  // البيانات القادمة من المكون الأب
  accountInfo = signal({
    id: this.config.data?.accountId || 'ACC-123456',
    balance: this.config.data?.balance || 5250.00
  });

  categoryOptions = signal<string[]>(this.config.data?.categories || []);

  transactionForm!: FormGroup;

  ngOnInit() {
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
      // 4.2 Cross-field validation: التأكد أن السحب لا يتخطى الرصيد
      validators: [TransactionValidators.balanceCheck(this.accountInfo().balance)]
    });
  }
  submit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const newTransaction = {
        ...formValue,
        id: crypto.randomUUID(), // 3.4. توليد ID فريد
        amount: Number(formValue.amount),
        date: new Date(formValue.date).toISOString()
      };

      // 4.5. Optional: حفظ في localStorage
      this.persistToLocal(newTransaction);

      this.ref.close(newTransaction);
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }
  private persistToLocal(tx: any) {
    const existing = JSON.parse(localStorage.getItem('temp_transactions') || '[]');
    localStorage.setItem('temp_transactions', JSON.stringify([tx, ...existing]));
  }
  confirm() {
    if (this.transactionForm.valid) {
      const result = {
        ...this.transactionForm.value,
        id: crypto.randomUUID(), // 3.4 توليد ID تلقائي
        amount: Number(this.transactionForm.value.amount)
      };
      this.ref.close(result);
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  cancel() {
    this.ref.close();
  }

  // Helper لإظهار رسائل الخطأ
  hasError(controlName: string, errorName: string) {
    return this.transactionForm.get(controlName)?.hasError(errorName) &&
      this.transactionForm.get(controlName)?.touched;
  }
}
