import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';

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

  const [isTableExpanded, setIsTableExpanded] = useState(false);

  // ✨ 핵심 추가: 차트의 실제 높이를 기억할 공간
  const [lockedChartHeight, setLockedChartHeight] = useState<number | undefined>(undefined);
  const chartRef = useRef<HTMLDivElement>(null);

  // 더보기 버튼을 누를 때 실행되는 마법의 함수
  const toggleTable = () => {
    if (!isTableExpanded && chartRef.current) {
      // 펼치기 직전! 맥북 화면에 딱 맞게 늘어나 있던 차트의 높이를 픽셀 단위로 기억해서 고정합니다.
      setLockedChartHeight(chartRef.current.offsetHeight);
    } else {
      // 다시 접을 때는 고정을 풀어서 화면 크기에 맞게 자동 조절되게 둡니다.
      setLockedChartHeight(undefined);
    }
    setIsTableExpanded(!isTableExpanded);
  };

  const displayedLogs = isTableExpanded ? detailLogs : detailLogs.slice(0, 3);

  return (
    <div className={`flex-1 flex flex-col w-full gap-4 transition-all duration-300 ${isTableExpanded ? 'overflow-y-auto pb-4' : 'overflow-hidden'
      }`}>

      {/* ✨ 차트 영역: 평소엔 화면을 꽉 채우고(flex-1), 펼쳐졌을 땐 아까 기억한 높이 그대로 멈춤! */}
      <div
        ref={chartRef}
        className={`detail-main-card flex flex-col !p-4 ${isTableExpanded ? 'shrink-0' : 'flex-1 min-h-0'
          }`}
        style={{ height: lockedChartHeight ? `${lockedChartHeight}px` : undefined }}
      >
        <div className="detail-header !mb-2 flex justify-between items-center shrink-0">
          <div className="flex gap-6">
            <div className="legend-item">
              <div className="legend-square bg-red-500" />
              <span className="text-xs text-white">토크</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-cyan-400" />
              <span className="text-xs text-white">속도</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-[#eab308]" />
              <span className="text-xs text-white">온도</span>
            </div>
            <div className="legend-item">
              <div className="legend-square bg-[#22c55e]" />
              <span className="text-xs text-white">토크</span>
            </div>
          </div>

          <h2 className="detail-title !text-lg">로봇팔 모터{selectedMotor} 작동현황</h2>

          <div className="flex items-center gap-3">
            <button
              className="motor-switch-btn !py-1 !px-3 !text-xs"
              onClick={() => setSelectedMotor(otherMotor)}
            >
              모터 {otherMotor}
            </button>
            <button
              className="exit-btn"
              onClick={() => setViewMode('grid')}
            >
              <LogOut size={20} className="rotate-180" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
          {/* Left Chart: Torque & Speed */}
          <div className="detail-chart-box flex-1 min-h-0">
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

          {/* Right Column: Temp & Torque */}
          <div className="detail-chart-box flex flex-col gap-0 min-h-0">
            {/* Temperature Chart */}
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 10, right: 30, left: 20, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
                  <XAxis dataKey="time" stroke="transparent" fontSize={10} tick={{ fill: '#cdd1d9' }} dy={10} interval={0} />
                  <YAxis stroke="#666" fontSize={10} ticks={[35, 40, 45]} tickFormatter={(val) => `${val}°C —`} domain={[29.8, 46]} axisLine={false} tickLine={false} tick={{ fill: '#cdd1d9' }} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey={selectedMotor === 1 ? "m1_temp" : "m2_temp"} stroke="#facc15" strokeWidth={4} dot={{ r: 6, fill: '#facc15' }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Torque Chart */}
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: -10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
                  <XAxis dataKey="time" stroke="transparent" fontSize={10} tick={{ fill: '#cdd1d9' }} dy={10} interval={0} />
                  <YAxis stroke="#666" fontSize={10} ticks={[15, 30, 50]} tickFormatter={(val) => `${val} —`} domain={[4.5, 65]} axisLine={false} tickLine={false} tick={{ fill: '#cdd1d9' }} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: '#16171d', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey={selectedMotor === 1 ? "m1_torque" : "m2_torque"} stroke="#22c55e" strokeWidth={4} dot={{ r: 6, fill: '#22c55e' }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 상세 테이블 영역 */}
      <div className="detail-table-card shrink-0 !p-4 transition-all duration-300">
        <h3 className="table-title !text-base !mb-2">로봇팔 모터 상태 상세 목록</h3>
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
              {displayedLogs.map((log, i) => (
                <tr key={i}>
                  <td className="!py-2">{log.id}</td>
                  <td className={`!py-2 status-${log.status.toLowerCase()}`}>{log.status}</td>
                  <td className={`!py-2 ${log.torque > 3 ? 'text-yellow-500' : log.torque < 1 ? 'text-red-500' : ''}`}>{log.torque}</td>
                  <td className="!py-2">{log.speed}</td>
                  <td className="!py-2">{log.temp}</td>
                  <td className={`!py-2 ${log.error !== '-' ? 'text-red-500' : ''}`}>{log.error}</td>
                  <td className="!py-2">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 더보기 / 접기 토글 버튼 */}
        <div className="flex justify-center mt-3">
          <button
            onClick={toggleTable} // ✨ 클릭하면 위에 만든 마법의 함수가 실행됩니다
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {isTableExpanded ? (
              <>접기 <ChevronUp size={14} /></>
            ) : (
              <>더보기 <ChevronDown size={14} /></>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}