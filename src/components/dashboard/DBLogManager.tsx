import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ITEMS_PER_PAGE = 15;

// Mock 데이터 생성 로직 (Context 대신 내부에서 관리)
const generateInitialLogs = () => {
  const levels = ['SAFE', 'WARNING', 'DANGER', 'ERROR'];
  const modules = ['Motor 1', 'Motor 2', 'System Controller', 'AI Analyzer'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    return {
      id: 50 - i,
      timestamp: new Date(Date.now() - i * 3600000).toLocaleString('ko-KR', { hour12: false }),
      level,
      module: modules[Math.floor(Math.random() * modules.length)],
      message: `Temp: ${Math.floor(30 + Math.random() * 20)}°C / Torque: ${Math.floor(5 + Math.random() * 40)}Nm`,
      details: level === 'SAFE' ? 'PASS' : (Math.random() > 0.5 ? 'CHECK' : 'URGENT')
    };
  });
};

export default function DBLogManager() {
  const [logs, setLogs] = useState(generateInitialLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
      const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
      return matchesSearch && matchesLevel && matchesDate;
    });
  }, [logs, searchTerm, levelFilter, dateFilter]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SAFE': return '#02D6A3';
      case 'WARNING': return '#facc15';
      case 'DANGER': return '#d946ef';
      case 'ERROR': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getLevelIcon = (level: string) => {
    const size = 16;
    switch (level) {
      case 'SAFE': return <CheckCircle2 size={size} color="#02D6A3" />;
      case 'WARNING': return <AlertTriangle size={size} color="#facc15" />;
      case 'DANGER': return <AlertCircle size={size} color="#d946ef" />;
      case 'ERROR': return <XCircle size={size} color="#ef4444" />;
      default: return null;
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Timestamp', 'Level', 'Module', 'Status Data', 'Diagnosis'];
      const csvContent = [
        headers.join(','),
        ...filteredLogs.map(log =>
          `"${log.timestamp}","${log.level}","${log.module}","${log.message}","${log.details}"`
        )
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `sram_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
      {/* Header Section */}
      <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="text-brand" size={20} />
            History Archive (DB Logs)
          </h2>
          <p className="text-gray-400 text-xs mt-1">시스템 운영 기록을 데이터베이스에서 실시간 조회합니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand/80 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50"
          >
            <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
            {isExporting ? 'Exporting...' : 'CSV Export'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 p-6">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Records</div>
          <div className="text-2xl font-bold text-white">{logs.length}</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Anomalies Detected</div>
          <div className="text-2xl font-bold text-red-400">{logs.filter(l => l.level !== 'SAFE').length}</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">DB Usage</div>
          <div className="text-2xl font-bold text-white">12.4 MB</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Retention Policy</div>
          <div className="text-2xl font-bold text-brand">30 Days</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="px-6 pb-6 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="SAFE">SAFE</option>
            <option value="WARNING">WARNING</option>
            <option value="DANGER">DANGER</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
        <button
          onClick={() => { setSearchTerm(''); setLevelFilter('ALL'); setDateFilter(''); }}
          className="p-2 hover:bg-white/10 text-gray-400 rounded-xl transition-colors border border-white/10"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Level</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telemetry Data</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {currentLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <span style={{ color: getLevelColor(log.level) }} className="text-[10px] font-black tracking-tighter">
                          {log.level}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">{log.timestamp}</td>
                    <td className="px-6 py-4 text-xs text-white font-medium">{log.module}</td>
                    <td className="px-6 py-4 text-xs text-gray-300">{log.message}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        log.details === 'PASS' ? 'bg-brand/10 text-brand border-brand/20' :
                        log.details === 'CHECK' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {log.details}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="py-20 text-center text-gray-500 text-sm">
              No records found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <span className="text-[10px] text-gray-500 font-bold uppercase">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-white/10 text-gray-400 disabled:opacity-20 rounded-lg transition-colors border border-white/10"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1 items-center px-2">
              <span className="text-xs font-bold text-brand">{currentPage}</span>
              <span className="text-[10px] text-gray-600">/</span>
              <span className="text-[10px] text-gray-500 font-bold">{totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-white/10 text-gray-400 disabled:opacity-20 rounded-lg transition-colors border border-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
