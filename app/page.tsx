'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { MonthlyChart } from '@/components/monthly-chart';
import { Transaction } from '@/types/transaction';
import { getTransactions } from '@/lib/transaction-storage';
import { getMonthlyExpenses } from '@/lib/chart-utils';
import { Button } from '@/components/ui/button';
import { PlusCircle, DollarSign, Wallet, TrendingUp, BarChart3 } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getTransactions());
  }, []);

  const handleTransactionSubmit = (transaction: Transaction) => {
    if (editingTransaction) {
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? transaction : t)
      );
      setEditingTransaction(null);
    } else {
      setTransactions(prev => [transaction, ...prev]);
    }
    setShowForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setShowForm(false);
  };

  const monthlyExpenses = getMonthlyExpenses(transactions);
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-gray-900">
            <span className="text-gradient">FinanceFlow</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Take control of your finances with intelligent insights and beautiful visualizations
          </p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            <div className="group card-hover glass p-6 rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Total Balance</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{formatCurrency(totalBalance)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-shimmer"></div>
              </div>
            </div>
            
            <div className="group card-hover glass p-6 rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Total Income</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            <div className="group card-hover glass p-6 rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Total Expenses</p>
                  <p className="text-3xl font-black text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-shimmer" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mb-12 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="btn-magnetic bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl border-0"
          >
            <PlusCircle className="w-5 h-5 mr-3" />
            Add New Transaction
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Transaction Form */}
          {showForm && (
            <div className="xl:col-span-1 animate-slide-up">
              <TransactionForm
                transaction={editingTransaction ?? undefined}
                onSubmit={handleTransactionSubmit}
                onCancel={handleCancelEdit}
              />
            </div>
          )}

          {/* Chart */}
          <div className={`${showForm ? 'xl:col-span-2' : 'xl:col-span-3'} animate-slide-up`} style={{ animationDelay: '0.2s' }}>
            <MonthlyChart data={monthlyExpenses} />
          </div>
        </div>

        {/* Transaction List */}
        <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}