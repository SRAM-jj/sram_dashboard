import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, Activity, Thermometer, Zap, Layers, 
  Clock, Database, HardDrive, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

interface AINodeMonitorProps {
  onBack?: () => void;
}

export default function AINodeMonitor({ onBack }: AINodeMonitorProps) {
  const [gpuStats, setGpuStats] = useState({
    vramUsed: 8.4,
    vramTotal: 12,
    temp: 62,
    load: 78,
    power: 185,
    tokensPerSec: 42.5
  });

  const [inferenceQueue, setInferenceQueue] = useState([
    { id: '1', task: 'Motor 1 Vibration Analysis', status: 'processing', time: '1.2s' },
    { id: '2', task: 'Motor 2 Heat Gradient Scan', status: 'waiting', time: '-' },
    { id: '3', task: 'System Anomaly Detection', status: 'waiting', time: '-' },
  ]);

  const [historyData, setHistoryData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      tps: 35 + Math.random() * 15,
      load: 60 + Math.random() * 30
    }))
  );

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGpuStats(prev => ({
        ...prev,
        temp: 60 + Math.random() * 5,
        load: 70 + Math.random() * 25,
        power: 170 + Math.random() * 30,
        tokensPerSec: 38 + Math.random() * 10
      }));

      setHistoryData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          tps: 38 + Math.random() * 10,
          load: 70 + Math.random() * 25
        }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}>
          <Icon size={18} />
        </div>
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white font-mono">{value}</span>
        <span className="text-gray-500 text-sm">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar bg-[#0f1115]">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="text-[#02D6A3]" /> AI Node Monitoring (MLOps)
          </h2>
          <p className="text-gray-400 text-sm mt-1">Llama 3.1:8b | Local Server (RTX 4070 12GB)</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-[#02D6A3]/10 px-3 py-1.5 rounded-full border border-[#02D6A3]/20">
            <div className="w-2 h-2 rounded-full bg-[#02D6A3] animate-pulse" />
            <span className="text-[#02D6A3] text-xs font-bold uppercase">Node Online</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Database} label="VRAM Usage" value={gpuStats.vramUsed.toFixed(1)} unit={`/ ${gpuStats.vramTotal} GB`} color="blue" />
        <StatCard icon={Thermometer} label="GPU Temp" value={gpuStats.temp.toFixed(0)} unit="°C" color="orange" />
        <StatCard icon={Zap} label="Power Draw" value={gpuStats.power.toFixed(0)} unit="W" color="yellow" />
        <StatCard icon={Activity} label="Inference Speed" value={gpuStats.tokensPerSec.toFixed(1)} unit="T/s" color="emerald" />
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Performance Graph */}
        <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Activity size={18} className="text-[#02D6A3]" /> Inference Performance Trends
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#02D6A3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#02D6A3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#ffffff20" fontSize={12} tickFormatter={(v) => `${v}T/s`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1c23', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#02D6A3' }}
                />
                <Area type="monotone" dataKey="tps" stroke="#02D6A3" strokeWidth={2} fillOpacity={1} fill="url(#colorTps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inference Queue */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Clock size={18} className="text-blue-400" /> Inference Queue
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {inferenceQueue.map((item) => (
              <div key={item.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === 'processing' ? (
                    <div className="w-8 h-8 rounded-full bg-[#02D6A3]/10 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-[#02D6A3] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                      <Clock size={16} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{item.task}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{item.status}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Memory Pressure</span>
              <span className="text-blue-400">Normal (72%)</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[72%] transition-all duration-1000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
