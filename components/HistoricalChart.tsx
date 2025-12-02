import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HistoryPoint } from '../types';

interface HistoricalChartProps {
  data: HistoryPoint[];
  currentRate: number;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, currentRate }) => {
  // Calculate min and max for better Y-axis scaling
  const minRate = Math.min(...data.map(d => d.rate), currentRate) * 0.99;
  const maxRate = Math.max(...data.map(d => d.rate), currentRate) * 1.01;

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-sm bg-slate-800/30 rounded-lg">
        No historical data available
      </div>
    );
  }

  return (
    <div className="w-full h-64 mt-6">
      <h3 className="text-sm font-medium text-slate-300 mb-4">7-Day Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[minRate, maxRate]} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#3b82f6' }}
            formatter={(value: number) => [value.toFixed(5), 'HKD']}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRate)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
