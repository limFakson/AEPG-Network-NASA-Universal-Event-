import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AirQualityData, GlobePoint } from '../../types';

interface GlobeVisualizationProps {
  points: GlobePoint[];
  selectedLocation: AirQualityData;
  onLocationClick: (location: AirQualityData) => void;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  points,
  selectedLocation,
  onLocationClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const animationRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, // Reduced FOV for better view
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);

    // Renderer setup with optimized settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for better performance
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(1); // Fixed pixel ratio for better performance
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
    controlsRef.current = controls;

    // Create Earth with optimized geometry
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    // Create a simple, efficient Earth material without texture
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb, // Ocean blue
      shininess: 100,
      specular: 0x222222,
      transparent: false,
      opacity: 1.0
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);

    // Add atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add point cloud for air quality data
    const pointGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const pointMaterials: { [key: string]: THREE.Material } = {};
    
    // Create materials for different AQI levels
    const colors = ['#00ff88', '#ffff00', '#ff8800', '#ff0000', '#8800ff', '#800000'];
    colors.forEach(color => {
      pointMaterials[color] = new THREE.MeshBasicMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
      });
    });

    const pointCloud = new THREE.Group();
    scene.add(pointCloud);

    // Simplified lighting for better performance
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Add simplified stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 200; // Reduced for better performance
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Position stars on a sphere with radius 3
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate Earth
      earth.rotation.y += 0.001;
      
      // Rotate atmosphere
      atmosphere.rotation.y += 0.002;
      
      // Rotate stars
      stars.rotation.y += 0.0005;
      
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Update points when data changes
    const updatePoints = () => {
      // Clear existing points
      pointCloud.clear();
      
      points.forEach(point => {
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterials[point.color] || pointMaterials['#00ff88']);
        
        // Convert lat/lng to 3D coordinates
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lng + 180) * (Math.PI / 180);
        
        const x = -(1 + point.size * 0.1) * Math.sin(phi) * Math.cos(theta);
        const y = (1 + point.size * 0.1) * Math.cos(phi);
        const z = (1 + point.size * 0.1) * Math.sin(phi) * Math.sin(theta);
        
        pointMesh.position.set(x, y, z);
        pointMesh.userData = { location: point.location, aqi: point.aqi };
        
        // Add hover effect
        pointMesh.scale.setScalar(1);
        
        pointCloud.add(pointMesh);
      });
    };

    updatePoints();

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

    // Handle clicks
    const handleClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(pointCloud.children);
      
      if (intersects.length > 0) {
        const clickedPoint = intersects[0].object;
        // Find the corresponding location data
        const locationData = points.find(p => p.location === clickedPoint.userData.location);
        if (locationData) {
          // Find the full location data from mock data
          // This is a simplified approach - in a real app you'd have better data mapping
          console.log('Clicked location:', locationData.location);
        }
      }
    };

    mountRef.current.addEventListener('click', handleClick);

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
  }, [points]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-dark/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-400 font-rajdhani">Loading Earth...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: '300px', maxHeight: '100%' }}
      />
      
      {/* Globe Controls Info */}
      <motion.div
        className="absolute bottom-4 left-4 glass-panel rounded-lg p-3 text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="font-rajdhani">Drag to rotate • Scroll to zoom</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute top-4 right-4 glass-panel rounded-lg p-4 max-w-xs"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h4 className="font-orbitron font-semibold mb-3 text-gradient">Air Quality Index</h4>
        <div className="space-y-2 text-sm">
          {[
            { color: '#00ff88', label: 'Good (0-50)' },
            { color: '#ffff00', label: 'Moderate (51-100)' },
            { color: '#ff8800', label: 'Unhealthy for Sensitive (101-150)' },
            { color: '#ff0000', label: 'Unhealthy (151-200)' },
            { color: '#8800ff', label: 'Very Unhealthy (201-300)' },
            { color: '#800000', label: 'Hazardous (301-500)' }
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

export default GlobeVisualization;
