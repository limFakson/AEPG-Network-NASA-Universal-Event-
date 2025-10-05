import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { generateGlobePoints } from '../../data/mockData';

interface LandingGlobeProps {
  className?: string;
}

const LandingGlobe: React.FC<LandingGlobeProps> = ({ className = "" }) => {
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
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, // Reduced FOV for better view
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3.5); // Closer to globe

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
    controls.enableZoom = false; // Disable zoom for landing page
    controls.minDistance = 2.5;
    controls.maxDistance = 4;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.target.set(0, 0, 0); // Ensure target is centered
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

    // Add glowing atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add air quality data points
    const globePoints = generateGlobePoints();
    const pointGeometry = new THREE.SphereGeometry(0.03, 12, 12);
    const pointMaterials: { [key: string]: THREE.Material } = {};
    
    const colors = ['#00ff88', '#ffff00', '#ff8800', '#ff0000', '#8800ff', '#800000'];
    colors.forEach(color => {
      pointMaterials[color] = new THREE.MeshBasicMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.5
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

    // Add simplified starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 500; // Reduced for better performance
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Position stars on a sphere with radius 8
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.0,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add simplified floating particles around Earth
    const particleCount = 30; // Reduced for better performance
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 1.5 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.cos(phi);
      particlePositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      particleVelocities[i3] = (Math.random() - 0.5) * 0.01;
      particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate Earth slowly
      earth.rotation.y += 0.002;
      
      // Rotate atmosphere faster
      atmosphere.rotation.y += 0.005;
      
      // Rotate stars very slowly
      stars.rotation.y += 0.0002;
      
      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += particleVelocities[i3];
        positions[i3 + 1] += particleVelocities[i3 + 1];
        positions[i3 + 2] += particleVelocities[i3 + 2];
        
        // Keep particles within bounds
        const distance = Math.sqrt(
          positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
        );
        if (distance > 2.5) {
          positions[i3] *= 0.9;
          positions[i3 + 1] *= 0.9;
          positions[i3 + 2] *= 0.9;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Update air quality points
      globePoints.forEach((point, index) => {
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterials[point.color] || pointMaterials['#00ff88']);
        
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lng + 180) * (Math.PI / 180);
        
        const x = -(1 + point.size * 0.1) * Math.sin(phi) * Math.cos(theta);
        const y = (1 + point.size * 0.1) * Math.cos(phi);
        const z = (1 + point.size * 0.1) * Math.sin(phi) * Math.sin(theta);
        
        pointMesh.position.set(x, y, z);
        pointMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.001 + index) * 0.3);
        
        if (pointCloud.children[index]) {
          pointCloud.remove(pointCloud.children[index]);
        }
        pointCloud.add(pointMesh);
      });
      
      controls.update();
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
            <p className="text-gray-400 font-rajdhani">Initializing 3D Earth...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: '300px', maxHeight: '100%' }}
      />
      
      {/* Interactive Instructions */}
      <motion.div
        className="absolute bottom-4 left-4 glass-panel rounded-lg p-3 text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <p className="font-rajdhani">Drag to explore Earth • Air quality data points</p>
      </motion.div>

      {/* AQI Legend */}
      <motion.div
        className="absolute top-4 right-4 glass-panel rounded-lg p-4 max-w-xs"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2 }}
      >
        <h4 className="font-orbitron font-semibold mb-3 text-gradient">Live Air Quality</h4>
        <div className="space-y-2 text-sm">
          {[
            { color: '#00ff88', label: 'Good' },
            { color: '#ffff00', label: 'Moderate' },
            { color: '#ff8800', label: 'Unhealthy for Sensitive' },
            { color: '#ff0000', label: 'Unhealthy' },
            { color: '#8800ff', label: 'Very Unhealthy' },
            { color: '#800000', label: 'Hazardous' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full animate-pulse" 
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

export default LandingGlobe;
