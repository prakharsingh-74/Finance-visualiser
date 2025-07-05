'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyExpense } from '@/types/transaction';
import { BarChart3, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface MonthlyChartProps {
  data: MonthlyExpense[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass border border-gray-200 p-4 rounded-xl shadow-xl">
          <p className="font-bold text-gray-900 mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 font-medium capitalize text-sm">
                {entry.dataKey}:
              </span>
              <span className="text-gray-900 font-bold">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const netFlow = totalIncome - totalExpenses;

  return (
    <Card className="w-full glass border border-gray-200 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          Financial Analytics
        </CardTitle>
        <CardDescription className="text-gray-600">
          Overview of your income and expenses over the last 6 months
        </CardDescription>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <div className="group card-hover glass border border-emerald-200 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-emerald-600 font-bold text-sm tracking-wide uppercase">Total Income</span>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-2">
              {formatCurrency(totalIncome)}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-shimmer"></div>
            </div>
          </div>
          
          <div className="group card-hover glass border border-red-200 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <span className="text-red-600 font-bold text-sm tracking-wide uppercase">Total Expenses</span>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-2">
              {formatCurrency(totalExpenses)}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          
          <div className={`group card-hover glass p-4 rounded-xl ${
            netFlow >= 0 
              ? 'border-blue-200' 
              : 'border-amber-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
                netFlow >= 0 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-amber-500 to-amber-600'
              }`}>
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-sm tracking-wide uppercase ${
                netFlow >= 0 
                  ? 'text-blue-600' 
                  : 'text-amber-600'
              }`}>
                Net Flow
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-2">
              {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full animate-shimmer ${
                netFlow >= 0 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-600'
              }`} style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                className="text-sm"
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                tickFormatter={formatCurrency}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="income" 
                fill="url(#incomeGradient)"
                name="Income"
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              <Bar 
                dataKey="expenses" 
                fill="url(#expenseGradient)"
                name="Expenses"
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}