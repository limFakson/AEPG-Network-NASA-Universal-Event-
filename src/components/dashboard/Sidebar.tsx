import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, AlertTriangle } from 'lucide-react';
import { AirQualityData } from '../../types';
import { mockAirQualityData } from '../../data/mockData';

interface SidebarProps {
  selectedLocation: AirQualityData;
  onLocationSelect: (location: AirQualityData) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedLocation,
  onLocationSelect,
  searchQuery,
  onSearchChange
}) => {
  const [activeTab, setActiveTab] = useState<'locations' | 'alerts' | 'insights'>('locations');

  const filteredLocations = mockAirQualityData.filter(location =>
    location.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00ff88';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff8800';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8800ff';
    return '#800000';
  };

  const getAQILabel = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const allAlerts = mockAirQualityData.flatMap(location => 
    location.alerts.map(alert => ({ ...alert, location: location.location.name }))
  );

  return (
    <div className="h-full flex flex-col bg-space-dark/90 backdrop-blur-md">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-orbitron font-bold text-gradient mb-4">
          Mission Control
        </h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'locations', label: 'Locations', icon: MapPin },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
          { id: 'insights', label: 'Insights', icon: Eye }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-neon-cyan border-b-2 border-neon-cyan bg-white/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-rajdhani font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'locations' && (
          <motion.div
            className="p-6 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-orbitron font-semibold text-gradient mb-4">
              Global Locations
            </h3>
            
            {filteredLocations.map((location, index) => (
              <motion.div
                key={location.id}
                onClick={() => onLocationSelect(location)}
                className={`glass-panel rounded-lg p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedLocation.id === location.id
                    ? 'ring-2 ring-neon-cyan bg-white/10'
                    : 'hover:bg-white/5'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <h4 className="font-rajdhani font-semibold text-white">
                        {location.location.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {location.location.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: getAQIColor(location.current.aqi) }}
                    >
                      {location.current.aqi}
                    </div>
                    <p className="text-xs text-gray-400">
                      {getAQILabel(location.current.aqi)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">PM2.5:</span>
                    <span className="text-white">{location.current.pm25} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PM10:</span>
                    <span className="text-white">{location.current.pm10} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">NO₂:</span>
                    <span className="text-white">{location.current.no2} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">O₃:</span>
                    <span className="text-white">{location.current.o3} μg/m³</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            className="p-6 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-orbitron font-semibold text-gradient mb-4">
              Active Alerts
            </h3>
            
            {allAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-rajdhani">No active alerts</p>
                <p className="text-xs text-gray-500 mt-2">
                  All monitored locations are within safe air quality levels
                </p>
              </div>
            ) : (
              allAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  className="glass-panel rounded-lg p-4 border-l-4"
                  style={{
                    borderLeftColor: alert.type === 'danger' ? '#ff0000' : 
                                   alert.type === 'warning' ? '#ff8800' : '#0080ff'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle 
                      className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'danger' ? 'text-red-400' :
                        alert.type === 'warning' ? 'text-orange-400' : 'text-blue-400'
                      }`} 
                    />
                    <div className="flex-1">
                      <h4 className="font-rajdhani font-semibold text-white mb-1">
                        {alert.location}
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        Expires: {new Date(alert.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            className="p-6 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-orbitron font-semibold text-gradient mb-4">
              AI Insights
            </h3>
            
            <div className="space-y-4">
              <div className="glass-panel rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="w-5 h-5 text-neon-cyan" />
                  <h4 className="font-rajdhani font-semibold text-white">
                    Current Analysis
                  </h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Air quality patterns show moderate pollution levels across major cities. 
                  Industrial emissions and traffic contribute to elevated PM2.5 readings.
                </p>
              </div>

              <div className="glass-panel rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Wind className="w-5 h-5 text-neon-cyan" />
                  <h4 className="font-rajdhani font-semibold text-white">
                    Weather Impact
                  </h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Strong westerly winds are expected to disperse pollutants over the next 
                  6-12 hours, improving air quality in affected regions.
                </p>
              </div>

              <div className="glass-panel rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Thermometer className="w-5 h-5 text-neon-cyan" />
                  <h4 className="font-rajdhani font-semibold text-white">
                    Temperature Effects
                  </h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Rising temperatures may increase ground-level ozone formation, 
                  particularly in urban areas with high traffic density.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
