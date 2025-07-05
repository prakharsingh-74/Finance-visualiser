'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';
import { deleteTransaction } from '@/lib/transaction-storage';
import { Edit2, Trash2, Search, TrendingUp, TrendingDown, Calendar, FileText, SortAsc } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredTransactions = transactions
    .filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
    });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const success = deleteTransaction(id);
      if (success) {
        onDelete(id);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  return (
    <Card className="w-full glass border border-gray-200 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText size={20} className="text-white" />
          </div>
          Transaction History
        </CardTitle>
        <CardDescription className="text-gray-600">
          Manage and track all your financial transactions
        </CardDescription>
        
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-ring pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-11"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              onClick={() => setSortBy('date')}
              className={`btn-magnetic flex items-center gap-2 h-11 px-4 rounded-lg font-semibold ${
                sortBy === 'date' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar size={16} />
              Date
            </Button>
            <Button
              variant={sortBy === 'amount' ? 'default' : 'outline'}
              onClick={() => setSortBy('amount')}
              className={`btn-magnetic flex items-center gap-2 h-11 px-4 rounded-lg font-semibold ${
                sortBy === 'amount' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SortAsc size={16} />
              Amount
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 text-xl font-bold mb-2">
              {searchTerm ? 'No matches found' : 'No transactions yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first transaction'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="group card-hover glass border border-gray-200 rounded-xl p-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      transaction.type === 'income' 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-red-500 to-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} className="text-white" />
                      ) : (
                        <TrendingDown size={20} className="text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900 truncate">
                          {transaction.description}
                        </h3>
                        <Badge
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            transaction.type === 'income'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {transaction.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        {format(parseISO(transaction.date), 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-black ${
                      transaction.type === 'income' 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="btn-magnetic h-9 w-9 p-0 bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200 rounded-lg"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="btn-magnetic h-9 w-9 p-0 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}