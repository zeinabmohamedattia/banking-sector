export type TransactionType = 'Debit' | 'Credit';

export type TransactionCategory =
    | 'Groceries'
    | 'Bills'
    | 'Shopping'
    | 'Transfer'
    | 'Income'
    | 'Fees'
    | 'Entertainment'
    | 'Travel'
    | 'Healthcare'
    | 'Education'
    | 'Investments'
    | 'Dining';

export interface Transaction {
    id: string;
    accountId: string;
    date: string;
    type: TransactionType;
    amount: number;
    merchant: string;
    category: TransactionCategory;
}

export interface TransactionTypeOption {
    code: TransactionType;
    label: string;
}

export interface TransactionFilters {
    search: string;
    type: TransactionType | null;
    category: TransactionCategory | null;
    dateFrom: Date | null;
    dateTo: Date | null;
}
