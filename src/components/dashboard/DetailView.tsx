import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut } from 'lucide-react';

interface DetailViewProps {
  motor1Data: any[];
  motor2Data: any[];
  telemetryData: any[];
  detailLogs: any[];
  selectedMotor: 1 | 2;
  setSelectedMotor: (id: 1 | 2) => void;
  setViewMode: (mode: 'grid' | 'detail') => void;
}

export default function DetailView({ 
  motor1Data, 
  motor2Data, 
  telemetryData, 
  detailLogs, 
  selectedMotor, 
  setSelectedMotor, 
  setViewMode 
}: DetailViewProps) {
  const currentData = selectedMotor === 1 ? motor1Data : motor2Data;
  const otherMotor = selectedMotor === 1 ? 2 : 1;

  return (
    <div className="detail-view-container">
      <div className="detail-main-card">
        <div className="detail-header">
          <div className="flex gap-6">
            <div className="legend-item">
              <div className="legend-square bg-red-500" />
              <span className="text-sm text-white">토크</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-cyan-400" />
              <span className="text-sm text-white">속도</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-[#eab308]" />
              <span className="text-sm text-white">온도</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-[#22c55e]" />
              <span className="text-sm text-white">토크</span>
            </div>
          </div>

          <h2 className="detail-title">로봇팔 모터{selectedMotor} 작동현황</h2>

          <div className="flex items-center gap-3">
            <button 
              className="motor-switch-btn"
              onClick={() => setSelectedMotor(otherMotor)}
            >
              모터 {otherMotor}
            </button>
            <button 
              className="exit-btn"
              onClick={() => setViewMode('grid')}
            >
              <LogOut size={24} className="rotate-180" />
            </button>
          </div>
        </div>

        <div className="detail-charts-grid">
          {/* Left Chart: Torque & Speed */}
          <div className="detail-chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tick={{ fill: '#cdd1d9' }} dy={10} />
                <YAxis yAxisId="left" stroke="#ef4444" fontSize={10} domain={[-8, 4]} ticks={[-8, -6, -4, -2, 0, 2, 4]} tick={{ fill: '#ef4444' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#22d3ee" fontSize={10} domain={[-1.2, 1.2]} ticks={[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2]} tick={{ fill: '#22d3ee' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }} />
                <Line yAxisId="left" type="monotone" dataKey="torque" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Right Column: Temp & Torque (Stacked like main dashboard) */}
          <div className="detail-chart-box flex flex-col gap-0">
            {/* Temperature Chart */}
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 10, right: 30, left: 20, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="transparent" 
                    fontSize={10} 
                    tick={{ fill: '#cdd1d9' }} 
                    dy={10}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={10} 
                    ticks={[35, 40, 45]} 
                    tickFormatter={(val) => `${val}°C —`} 
                    domain={[29.8, 46]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#cdd1d9' }}
                    width={60}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }} />
                  {/* Motor Temperature (Yellow) */}
                  <Line 
                    type="monotone" 
                    dataKey={selectedMotor === 1 ? "m1_temp" : "m2_temp"} 
                    stroke="#facc15" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#facc15' }} 
                    isAnimationActive={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Torque Chart */}
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: -10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="transparent" 
                    fontSize={10} 
                    tick={{ fill: '#cdd1d9' }} 
                    dy={10}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={10} 
                    ticks={[15, 30, 50]} 
                    tickFormatter={(val) => `${val} —`} 
                    domain={[4.5, 65]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#cdd1d9' }}
                    width={60}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }} />
                  {/* Motor Torque (Green) */}
                  <Line 
                    type="monotone" 
                    dataKey={selectedMotor === 1 ? "m1_torque" : "m2_torque"} 
                    stroke="#22c55e" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#22c55e' }} 
                    isAnimationActive={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="detail-table-card">
        <h3 className="table-title">로봇팔 모터 상태 상세 목록</h3>
        <div className="table-wrapper">
          <table className="detail-table">
            <thead>
              <tr>
                <th>[모터 ID]</th>
                <th>[상태]</th>
                <th>[토크(Nm)]</th>
                <th>[속도(RPM)]</th>
                <th>[온도(°C)]</th>
                <th>[에러 코드]</th>
                <th>[최근 업데이트]</th>
              </tr>
            </thead>
            <tbody>
              {detailLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.id}</td>
                  <td className={`status-${log.status.toLowerCase()}`}>{log.status}</td>
                  <td className={log.torque > 3 ? 'text-yellow-500' : log.torque < 1 ? 'text-red-500' : ''}>{log.torque}</td>
                  <td>{log.speed}</td>
                  <td>{log.temp}</td>
                  <td className={log.error !== '-' ? 'text-red-500' : ''}>{log.error}</td>
                  <td>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
