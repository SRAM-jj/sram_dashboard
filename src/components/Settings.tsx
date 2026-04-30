import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Save, Key, Cpu, EyeOff, Eye, Network,
  Clock, Monitor, Globe, Palette, Wifi, AlertTriangle,
  Shield, HardDrive, Download, RotateCcw, Activity, Thermometer, Zap
} from 'lucide-react';
import clsx from 'clsx';

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  // 1. AI System
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // 2. MQTT
  const [m1Host, setM1Host] = useState('192.168.1.100:1883');
  const [m1Topic, setM1Topic] = useState('/robot/m1/data');
  const [m2Host, setM2Host] = useState('192.168.1.101:1883');
  const [m2Topic, setM2Topic] = useState('/robot/m2/data');
  const [mqttQos, setMqttQos] = useState('0');
  const [mqttRetries, setMqttRetries] = useState('3');

  // 3. Display
  const [pollingInterval, setPollingInterval] = useState('1s');
  const [chartTimeRange, setChartTimeRange] = useState('30s');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ko');

  // 4. Alerts
  const [tempAlert, setTempAlert] = useState('40');
  const [torqueAlert, setTorqueAlert] = useState('30');
  const [torqueMax, setTorqueMax] = useState('50');

  // 5. Security
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [password, setPassword] = useState('');

  // 6. Data
  const [dataLogging, setDataLogging] = useState(true);

  const [savedMessage, setSavedMessage] = useState('');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    // Load from localStorage on mount (mocking DB)
    setApiKey(localStorage.getItem('sram_api_key') || '');
    setM1Host(localStorage.getItem('sram_m1_host') || '192.168.1.100:1883');
    setM1Topic(localStorage.getItem('sram_m1_topic') || '/robot/m1/data');
    setM2Host(localStorage.getItem('sram_m2_host') || '192.168.1.101:1883');
    setM2Topic(localStorage.getItem('sram_m2_topic') || '/robot/m2/data');
  }, []);

  const handleSave = () => {
    localStorage.setItem('sram_api_key', apiKey);
    localStorage.setItem('sram_m1_host', m1Host);
    localStorage.setItem('sram_m1_topic', m1Topic);
    localStorage.setItem('sram_m2_host', m2Host);
    localStorage.setItem('sram_m2_topic', m2Topic);

    setSavedMessage('설정이 성공적으로 저장되었습니다.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleTestConnection = () => {
    setTestMessage('연결 테스트 중...');
    setTimeout(() => {
      setTestMessage('연결 성공! (Ping: 14ms)');
      setTimeout(() => setTestMessage(''), 3000);
    }, 1000);
  };

  const handleExportCSV = () => {
    setSavedMessage('데이터를 CSV로 내보냈습니다.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleReset = () => {
    if (confirm('모든 설정을 초기화하시겠습니까?')) {
      // Clear localStorage
      localStorage.removeItem('sram_api_key');
      localStorage.removeItem('sram_m1_host');
      localStorage.removeItem('sram_m1_topic');
      localStorage.removeItem('sram_m2_host');
      localStorage.removeItem('sram_m2_topic');

      // Reset states
      setApiKey('');
      setM1Host('192.168.1.100:1883');
      setM1Topic('/robot/m1/data');
      setM2Host('192.168.1.101:1883');
      setM2Topic('/robot/m2/data');
      setMqttQos('0');
      setMqttRetries('3');
      setPollingInterval('1s');
      setChartTimeRange('30s');
      setTheme('dark');
      setLanguage('ko');
      setTempAlert('40');
      setTorqueAlert('30');
      setTorqueMax('50');
      setSessionTimeout('30m');
      setPassword('');
      setDataLogging(true);

      setSavedMessage('설정이 초기화되었습니다.');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder = "", icon: Icon }: any) => (
    <div className="space-y-1.5 flex-1">
      <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
        {Icon && <Icon size={14} />} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#02D6A3]/50 focus:border-transparent transition-all"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, icon: Icon }: any) => (
    <div className="space-y-1.5 flex-1">
      <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
        {Icon && <Icon size={14} />} {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#02D6A3]/50 focus:border-transparent transition-all appearance-none"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1c23]">{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c23] via-[#16171d] to-[#0d1a17] text-white p-8 font-sans overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <ArrowLeft size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                System Configurations
              </h1>
              <p className="text-gray-400 text-sm mt-1">SRAM 대시보드 및 로봇 제어 시스템 설정</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all border border-white/10"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#02D6A3]/20 text-[#02D6A3] font-semibold border border-[#02D6A3]/50 hover:bg-[#02D6A3]/30 hover:shadow-[0_0_20px_rgba(2,214,163,0.3)] transition-all active:scale-95"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>

        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-[#02D6A3]/10 border border-[#02D6A3]/30 rounded-xl text-[#02D6A3] text-sm font-medium flex items-center justify-center shadow-[0_0_15px_rgba(2,214,163,0.15)]"
          >
            {savedMessage}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column */}
          <div className="space-y-8">

            {/* Display Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Monitor size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-white/90">대시보드 표시 설정</h2>
              </div>
              <div className="grid grid-cols-2 gap-5 pl-14">
                <SelectField label="데이터 갱신 주기" icon={Clock} value={pollingInterval} onChange={setPollingInterval} options={[
                  { label: '500ms (실시간)', value: '500ms' }, { label: '1초 (권장)', value: '1s' }, { label: '3초', value: '3s' }, { label: '5초', value: '5s' }
                ]} />
                <SelectField label="그래프 표시 시간" icon={Activity} value={chartTimeRange} onChange={setChartTimeRange} options={[
                  { label: '최근 30초', value: '30s' }, { label: '최근 1분', value: '1m' }, { label: '최근 5분', value: '5m' }
                ]} />
                <SelectField label="테마 선택" icon={Palette} value={theme} onChange={setTheme} options={[
                  { label: 'Dark Mode (기본)', value: 'dark' }, { label: 'Light Mode', value: 'light' }, { label: 'System Auto', value: 'auto' }
                ]} />
                <SelectField label="언어 (Language)" icon={Globe} value={language} onChange={setLanguage} options={[
                  { label: '한국어', value: 'ko' }, { label: 'English', value: 'en' }
                ]} />
              </div>
            </motion.div>

            {/* MQTT Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                    <Network size={20} className="text-sky-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white/90">MQTT 연결 설정</h2>
                </div>
                <button onClick={handleTestConnection} className="text-xs px-3 py-1.5 rounded bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors border border-sky-500/30">
                  연결 테스트
                </button>
              </div>

              {testMessage && (
                <div className="mb-4 pl-14 text-sm text-sky-400 font-medium">{testMessage}</div>
              )}

              <div className="space-y-6 pl-14">
                <div className="grid grid-cols-2 gap-5 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="col-span-2 flex items-center gap-2 mb-1">
                    <Cpu size={16} className="text-sky-400" />
                    <h3 className="text-sm font-medium text-white/80">Motor 1</h3>
                  </div>
                  <InputField label="Host IP:Port" value={m1Host} onChange={setM1Host} />
                  <InputField label="Subscribe Topic" value={m1Topic} onChange={setM1Topic} />
                </div>
                <div className="grid grid-cols-2 gap-5 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="col-span-2 flex items-center gap-2 mb-1">
                    <Cpu size={16} className="text-blue-400" />
                    <h3 className="text-sm font-medium text-white/80">Motor 2</h3>
                  </div>
                  <InputField label="Host IP:Port" value={m2Host} onChange={setM2Host} />
                  <InputField label="Subscribe Topic" value={m2Topic} onChange={setM2Topic} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <SelectField label="QoS Level" icon={Wifi} value={mqttQos} onChange={setMqttQos} options={[
                    { label: '0 (At most once)', value: '0' }, { label: '1 (At least once)', value: '1' }, { label: '2 (Exactly once)', value: '2' }
                  ]} />
                  <SelectField label="재시도 횟수" value={mqttRetries} onChange={setMqttRetries} options={[
                    { label: '무한', value: '-1' }, { label: '3회', value: '3' }, { label: '5회', value: '5' }
                  ]} />
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* AI Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Key size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white/90">AI 시스템 연동</h2>
                </div>
              </div>
              <div className="pl-14">
                <div className="relative">
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Gemini API Key</label>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AI_xxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all pr-12"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-[28px] text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Threshold Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertTriangle size={20} className="text-orange-400" />
                </div>
                <h2 className="text-xl font-semibold text-white/90">경고 임계값 설정</h2>
              </div>
              <div className="grid grid-cols-2 gap-5 pl-14">
                <InputField label="온도 경고 (°C)" icon={Thermometer} type="number" value={tempAlert} onChange={setTempAlert} />
                <InputField label="토크 경고 (Nm)" icon={Zap} type="number" value={torqueAlert} onChange={setTorqueAlert} />
                <div className="col-span-2">
                  <InputField label="긴급 정지 토크 최대치 (Nm)" type="number" value={torqueMax} onChange={setTorqueMax} />
                  <p className="text-xs text-gray-500 mt-2">이 값을 초과하면 로봇 긴급 정지(E-STOP) 명령이 발송됩니다.</p>
                </div>
              </div>
            </motion.div>

            {/* Security & Data Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Shield size={20} className="text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white/90">보안 및 데이터 관리</h2>
              </div>

              <div className="space-y-6 pl-14">
                <div className="grid grid-cols-2 gap-5">
                  <SelectField label="자동 로그아웃" value={sessionTimeout} onChange={setSessionTimeout} options={[
                    { label: '사용 안 함', value: '0' }, { label: '30분', value: '30m' }, { label: '1시간', value: '1h' }, { label: '4시간', value: '4h' }
                  ]} />
                  <InputField label="비밀번호 변경" type="password" value={password} onChange={setPassword} placeholder="새 비밀번호 입력" />
                </div>

                <div className="h-px w-full bg-white/5 my-4"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive size={18} className="text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium">데이터 로깅 (Local)</h3>
                      <p className="text-xs text-gray-500">원격 측정 데이터를 로컬에 저장합니다.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={dataLogging} onChange={() => setDataLogging(!dataLogging)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02D6A3]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium">로깅 데이터 내보내기</h3>
                      <p className="text-xs text-gray-500">저장된 기록을 CSV 형식으로 다운로드합니다.</p>
                    </div>
                  </div>
                  <button onClick={handleExportCSV} className="text-xs px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    CSV 다운로드
                  </button>
                </div>

              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
