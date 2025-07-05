import { Transaction, MonthlyExpense } from '@/types/transaction';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export const getMonthlyExpenses = (transactions: Transaction[]): MonthlyExpense[] => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);
  
  const months = eachMonthOfInterval({
    start: startOfMonth(sixMonthsAgo),
    end: endOfMonth(now),
  });
  
  return months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month: format(month, 'MMM yyyy'),
      expenses: Math.abs(expenses),
      income,
    };
  });
};