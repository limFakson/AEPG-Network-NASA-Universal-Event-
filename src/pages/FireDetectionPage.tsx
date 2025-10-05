import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Satellite, AlertTriangle, TrendingUp, Globe } from 'lucide-react';
import FireDetectionGlobe from '../components/ui/FireDetectionGlobe';
import { nasaApi, calculateAirQualityImpact, FireDetection } from '../data/nasaApi';

interface FireDetectionPageProps {
  onBackToLanding: () => void;
}

const FireDetectionPage: React.FC<FireDetectionPageProps> = ({ onBackToLanding }) => {
  const [fireData, setFireData] = useState<FireDetection[]>([]);
  const [powerData, setPowerData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFire, setSelectedFire] = useState<FireDetection | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fireDetections, powerDataResult] = await Promise.all([
          nasaApi.getFireDetections(),
          nasaApi.getPowerData()
        ]);
        
        setFireData(fireDetections);
        setPowerData(powerDataResult);
      } catch (error) {
        console.error('Failed to fetch NASA data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const airQualityImpact = calculateAirQualityImpact(fireData);

  return (
    <div className="min-h-screen bg-space-dark text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-20 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-space-dark/80 backdrop-blur-md border-b border-white/10 gap-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onBackToLanding}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-orbitron font-bold text-gradient">NASA Fire Detection</h1>
              <p className="text-xs text-gray-400 font-rajdhani">Real-time Satellite Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-orbitron font-bold text-red-400">{fireData.length}</div>
            <div className="text-xs text-gray-400 font-rajdhani">Active Fires</div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] relative z-10">
        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Globe Visualization */}
          <div className="flex-1 flex flex-col lg:flex-row p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Fire Detection Globe */}
            <motion.div
              className="flex-1 glass-panel-glow rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FireDetectionGlobe className="w-full h-full" />
            </motion.div>

            {/* Data Panels */}
            <motion.div
              className="w-full lg:w-96 space-y-4 lg:space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Air Quality Impact */}
              <div className="glass-panel-glow rounded-2xl p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-orbitron font-semibold mb-3 lg:mb-4 text-gradient flex items-center">
                  <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-orange-400" />
                  Air Quality Impact
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-400">AQI Impact</span>
                    <span 
                      className="text-xl lg:text-2xl font-bold"
                      style={{ 
                        color: airQualityImpact.riskLevel === 'high' ? '#ff0000' : 
                               airQualityImpact.riskLevel === 'medium' ? '#ff8800' : '#00ff88'
                      }}
                    >
                      +{airQualityImpact.aqiImpact}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-400">Risk Level</span>
                    <span 
                      className="text-base lg:text-lg font-semibold capitalize"
                      style={{ 
                        color: airQualityImpact.riskLevel === 'high' ? '#ff0000' : 
                               airQualityImpact.riskLevel === 'medium' ? '#ff8800' : '#00ff88'
                      }}
                    >
                      {airQualityImpact.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-400">High Confidence Fires</span>
                    <span className="text-base lg:text-lg font-semibold">{airQualityImpact.highConfidenceFires}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm lg:text-base text-gray-400">Total Detections</span>
                    <span className="text-base lg:text-lg font-semibold">{airQualityImpact.totalFires}</span>
                  </div>
                </div>
              </div>

              {/* Recent Fire Detections */}
              <div className="glass-panel-glow rounded-2xl p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-orbitron font-semibold mb-3 lg:mb-4 text-gradient flex items-center">
                  <Satellite className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-400" />
                  Recent Detections
                </h3>
                <div className="space-y-2 lg:space-y-3 max-h-48 lg:max-h-64 overflow-y-auto scrollbar-hide">
                  {fireData.slice(0, 5).map((fire, index) => (
                    <motion.div
                      key={fire.id}
                      className="glass-panel rounded-lg p-2 lg:p-3 cursor-pointer hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      onClick={() => setSelectedFire(fire)}
                    >
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 lg:w-3 lg:h-3 rounded-full"
                            style={{ backgroundColor: fire.confidence >= 80 ? '#ff0000' : '#ff8800' }}
                          />
                          <span className="text-xs lg:text-sm font-rajdhani text-white">
                            {fire.latitude.toFixed(2)}, {fire.longitude.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs lg:text-sm text-gray-400">{fire.confidence}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{fire.satellite}</span>
                        <span>{new Date(fire.acq_datetime).toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* NASA Power Data */}
              <div className="glass-panel-glow rounded-2xl p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-orbitron font-semibold mb-3 lg:mb-4 text-gradient flex items-center">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-400" />
                  NASA Power Data
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  {powerData.slice(0, 3).map((data, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm lg:text-base text-gray-400 capitalize">{data.parameter.replace('_', ' ')}</span>
                      <span className="text-sm lg:text-base text-white font-semibold">
                        {data.value} {data.units}
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-2">
                    Source: {powerData[0]?.source || 'NASA_POWER'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fire Details Modal */}
      {selectedFire && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedFire(null)}
        >
          <motion.div
            className="glass-panel-glow rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-orbitron font-bold text-gradient">Fire Detection Details</h3>
              <button 
                onClick={() => setSelectedFire(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Confidence</label>
                  <div className="text-lg font-semibold text-white">{selectedFire.confidence}%</div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Satellite</label>
                  <div className="text-lg font-semibold text-white">{selectedFire.satellite}</div>
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Location</label>
                <div className="text-white">
                  {selectedFire.latitude.toFixed(4)}, {selectedFire.longitude.toFixed(4)}
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Detection Time</label>
                <div className="text-white">
                  {new Date(selectedFire.acq_datetime).toLocaleString()}
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Day/Night</label>
                <div className="text-white capitalize">{selectedFire.daynight}</div>
              </div>

              {selectedFire.weather && selectedFire.weather.length > 0 && (
                <div>
                  <label className="text-gray-400 text-sm">Weather Data</label>
                  <div className="space-y-2">
                    {selectedFire.weather.map((weather, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300 capitalize">{weather.parameter.replace('_', ' ')}</span>
                        <span className="text-white">{weather.value} {weather.units}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FireDetectionPage;
