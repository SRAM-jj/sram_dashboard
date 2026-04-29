import React, { useState, useEffect, useRef } from 'react';
import { LogOut } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import StatusBar from './dashboard/StatusBar';
import MotorChartCard from './dashboard/MotorChartCard';
import TelemetryOverview from './dashboard/TelemetryOverview';
import AIAnalysisCard from './dashboard/AIAnalysisCard';
import DetailView from './dashboard/DetailView';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Mock data for motor 1
const motor1Data = Array.from({ length: 12 }, (_, i) => ({
  time: `${(i * 3).toFixed(1)}s`,
  torque: -2 + Math.sin(i * 0.8) * 4 - (i > 5 ? 2 : 0),
  speed: Math.cos(i * 0.6) * 0.8,
}));

// Mock data for motor 2
const motor2Data = Array.from({ length: 12 }, (_, i) => ({
  time: `${(i * 3).toFixed(1)}s`,
  torque: 1 + Math.cos(i * 0.7) * 3 - (i > 7 ? 3 : 0),
  speed: -Math.sin(i * 0.5) * 0.6,
}));

// Mock data for error frequency / telemetry
const telemetryData = Array.from({ length: 10 }, (_, i) => ({
  time: `오후 01:15:${48 + i * 3}`,
  m1_temp: 30 + Math.random() * 15,
  m2_temp: 25 + Math.random() * 10,
  m1_torque: 20 + Math.random() * 20,
  m2_torque: 10 + Math.random() * 15,
  ref_temp: 30,
  ref_torque: 5,
}));

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [time, setTime] = useState(new Date().toLocaleString('ko-KR'));
  const [motor1Data, setMotor1Data] = useState<any[]>([]);
  const [motor2Data, setMotor2Data] = useState<any[]>([]);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedMotor, setSelectedMotor] = useState<1 | 2>(1);
  const [detailLogs, setDetailLogs] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<'SAFE' | 'WARNING' | 'DANGER' | 'ERROR'>('SAFE');
  const [llmAnalysis, setLlmAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const statusHoldRef = useRef(0);
  const currentTargetStateRef = useRef<'SAFE' | 'WARNING' | 'DANGER' | 'ERROR'>('SAFE');

  // Determine system status based on latest telemetry
  useEffect(() => {
    if (telemetryData.length === 0) return;
    const latest = telemetryData[telemetryData.length - 1];
    const temp = Math.max(latest.m1_temp || 0, latest.m2_temp || 0);
    const torque = Math.max(latest.m1_torque || 0, latest.m2_torque || 0);

    let newStatus: 'SAFE' | 'WARNING' | 'DANGER' | 'ERROR' = 'SAFE';

    if (torque > 50 || temp > 45) {
      newStatus = 'ERROR';
    } else if (torque > 30 || temp > 40) {
      newStatus = 'DANGER';
    } else if (torque > 15 || temp > 35) {
      newStatus = 'WARNING';
    }

    setSystemStatus(newStatus);
  }, [telemetryData]);

  // LLM Analysis trigger
  useEffect(() => {
    if (systemStatus !== 'SAFE' && !llmAnalysis && !isAnalyzing) {
      generateAnalysis();
    } else if (systemStatus === 'SAFE') {
      setLlmAnalysis('');
    }
  }, [systemStatus]);

  const generateAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const latest = telemetryData[telemetryData.length - 1];
      const m1Torque = latest.m1_torque || 0;
      const m1Temp = latest.m1_temp || 0;
      const m2Torque = latest.m2_torque || 0;
      const m2Temp = latest.m2_temp || 0;
      
      let issues = [];
      if (m1Torque > 15 || m1Temp > 35) {
        let m1Issue = "모터 1 (";
        if (m1Torque > 15) m1Issue += `토크: ${m1Torque.toFixed(1)}Nm `;
        if (m1Temp > 35) m1Issue += `온도: ${m1Temp.toFixed(1)}°C`;
        m1Issue += ")";
        issues.push(m1Issue);
      }
      if (m2Torque > 15 || m2Temp > 35) {
        let m2Issue = "모터 2 (";
        if (m2Torque > 15) m2Issue += `토크: ${m2Torque.toFixed(1)}Nm `;
        if (m2Temp > 35) m2Issue += `온도: ${m2Temp.toFixed(1)}°C`;
        m2Issue += ")";
        issues.push(m2Issue);
      }

      const prompt = `
        로봇 제어 시스템에서 상태 이상(${systemStatus})이 감지되었습니다.
        감지된 문제: ${issues.join(", ")}
        
        현재 상세 데이터:
        - 모터 1: 토크 ${m1Torque.toFixed(2)} Nm, 온도 ${m1Temp.toFixed(2)} °C
        - 모터 2: 토크 ${m2Torque.toFixed(2)} Nm, 온도 ${m2Temp.toFixed(2)} °C
        
        임계치 기준:
        - SAFE: 토크 15Nm 이하 & 온도 35°C 이하
        - WARNING: 토크 30Nm 이하 & 온도 40°C 이하
        - DANGER: 토크 30Nm 초과 또는 온도 40°C 초과
        - ERROR: 토크 50Nm 초과 또는 온도 45°C 초과
        
        이 상황에 대해 어떤 모터에 어떤 문제가 있는지 명확히 명시하고, 전문가적인 분석과 권장 조치를 3문장 이내로 작성해줘.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setLlmAnalysis(response.text || '분석 데이터를 가져올 수 없습니다.');
    } catch (error) {
      console.error('LLM Analysis Error:', error);
      setLlmAnalysis('AI 분석 중 오류가 발생했습니다. 하드웨어 매뉴얼을 참조하십시오.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusConfig = () => {
    const latest = telemetryData.length > 0 ? telemetryData[telemetryData.length - 1] : { m1_temp: 0, m2_temp: 0, m1_torque: 0, m2_torque: 0 };
    const maxTemp = Math.max(latest.m1_temp || 0, latest.m2_temp || 0).toFixed(1);
    const maxTorque = Math.max(latest.m1_torque || 0, latest.m2_torque || 0).toFixed(1);

    switch (systemStatus) {
      case 'WARNING':
        return {
          color: '#facc15',
          bg: 'rgba(250, 204, 21, 0.1)',
          border: 'rgba(250, 204, 21, 0.3)',
          mainBg: 'linear-gradient(135deg, #1a1c23 0%, #16171d 50%, #2d2a1a 100%)',
          label: 'WARNING',
          message: 'SYSTEM WARNING: 주의 및 모니터링',
          reason: `원인: 관절 토크가 임계치 부근(현재 ${maxTorque}Nm)에 도달하였으며, 모터 온도가 서서히 상승 중입니다.`,
          action: '권장 조치: 로봇의 이동 속도를 줄이거나 실행 중인 작업을 일시 중지하고 하드웨어 상태를 점검하십시오.'
        };
      case 'DANGER':
        return {
          color: '#d946ef',
          bg: 'rgba(217, 70, 239, 0.1)',
          border: 'rgba(217, 70, 239, 0.3)',
          mainBg: 'linear-gradient(135deg, #1a1c23 0%, #16171d 50%, #2d1a2d 100%)',
          label: 'DANGER',
          message: 'SYSTEM DANGER: 과부하 및 고온 주의',
          reason: `원인: 관절 온도가 40°C를 초과(현재 ${maxTemp}°C)하여 지속적인 운용 시 모터 손상 가능성이 높습니다.`,
          action: '권장 조치: 현재 수행 중인 작업을 일시 중단하거나 작업 속도를 30% 이하로 감축하십시오.'
        };
      case 'ERROR':
        return {
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          mainBg: 'linear-gradient(135deg, #1a1c23 0%, #16171d 50%, #2d1a1a 100%)',
          label: 'ERROR',
          message: 'SYSTEM HALTED: 긴급 정지 명령 전송',
          reason: `원인: 관절 토크가 50Nm를 초과(현재 ${maxTorque}Nm)하여 물리적 충돌 또는 기계적 걸림이 감지되었습니다.`,
          action: '권장 조치: MQTT를 통해 하드웨어 정지 명령이 발송되었습니다. 로봇 주위의 장애물을 제거하고 시스템을 재부팅하십시오.'
        };
      default:
        return {
          color: '#02D6A3',
          bg: 'rgba(2, 214, 163, 0.1)',
          border: 'rgba(2, 214, 163, 0.3)',
          mainBg: 'linear-gradient(135deg, #1a1c23 0%, #16171d 50%, #0d1a17 100%)',
          label: 'SAFE',
          message: 'SYSTEM SAFE: 정상 작동 중',
          reason: '원인: 모든 시스템 파라미터가 정상 범위 내에 있습니다.',
          action: '권장 조치: 현재 작업을 계속 진행하십시오.'
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Initialize data - RUN ONLY ONCE
  useEffect(() => {
    const initialMotor1 = Array.from({ length: 12 }, (_, i) => ({
      time: `${(i * 3).toFixed(1)}s`,
      torque: -2 + Math.sin(i * 0.8) * 4,
      speed: Math.cos(i * 0.6) * 0.8,
    }));
    const initialMotor2 = Array.from({ length: 12 }, (_, i) => ({
      time: `${(i * 3).toFixed(1)}s`,
      torque: 1 + Math.cos(i * 0.7) * 3,
      speed: -Math.sin(i * 0.5) * 0.6,
    }));
    const initialTelemetry = Array.from({ length: 10 }, (_, i) => ({
      time: new Date(Date.now() - (10 - i) * 3000).toLocaleTimeString('ko-KR', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ref_temp: 30,
      ref_torque: 5,
      m1_temp: 32 + (Math.random() - 0.5) * 2,
      m2_temp: 28 + (Math.random() - 0.5) * 2,
      m1_torque: 12 + (Math.random() - 0.5) * 4,
      m2_torque: 6 + (Math.random() - 0.5) * 4,
    }));

    const initialLogs = Array.from({ length: 10 }, (_, i) => ({
      id: 'M1',
      status: 'Safe',
      torque: (10 + Math.random() * 5).toFixed(1),
      speed: Math.floor(200 + Math.random() * 300),
      temp: Math.floor(30 + Math.random() * 5),
      error: '-',
      time: new Date(Date.now() - (10 - i) * 3000).toLocaleTimeString('ko-KR', { hour12: false }),
    }));

    setMotor1Data(initialMotor1);
    setMotor2Data(initialMotor2);
    setTelemetryData(initialTelemetry);
    setDetailLogs(initialLogs);
  }, []); // Run only once on mount

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString('ko-KR'));

      // Update motor data
      setMotor1Data(prev => {
        if (prev.length === 0) return prev;
        const next = [...prev.slice(1)];
        const lastTime = parseFloat(prev[prev.length - 1].time);
        next.push({
          time: `${(lastTime + 3).toFixed(1)}s`,
          torque: -2 + Math.sin(Date.now() / 1000) * 4,
          speed: Math.cos(Date.now() / 1200) * 0.8,
        });
        return next;
      });

      setMotor2Data(prev => {
        if (prev.length === 0) return prev;
        const next = [...prev.slice(1)];
        const lastTime = parseFloat(prev[prev.length - 1].time);
        next.push({
          time: `${(lastTime + 3).toFixed(1)}s`,
          torque: 1 + Math.cos(Date.now() / 1100) * 3,
          speed: -Math.sin(Date.now() / 1300) * 0.6,
        });
        return next;
      });

      // Update telemetry and logs in sync
      const cycleTime = 60;
      const progress = (Date.now() / 1000) % cycleTime;
      let targetState: 'SAFE' | 'WARNING' | 'DANGER' | 'ERROR' = 'SAFE';
      
      if (progress < 20) targetState = 'SAFE';
      else if (progress < 35) targetState = 'WARNING';
      else if (progress < 45) targetState = 'DANGER';
      else targetState = 'ERROR';

      if (targetState !== 'SAFE' && currentTargetStateRef.current === 'SAFE') {
        statusHoldRef.current = 1;
      }

      if (statusHoldRef.current > 0 && targetState === 'SAFE') {
        targetState = currentTargetStateRef.current;
        statusHoldRef.current -= 1;
      } else {
        currentTargetStateRef.current = targetState;
      }

      let baseTemp = 30;
      let baseTorque = 10;
      switch (targetState) {
        case 'SAFE': baseTemp = 32; baseTorque = 12; break;
        case 'WARNING': baseTemp = 37; baseTorque = 22; break;
        case 'DANGER': baseTemp = 42; baseTorque = 35; break;
        case 'ERROR': baseTemp = 47; baseTorque = 55; break;
      }

      const newTelemetryEntry = {
        time: now.toLocaleTimeString('ko-KR', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ref_temp: 30,
        ref_torque: 5,
        m1_temp: baseTemp + (Math.random() - 0.5) * 4,
        m2_temp: baseTemp - 5 + (Math.random() - 0.5) * 4,
        m1_torque: baseTorque + (Math.random() - 0.5) * 6,
        m2_torque: baseTorque - 10 + (Math.random() - 0.5) * 6,
      };

      setTelemetryData(prev => [...prev.slice(1), newTelemetryEntry]);

      setDetailLogs(prev => {
        const torque = selectedMotor === 1 ? newTelemetryEntry.m1_torque : newTelemetryEntry.m2_torque;
        const temp = selectedMotor === 1 ? newTelemetryEntry.m1_temp : newTelemetryEntry.m2_temp;
        
        let status: 'Safe' | 'Warning' | 'Danger' | 'Error' = 'Safe';
        let errorCode = '-';

        if (torque > 50 || temp > 45) {
          status = 'Error';
          errorCode = `E${selectedMotor}03`;
        } else if (torque > 30 || temp > 40) {
          status = 'Danger';
          errorCode = `E${selectedMotor}02`;
        } else if (torque > 15 || temp > 35) {
          status = 'Warning';
          errorCode = `E${selectedMotor}01`;
        }

        const newLogEntry = {
          id: selectedMotor === 1 ? 'M1' : 'M2',
          status: status,
          torque: torque.toFixed(1),
          speed: Math.floor(200 + Math.random() * 300),
          temp: Math.floor(temp),
          error: errorCode,
          time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
        };

        // Put newest at the beginning, keep last 9
        return [newLogEntry, ...prev.slice(0, 9)];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedMotor]);

  return (
    <div className="dashboard-container" style={{ background: statusConfig.mainBg, overflowY: 'auto' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="logo !text-3xl !mb-0 !text-left" style={{ textShadow: 'none' }}>
          S.R<span className="highlight">A</span>M
        </h1>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <StatusBar time={time} statusConfig={statusConfig} />

      {/* Main Content */}
      {viewMode === 'grid' ? (
        <div className="grid-layout">
          {/* Left Column: Motor Status */}
          <div className="flex flex-col gap-5">
            <MotorChartCard 
              title="로봇팔 모터1 작동현황" 
              data={motor1Data} 
              motorId={1} 
              onDetailClick={(id) => { setSelectedMotor(id); setViewMode('detail'); }} 
            />
            <MotorChartCard 
              title="로봇팔 모터2 작동현황" 
              data={motor2Data} 
              motorId={2} 
              onDetailClick={(id) => { setSelectedMotor(id); setViewMode('detail'); }} 
            />
          </div>

          {/* Right Column: Telemetry (Temp & Torque) */}
          <TelemetryOverview data={telemetryData} />
          
          {/* Combined System Message & AI Analysis Window */}
          <AIAnalysisCard 
            systemStatus={systemStatus} 
            statusConfig={statusConfig} 
            isAnalyzing={isAnalyzing} 
            llmAnalysis={llmAnalysis} 
            onGenerateAnalysis={generateAnalysis} 
          />
        </div>
      ) : (
        <DetailView 
          motor1Data={motor1Data}
          motor2Data={motor2Data}
          telemetryData={telemetryData}
          detailLogs={detailLogs}
          selectedMotor={selectedMotor}
          setSelectedMotor={setSelectedMotor}
          setViewMode={setViewMode}
        />
      )}
    </div>
  );
}

