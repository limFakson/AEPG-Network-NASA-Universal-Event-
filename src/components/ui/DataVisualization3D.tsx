import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { mockAirQualityData } from '../../data/mockData';

interface DataVisualization3DProps {
  className?: string;
}

const DataVisualization3D: React.FC<DataVisualization3DProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ffff, 0.5, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Create data bars for each city
    const cityData = mockAirQualityData;
    const barGroup = new THREE.Group();
    
    cityData.forEach((city, index) => {
      const barWidth = 0.8;
      const barSpacing = 1.2;
      const x = (index - cityData.length / 2) * barSpacing;
      
      // Get AQI color
      const getAQIColor = (aqi: number) => {
        if (aqi <= 50) return 0x00ff88;
        if (aqi <= 100) return 0xffff00;
        if (aqi <= 150) return 0xff8800;
        if (aqi <= 200) return 0xff0000;
        if (aqi <= 300) return 0x8800ff;
        return 0x800000;
      };

      // Create main AQI bar
      const aqiHeight = Math.max(0.1, city.current.aqi / 50);
      const barGeometry = new THREE.BoxGeometry(barWidth, aqiHeight, barWidth);
      const barMaterial = new THREE.MeshLambertMaterial({ 
        color: getAQIColor(city.current.aqi),
        emissive: getAQIColor(city.current.aqi),
        emissiveIntensity: 0.2
      });
      
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.set(x, aqiHeight / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;
      bar.userData = { city: city.location.name, aqi: city.current.aqi };
      barGroup.add(bar);

      // Create smaller bars for other metrics
      const metrics = [
        { value: city.current.pm25, color: 0xff8800, name: 'PM2.5' },
        { value: city.current.pm10, color: 0xff0080, name: 'PM10' },
        { value: city.current.no2, color: 0x0080ff, name: 'NO₂' },
        { value: city.current.o3, color: 0x8000ff, name: 'O₃' }
      ];

      metrics.forEach((metric, metricIndex) => {
        const metricHeight = Math.max(0.05, metric.value / 100);
        const metricGeometry = new THREE.BoxGeometry(barWidth * 0.3, metricHeight, barWidth * 0.3);
        const metricMaterial = new THREE.MeshLambertMaterial({ 
          color: metric.color,
          emissive: metric.color,
          emissiveIntensity: 0.1
        });
        
        const metricBar = new THREE.Mesh(metricGeometry, metricMaterial);
        metricBar.position.set(
          x + (metricIndex - 1.5) * barWidth * 0.4, 
          metricHeight / 2, 
          barWidth * 0.6
        );
        metricBar.castShadow = true;
        metricBar.receiveShadow = true;
        barGroup.add(metricBar);
      });

      // Add city label (as a plane with text texture)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, 256, 64);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(city.location.name, 128, 35);
      
      const labelTexture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: labelTexture, 
        transparent: true,
        alphaTest: 0.1
      });
      
      const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.set(x, -1.5, 0);
      label.lookAt(camera.position);
      barGroup.add(label);
    });

    scene.add(barGroup);

    // Add grid
    const gridGeometry = new THREE.PlaneGeometry(20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.1,
      wireframe: true
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -0.1;
    scene.add(grid);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate the entire bar group slowly
      barGroup.rotation.y += 0.005;
      
      // Animate individual bars
      barGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
          // Pulsing effect
          const pulse = 1 + Math.sin(Date.now() * 0.001 + index) * 0.1;
          child.scale.y = pulse;
          
          // Slight rotation
          child.rotation.y += 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-dark/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-400 font-rajdhani">Loading 3D Data Visualization...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
      
      {/* Legend */}
      <motion.div
        className="absolute bottom-4 left-4 glass-panel rounded-lg p-4 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="font-orbitron font-semibold mb-3 text-gradient">Air Quality Metrics</h4>
        <div className="space-y-2 text-sm">
          {[
            { color: '#00ff88', label: 'AQI - Main Bar' },
            { color: '#ff8800', label: 'PM2.5' },
            { color: '#ff0080', label: 'PM10' },
            { color: '#0080ff', label: 'NO₂' },
            { color: '#8000ff', label: 'O₃' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DataVisualization3D;
