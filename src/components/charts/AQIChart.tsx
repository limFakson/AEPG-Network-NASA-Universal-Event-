import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface ForecastData {
  hour: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
  humidity: number;
}

interface AQIChartProps {
  data: ForecastData[];
}

const AQIChart: React.FC<AQIChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map(item => ({
    time: new Date(item.hour).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    aqi: item.aqi,
    pm25: item.pm25,
    pm10: item.pm10,
    no2: item.no2,
    o3: item.o3,
    temperature: item.temperature,
    humidity: item.humidity,
    windSpeed: item.windSpeed
  }));

  // Get color based on AQI level
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00ff88';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff8800';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8800ff';
    return '#800000';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          className="glass-panel rounded-lg p-4 border border-white/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-white font-rajdhani font-semibold mb-2">{`Time: ${label}`}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">AQI:</span>
              <span 
                className="font-semibold"
                style={{ color: getAQIColor(data.aqi) }}
              >
                {data.aqi}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">PM2.5:</span>
              <span className="text-white">{data.pm25} μg/m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">PM10:</span>
              <span className="text-white">{data.pm10} μg/m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">NO₂:</span>
              <span className="text-white">{data.no2} μg/m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">O₃:</span>
              <span className="text-white">{data.o3} μg/m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Temperature:</span>
              <span className="text-white">{data.temperature}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Humidity:</span>
              <span className="text-white">{data.humidity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Wind Speed:</span>
              <span className="text-white">{data.windSpeed} km/h</span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-64 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            fontFamily="Rajdhani"
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            fontFamily="Rajdhani"
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Main AQI Line */}
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#00ffff"
            strokeWidth={3}
            dot={{
              fill: '#00ffff',
              strokeWidth: 2,
              stroke: '#ffffff',
              r: 4
            }}
            activeDot={{
              r: 6,
              fill: '#00ffff',
              stroke: '#ffffff',
              strokeWidth: 2
            }}
          />
          
          {/* PM2.5 Line */}
          <Line
            type="monotone"
            dataKey="pm25"
            stroke="#ff8800"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{
              r: 4,
              fill: '#ff8800',
              stroke: '#ffffff',
              strokeWidth: 1
            }}
          />
          
          {/* PM10 Line */}
          <Line
            type="monotone"
            dataKey="pm10"
            stroke="#ff0080"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{
              r: 4,
              fill: '#ff0080',
              stroke: '#ffffff',
              strokeWidth: 1
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-cyan-400"></div>
          <span className="text-gray-300 font-rajdhani">AQI</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-orange-400 border-dashed border-t border-orange-400"></div>
          <span className="text-gray-300 font-rajdhani">PM2.5</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-pink-400 border-dashed border-t border-pink-400"></div>
          <span className="text-gray-300 font-rajdhani">PM10</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AQIChart;
