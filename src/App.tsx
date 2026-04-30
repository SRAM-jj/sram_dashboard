import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'settings'>('login');

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
          <motion.div
            key="login"
            className="login-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Login onLogin={() => setCurrentView('dashboard')} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            className="dashboard-page overflow-hidden h-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard
              onLogout={() => setCurrentView('login')}
              onOpenSettings={() => setCurrentView('settings')}
            />
          </motion.div>
        )}

        {currentView === 'settings' && (
          <motion.div
            key="settings"
            className="settings-page absolute inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Settings onBack={() => setCurrentView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
