import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MotorChartCardProps {
  title: string;
  data: any[];
  motorId: 1 | 2;
  onDetailClick: (id: 1 | 2) => void;
}

export default function MotorChartCard({ title, data, motorId, onDetailClick }: MotorChartCardProps) {
  return (
    <div className="chart-card flex-1">
      <div className="chart-header">
        <div className="flex items-center gap-4">
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-square bg-red-500" />
              <span>토크</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-cyan-400" />
              <span>속도</span>
            </div>
          </div>
          <span className="chart-title">{title}</span>
        </div>
        <span 
          className="chart-detail-btn"
          onClick={() => onDetailClick(motorId)}
        >
          상세보기
        </span>
      </div>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={true} horizontal={true} />
            <XAxis 
              dataKey="time" 
              stroke="#666" 
              fontSize={10} 
              tick={{ fill: '#cdd1d9' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#ef4444" 
              fontSize={10} 
              domain={[-8, 4]}
              ticks={[-8, -6, -4, -2, 0, 2, 4]}
              tick={{ fill: '#ef4444' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#22d3ee" 
              fontSize={10} 
              domain={[-1.2, 1.2]}
              ticks={[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2]}
              tick={{ fill: '#22d3ee' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="torque" 
              stroke="#ef4444" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="speed" 
              stroke="#22d3ee" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
