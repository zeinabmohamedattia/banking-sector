import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TransactionValidators {
    static noFutureDate(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const selectedDate = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today ? { futureDate: true } : null;
    }

    static balanceCheck(currentBalance: number): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const type = group.get('type')?.value;
            const amount = group.get('amount')?.value;

            if (type === 'Debit' && amount > currentBalance) {
                return { insufficientBalance: true };
            }
            return null;
        };
    }
}