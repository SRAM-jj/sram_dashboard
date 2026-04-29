import React from 'react';
import { Activity } from 'lucide-react';

interface StatusBarProps {
  time: string;
  statusConfig: any;
}

export default function StatusBar({ time, statusConfig }: StatusBarProps) {
  return (
    <div className="status-bar" style={{ 
      backgroundColor: statusConfig.bg, 
      borderColor: statusConfig.border,
      borderWidth: '1px',
      borderStyle: 'solid'
    }}>
      <div className="flex items-center gap-4">
        <div className="status-badge flex items-center gap-2" style={{ color: statusConfig.color }}>
          <Activity size={20} />
          {statusConfig.label}
        </div>
      </div>
      <div className="real-time-log">
        Real_Time Log: {time}
      </div>
    </div>
  );
}
