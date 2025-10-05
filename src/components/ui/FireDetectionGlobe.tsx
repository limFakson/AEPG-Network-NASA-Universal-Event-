import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { nasaApi, processFireDataForGlobe, FireDetection } from '../../data/nasaApi';

interface FireDetectionGlobeProps {
  className?: string;
}

const FireDetectionGlobe: React.FC<FireDetectionGlobeProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const animationRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [fireData, setFireData] = useState<FireDetection[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireDetection | null>(null);

  useEffect(() => {
    // Fetch fire detection data
    const fetchFireData = async () => {
      try {
        const data = await nasaApi.getFireDetections();
        setFireData(data);
      } catch (error) {
        console.error('Failed to fetch fire data:', error);
      }
    };

    fetchFireData();
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 4;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
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
      color: 0x00aaff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Add stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 300;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
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

    // Fire detection points group
    const firePointsGroup = new THREE.Group();
    scene.add(firePointsGroup);

    // Update fire points when data changes
    const updateFirePoints = () => {
      firePointsGroup.clear();
      
      const firePoints = processFireDataForGlobe(fireData);
      
      firePoints.forEach((fire, index) => {
        const pointGeometry = new THREE.SphereGeometry(0.03, 12, 12);
        const pointMaterial = new THREE.MeshBasicMaterial({ 
          color: fire.color,
          emissive: fire.color,
          emissiveIntensity: 0.5
        });
        
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
        
        // Convert lat/lng to 3D coordinates
        const phi = (90 - fire.lat) * (Math.PI / 180);
        const theta = (fire.lng + 180) * (Math.PI / 180);
        
        const x = -(1 + fire.size * 0.1) * Math.sin(phi) * Math.cos(theta);
        const y = (1 + fire.size * 0.1) * Math.cos(phi);
        const z = (1 + fire.size * 0.1) * Math.sin(phi) * Math.sin(theta);
        
        pointMesh.position.set(x, y, z);
        pointMesh.userData = { 
          fire: fireData[index], 
          confidence: fire.confidence,
          satellite: fire.satellite 
        };
        
        // Add pulsing animation
        pointMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + index) * 0.3);
        
        firePointsGroup.add(pointMesh);
      });
    };

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate Earth
      earth.rotation.y += 0.002;
      atmosphere.rotation.y += 0.005;
      stars.rotation.y += 0.0002;
      
      // Update fire points
      updateFirePoints();
      
      // Animate fire points
      firePointsGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + index) * 0.3);
        }
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

    // Handle clicks
    const handleClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(firePointsGroup.children);
      
      if (intersects.length > 0) {
        const clickedPoint = intersects[0].object;
        setSelectedFire(clickedPoint.userData.fire);
      }
    };

    window.addEventListener('resize', handleResize);
    mountRef.current.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('click', handleClick);
        if (renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
    };
  }, [fireData]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-dark/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-400 font-rajdhani">Loading NASA Fire Detection Data...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: '300px', maxHeight: '100%' }}
      />
      
      {/* Fire Detection Legend */}
      <motion.div
        className="absolute top-4 right-4 glass-panel rounded-lg p-4 max-w-xs"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="font-orbitron font-semibold mb-3 text-gradient">Fire Detection</h4>
        <div className="space-y-2 text-sm">
          {[
            { color: '#ff0000', label: 'High Confidence (90%+)' },
            { color: '#ff8800', label: 'Medium-High (70-89%)' },
            { color: '#ffff00', label: 'Medium (50-69%)' },
            { color: '#ff8800', label: 'Low (0-49%)' }
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
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-orbitron font-bold text-red-400">{fireData.length}</div>
            <div className="text-xs text-gray-400 font-rajdhani">Active Fires</div>
          </div>
        </div>
      </motion.div>

      {/* Fire Details Panel */}
      {selectedFire && (
        <motion.div
          className="absolute bottom-4 left-4 glass-panel rounded-lg p-4 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-orbitron font-semibold text-white">Fire Detection</h4>
            <button 
              onClick={() => setSelectedFire(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Confidence:</span>
              <span className="text-white font-semibold">{selectedFire.confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Satellite:</span>
              <span className="text-white">{selectedFire.satellite}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-white">
                {new Date(selectedFire.acq_datetime).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white">
                {selectedFire.latitude.toFixed(2)}, {selectedFire.longitude.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Day/Night:</span>
              <span className="text-white">{selectedFire.daynight}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        className="absolute bottom-4 right-4 glass-panel rounded-lg p-3 text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <p className="font-rajdhani">Click fire points for details</p>
      </motion.div>
    </div>
  );
};

export default FireDetectionGlobe;
