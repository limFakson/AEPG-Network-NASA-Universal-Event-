import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Globe, Satellite, Zap } from 'lucide-react';
import LandingGlobe from '../components/ui/LandingGlobe';
import FloatingParticles from '../components/ui/FloatingParticles';
import DataVisualization3D from '../components/ui/DataVisualization3D';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onEnterFireDetection: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard, onEnterFireDetection }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Floating Particles Background */}
      <FloatingParticles count={50} />
      
      {/* Additional 2D Particles for extra depth */}
      <div className="particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-40"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-nasa-blue to-neon-cyan rounded-lg flex items-center justify-center">
              <Satellite className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-orbitron font-bold text-gradient">
              AeroSight
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <img 
              src="https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png" 
              alt="NASA" 
              className="h-8 opacity-80"
            />
            <span className="text-sm text-gray-400 font-rajdhani">
              Space Apps Challenge
            </span>
          </div>
        </motion.header>

        {/* Hero Section with 3D Globe */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20 min-h-[80vh]">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <motion.h1
              className="text-5xl md:text-7xl font-orbitron font-black mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-gradient">AeroSight</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 font-rajdhani mb-6 leading-relaxed"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Visualizing Earth's Breath — Real-time Air Quality from Space
            </motion.p>

            <motion.p
              className="text-lg text-gray-400 font-poppins mb-8 leading-relaxed"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Experience the future of air quality monitoring through NASA's TEMPO satellite data, 
              ground sensors, and advanced weather forecasting. Navigate a 3D Earth to explore 
              real-time pollution levels and predictive analytics.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={onEnterDashboard}
                className="group relative px-12 py-4 bg-gradient-to-r from-nasa-blue to-neon-cyan rounded-full font-orbitron font-semibold text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Rocket className="w-5 h-5" />
                  <span>Launch Dashboard</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-nasa-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </motion.button>

              <motion.button
                onClick={onEnterFireDetection}
                className="group relative px-12 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full font-orbitron font-semibold text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Satellite className="w-5 h-5" />
                  <span>Fire Detection</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </motion.button>
            </div>
          </div>

          {/* Right Side - 3D Globe */}
          <motion.div
            className="relative h-80 md:h-96 lg:h-[400px] w-full"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <LandingGlobe className="w-full h-full rounded-2xl overflow-hidden glass-panel-glow" />
            
            {/* Floating stats overlay */}
            <motion.div
              className="absolute top-4 left-4 glass-panel rounded-lg p-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <div className="text-center">
                <div className="text-2xl font-orbitron font-bold text-neon-cyan">5</div>
                <div className="text-xs text-gray-400 font-rajdhani">Cities Monitored</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-4 left-4 glass-panel rounded-lg p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <div className="text-center">
                <div className="text-2xl font-orbitron font-bold text-green-400">Real-time</div>
                <div className="text-xs text-gray-400 font-rajdhani">Data Updates</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-4 right-4 glass-panel rounded-lg p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.9 }}
            >
              <div className="text-center">
                <div className="text-2xl font-orbitron font-bold text-purple-400">24/7</div>
                <div className="text-xs text-gray-400 font-rajdhani">Monitoring</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Data Visualization Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient mb-6">
              Live Air Quality Data
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Experience real-time air quality metrics from major cities around the world through our immersive 3D visualization
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="glass-panel-glow rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <DataVisualization3D className="w-full h-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          {[
            {
              icon: Globe,
              title: '3D Earth Visualization',
              description: 'Interactive globe with real-time air quality heat zones powered by NASA TEMPO satellite data.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Zap,
              title: 'Real-time Monitoring',
              description: 'Live air quality metrics including PM2.5, NO₂, O₃, and other pollutants from ground sensors.',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: Satellite,
              title: 'Predictive Analytics',
              description: 'Advanced forecasting using weather patterns and satellite imagery for 24-72 hour predictions.',
              color: 'from-green-500 to-blue-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-panel-glow p-8 text-center group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 + index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold mb-4 text-gradient">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="text-center mt-20 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <p className="font-rajdhani">
            Built for NASA Space Apps Challenge 2024 • Powered by TEMPO Satellite Data
          </p>
          <p className="text-sm mt-2">
            Real-time air quality monitoring from space to ground
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;
