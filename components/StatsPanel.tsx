import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';
import { PredictionStats } from '../types';

interface StatsPanelProps {
  stats: PredictionStats[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const data = stats.length > 0 
    ? stats 
    : [
        { modelId: 'M1', time: 0 }, 
        { modelId: 'M2', time: 0 }, 
        { modelId: 'M3', time: 0 }
      ];

  const averageTime = stats.length > 0 
    ? (stats.reduce((acc, curr) => acc + curr.time, 0) / stats.length).toFixed(1)
    : '0';

  return (
    <div className="h-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-gray-500 text-sm font-medium">Inference Speed</h3>
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">{averageTime}</span>
                    <span className="text-sm text-gray-400">sec (avg)</span>
                </div>
            </div>
            <div className="bg-gray-100 p-2 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
            </div>
        </div>
      </div>

      <div className="h-32 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="modelId" hide />
            <Bar dataKey="time" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10B981' : '#E5E7EB'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
         <div className="flex flex-col">
            <span className="text-xs text-gray-400">Success Rate</span>
            <span className="text-sm font-semibold text-gray-900">100%</span>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Total Runs</span>
            <span className="text-sm font-semibold text-gray-900">{stats.length}</span>
         </div>
      </div>
    </div>
  );
};
