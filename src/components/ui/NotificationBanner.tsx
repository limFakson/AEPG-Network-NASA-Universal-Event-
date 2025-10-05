import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Info, AlertCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  severity: number;
  expiresAt: string;
}

interface NotificationBannerProps {
  alerts: Alert[];
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ alerts }) => {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>(alerts);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Filter out dismissed alerts
    setVisibleAlerts(alerts.filter(alert => !dismissedAlerts.has(alert.id)));
  }, [alerts, dismissedAlerts]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          glow: 'shadow-red-500/20',
          text: 'text-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          glow: 'shadow-orange-500/20',
          text: 'text-orange-200'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          glow: 'shadow-blue-500/20',
          text: 'text-blue-200'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          glow: 'shadow-gray-500/20',
          text: 'text-gray-200'
        };
    }
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="relative z-20 mx-6 mt-4 space-y-2"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        {visibleAlerts.map((alert, index) => {
          const styles = getAlertStyles(alert.type);
          
          return (
            <motion.div
              key={alert.id}
              className={`${styles.bg} ${styles.border} ${styles.glow} backdrop-blur-md border rounded-lg p-4 shadow-lg`}
              initial={{ opacity: 0, x: -100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-rajdhani font-semibold ${styles.text} mb-1`}>
                      {alert.type === 'danger' && 'Critical Alert'}
                      {alert.type === 'warning' && 'Warning'}
                      {alert.type === 'info' && 'Information'}
                    </h4>
                    
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  
                  <p className={`text-sm ${styles.text} leading-relaxed`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity >= 4 ? 'bg-red-400 animate-pulse' :
                        alert.severity >= 2 ? 'bg-orange-400 animate-pulse' :
                        'bg-blue-400'
                      }`}></div>
                      <span className="text-xs text-gray-400">
                        Severity: {alert.severity}/5
                      </span>
                    </div>
                    
                    <span className="text-xs text-gray-400">
                      Expires: {new Date(alert.expiresAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Global Alert Summary */}
        {visibleAlerts.length > 1 && (
          <motion.div
            className="glass-panel rounded-lg p-3 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-rajdhani text-white">
                  {visibleAlerts.length} active alerts across monitored locations
                </span>
              </div>
              
              <button
                onClick={() => setDismissedAlerts(new Set(alerts.map(a => a.id)))}
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200 underline"
              >
                Dismiss All
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBanner;
