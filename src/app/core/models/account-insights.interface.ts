export interface AccountInsights {
    totalCredit: number;
    totalDebit: number;
    netBalance: number;
    highestCategory: string;
    categoryBreakdown: { category: string; amount: number }[];
    
}
