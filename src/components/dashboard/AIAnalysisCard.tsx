import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

interface AIAnalysisCardProps {
  systemStatus: 'SAFE' | 'WARNING' | 'DANGER' | 'ERROR';
  statusConfig: any;
  isAnalyzing: boolean;
  llmAnalysis: string;
  onGenerateAnalysis: () => void;
}

export default function AIAnalysisCard({ 
  systemStatus, 
  statusConfig, 
  isAnalyzing, 
  llmAnalysis, 
  onGenerateAnalysis 
}: AIAnalysisCardProps) {
  if (systemStatus === 'SAFE') return null;

  return (
    <div className="col-span-2 mt-5 rounded-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ 
      backgroundColor: `${statusConfig.color}08`, 
      borderColor: statusConfig.border,
      borderWidth: '1px'
    }}>
      {/* Top Section: System Status Message */}
      <div className="p-4 border-b" style={{ borderColor: `${statusConfig.color}20`, backgroundColor: `${statusConfig.color}10` }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: statusConfig.color }} />
          <span className="font-bold text-lg" style={{ color: statusConfig.color }}>{statusConfig.message}</span>
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <p><span className="text-gray-500 mr-2">●</span>{statusConfig.reason}</p>
          <p><span className="text-gray-500 mr-2">●</span>{statusConfig.action}</p>
        </div>
      </div>

      {/* Bottom Section: AI Analysis */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2" style={{ color: statusConfig.color }}>
            <Brain size={20} className={isAnalyzing ? "animate-pulse" : ""} />
            <span className="font-bold text-sm tracking-wider uppercase">AI SYSTEM DIAGNOSIS</span>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs opacity-70" style={{ color: statusConfig.color }}>
              <Loader2 size={14} className="animate-spin" />
              분석 중...
            </div>
          )}
        </div>
        <div className="text-sm leading-relaxed text-gray-200 min-h-[60px] bg-black/20 p-3 rounded border" style={{ borderColor: `${statusConfig.color}15` }}>
          {isAnalyzing ? (
            <div className="space-y-2">
              <div className="h-4 rounded w-3/4 animate-pulse" style={{ backgroundColor: `${statusConfig.color}15` }} />
              <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: `${statusConfig.color}15` }} />
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{llmAnalysis || "데이터 분석을 대기 중입니다..."}</p>
          )}
        </div>
        {!isAnalyzing && llmAnalysis && (
          <div className="mt-3 flex justify-end">
            <button 
              onClick={onGenerateAnalysis}
              className="text-[10px] px-3 py-1 rounded transition-all hover:brightness-125"
              style={{ 
                backgroundColor: `${statusConfig.color}25`,
                color: statusConfig.color,
                border: `1px solid ${statusConfig.color}40`
              }}
            >
              재분석 요청
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
