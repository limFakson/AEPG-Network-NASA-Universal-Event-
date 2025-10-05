import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Menu, X, Search, AlertTriangle, Settings } from 'lucide-react';
import GlobeVisualization from '../components/globe/GlobeVisualization';
import AQIChart from '../components/charts/AQIChart';
import Sidebar from '../components/dashboard/Sidebar';
import NotificationBanner from '../components/ui/NotificationBanner';
import { mockAirQualityData, generateGlobePoints } from '../data/mockData';
import { AirQualityData } from '../types';

interface DashboardProps {
  onBackToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToLanding }) => {
  const [selectedLocation, setSelectedLocation] = useState<AirQualityData>(mockAirQualityData[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [globePoints, setGlobePoints] = useState(generateGlobePoints());

  useEffect(() => {
    // Update globe points when location changes
    setGlobePoints(generateGlobePoints());
  }, [selectedLocation]);

  const handleLocationSelect = (location: AirQualityData) => {
    setSelectedLocation(location);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-space-dark text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-nasa-blue/10 via-transparent to-neon-cyan/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-20 flex items-center justify-between p-6 bg-space-dark/80 backdrop-blur-md border-b border-white/10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToLanding}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nasa-blue to-neon-cyan rounded-lg flex items-center justify-center">
              <span className="text-white font-orbitron font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-gradient">AeroSight</h1>
              <p className="text-xs text-gray-400 font-rajdhani">NASA TEMPO Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200"
            />
          </div>

          {/* Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] relative z-10">
        {/* Sidebar */}
        <motion.div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } fixed lg:relative z-30 lg:z-auto w-80 lg:w-96 h-full bg-space-dark/90 backdrop-blur-md border-r border-white/10 transition-transform duration-300 ease-in-out`}
          initial={{ x: -400 }}
          animate={{ x: sidebarOpen ? 0 : -400 }}
          transition={{ duration: 0.3 }}
        >
          <Sidebar
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Notification Banner */}
          {selectedLocation.alerts.length > 0 && (
            <NotificationBanner alerts={selectedLocation.alerts} />
          )}

          {/* Globe and Charts Section */}
          <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Globe Visualization */}
            <motion.div
              className="flex-1 glass-panel-glow rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[500px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlobeVisualization
                points={globePoints}
                selectedLocation={selectedLocation}
                onLocationClick={handleLocationSelect}
              />
            </motion.div>

            {/* Charts Panel */}
            <motion.div
              className="w-full lg:w-96 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* AQI Forecast Chart */}
              <div className="glass-panel-glow rounded-2xl p-6">
                <h3 className="text-lg font-orbitron font-semibold mb-4 text-gradient">
                  Air Quality Forecast
                </h3>
                <AQIChart data={selectedLocation.forecast} />
              </div>

              {/* Current Conditions */}
              <div className="glass-panel-glow rounded-2xl p-6">
                <h3 className="text-lg font-orbitron font-semibold mb-4 text-gradient">
                  Current Conditions
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">AQI Index</span>
                    <span className="text-2xl font-bold" style={{ color: selectedLocation.current.aqi > 100 ? '#ff0000' : '#00ff88' }}>
                      {selectedLocation.current.aqi}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">PM2.5</span>
                    <span className="text-lg font-semibold">{selectedLocation.current.pm25} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">PM10</span>
                    <span className="text-lg font-semibold">{selectedLocation.current.pm10} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">NO₂</span>
                    <span className="text-lg font-semibold">{selectedLocation.current.no2} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">O₃</span>
                    <span className="text-lg font-semibold">{selectedLocation.current.o3} μg/m³</span>
                  </div>
                </div>
              </div>

              {/* Weather Info */}
              <div className="glass-panel-glow rounded-2xl p-6">
                <h3 className="text-lg font-orbitron font-semibold mb-4 text-gradient">
                  Weather Data
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Temperature</span>
                    <span className="text-lg font-semibold">{selectedLocation.forecast[0]?.temperature || 'N/A'}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Humidity</span>
                    <span className="text-lg font-semibold">{selectedLocation.forecast[0]?.humidity || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wind Speed</span>
                    <span className="text-lg font-semibold">{selectedLocation.forecast[0]?.windSpeed || 'N/A'} km/h</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Dashboard;
