import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TelemetryOverviewProps {
  data: any[];
}

export default function TelemetryOverview({ data }: TelemetryOverviewProps) {
  return (
    <div className="chart-card h-full flex flex-col gap-4">
      <div className="chart-header !mb-0 grid grid-cols-3 items-center w-full">
        <div className="chart-legend flex gap-4">
          <div className="legend-item">
            <div className="legend-square bg-red-500" />
            <span>온도</span>
          </div>
          <div className="legend-item">
            <div className="legend-square bg-cyan-400" />
            <span>토크</span>
          </div>
        </div>
        <span className="chart-title text-center text-[#02D6A3] font-bold">ERROR FREQUENCY</span>
        <div className="chart-legend flex gap-4 justify-end">
          <div className="legend-item">
            <div className="legend-square bg-yellow-500" />
            <span>모터1</span>
          </div>
          <div className="legend-item">
            <div className="legend-square bg-green-500" />
            <span>모터2</span>
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
              <XAxis 
                dataKey="time" 
                stroke="transparent" 
                fontSize={10} 
                tick={{ fill: '#cdd1d9' }}
                dy={10}
              />
              <YAxis 
                stroke="#666" 
                fontSize={10} 
                ticks={[35, 40, 45]}
                tickFormatter={(val) => `${val}°C —`}
                domain={[29.5, 46]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#cdd1d9' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }}
                itemStyle={{ fontSize: '12px' }}
              />
              {/* Static Baseline (Red) */}
              <Line 
                type="monotone" 
                dataKey="ref_temp" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#ef4444' }} 
                isAnimationActive={false}
              />
              {/* Motor 1 (Yellow) */}
              <Line 
                type="monotone" 
                dataKey="m1_temp" 
                stroke="#facc15" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#facc15' }} 
                isAnimationActive={false}
              />
              {/* Motor 2 (Green) */}
              <Line 
                type="monotone" 
                dataKey="m2_temp" 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#22c55e' }} 
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Torque Chart */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
              <XAxis 
                dataKey="time" 
                stroke="transparent" 
                fontSize={10} 
                tick={{ fill: '#cdd1d9' }}
                dy={10}
              />
              <YAxis 
                stroke="#666" 
                fontSize={10} 
                ticks={[15, 30, 50]}
                tickFormatter={(val) => `${val} —`}
                domain={[10, 60]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#cdd1d9' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }}
                itemStyle={{ fontSize: '12px' }}
              />
              {/* Static Baseline (Blue) */}
              <Line 
                type="monotone" 
                dataKey="ref_torque" 
                stroke="#22d3ee" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#22d3ee' }} 
                isAnimationActive={false}
              />
              {/* Motor 1 (Yellow) */}
              <Line 
                type="monotone" 
                dataKey="m1_torque" 
                stroke="#facc15" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#facc15' }} 
                isAnimationActive={false}
              />
              {/* Motor 2 (Green) */}
              <Line 
                type="monotone" 
                dataKey="m2_torque" 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#22c55e' }} 
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
