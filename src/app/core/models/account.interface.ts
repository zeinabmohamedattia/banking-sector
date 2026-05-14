export type AccountType = 'Current' | 'Savings';
export type AccountCurrency = 'EGP' | 'USD' | 'EUR' | 'GBP';

export interface Account {
    id: string;
    customerId: string;
    type: AccountType;
    currency: AccountCurrency;
    balance: number;
    iban: string;
    status: string;
}
