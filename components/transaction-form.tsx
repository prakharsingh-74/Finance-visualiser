'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { addTransaction, updateTransaction } from '@/lib/transaction-storage';
import { PlusCircle, Edit3, X, DollarSign } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Transaction) => void;
  onCancel?: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: transaction?.amount.toString() || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    type: transaction?.type || 'expense',
  });

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a transaction type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const amount = formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount));
      
      let result: Transaction;
      
      if (transaction) {
        result = updateTransaction(transaction.id, {
          amount,
          date: formData.date,
          description: formData.description.trim(),
          type: formData.type,
        })!;
      } else {
        result = addTransaction({
          amount,
          date: formData.date,
          description: formData.description.trim(),
          type: formData.type,
        });
      }

      onSubmit(result);
      
      if (!transaction) {
        setFormData({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          type: 'expense',
        });
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto glass border border-gray-200 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-900 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
            transaction 
              ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
              : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
          }`}>
            {transaction ? <Edit3 size={20} className="text-white" /> : <PlusCircle size={20} className="text-white" />}
          </div>
          {transaction ? 'Edit Transaction' : 'New Transaction'}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {transaction ? 'Update your transaction details' : 'Record a new income or expense'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`focus-ring bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-11 ${
                    errors.amount ? 'border-red-400 focus:ring-red-400' : 'focus:ring-emerald-400'
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700 font-semibold">
                Date
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`focus-ring bg-white border-gray-300 text-gray-900 h-11 ${
                    errors.date ? 'border-red-400 focus:ring-red-400' : 'focus:ring-emerald-400'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 font-semibold">
              Transaction Type
            </Label>
            <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => handleInputChange('type', value)}>
              <SelectTrigger className={`focus-ring bg-white border-gray-300 text-gray-900 h-11 ${
                errors.type ? 'border-red-400 focus:ring-red-400' : 'focus:ring-emerald-400'
              }`}>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="income" className="text-gray-900 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    Income
                  </div>
                </SelectItem>
                <SelectItem value="expense" className="text-gray-900 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Expense
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-semibold">
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Enter transaction description..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`focus-ring bg-white border-gray-300 text-gray-900 placeholder-gray-400 min-h-[80px] resize-none ${
                  errors.description ? 'border-red-400 focus:ring-red-400' : 'focus:ring-emerald-400'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-magnetic flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg border-0"
            >
              {isSubmitting ? 'Saving...' : (transaction ? 'Update Transaction' : 'Add Transaction')}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="btn-magnetic flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl border border-gray-300"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}