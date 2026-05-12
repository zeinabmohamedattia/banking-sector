import {  TransactionCategory } from './TransactionCategory.type';
export interface Transaction {
    id: string
    accountId: string
    date: string
    type: string
    amount: number
    merchant: string
    category: TransactionCategory
}

export interface TransactionType { 
    code: string
    label: string
}
