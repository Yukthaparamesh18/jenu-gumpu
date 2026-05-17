import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import GlassCard from '../common/GlassCard';

const ChartCard = ({ title, data, type = 'bar', dataKey = 'value', xAxisKey = 'name', color = '#D97706' }) => {
  return (
    <GlassCard className="w-full flex flex-col p-4 mb-4">
      <h3 className="text-lg font-heading font-semibold text-secondary dark:text-amber-50 mb-4">
        {title}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color, strokeWidth: 0 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default ChartCard;
