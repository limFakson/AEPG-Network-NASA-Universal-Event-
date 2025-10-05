import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface FloatingParticlesProps {
  className?: string;
  count?: number;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  className = "", 
  count = 100 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();

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
    camera.position.set(0, 0, 5);

    // Renderer setup with optimized settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for better performance
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(1); // Fixed pixel ratio for better performance
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);
    const particleSizes = new Float32Array(count);
    const particleVelocities = new Float32Array(count * 3);

    const colors = [
      new THREE.Color(0x00ffff), // Cyan
      new THREE.Color(0x0080ff), // Blue
      new THREE.Color(0x8000ff), // Purple
      new THREE.Color(0xff0080), // Pink
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      const radius = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);
      
      // Random colors
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = colors[colorIndex];
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
      
      // Random sizes
      particleSizes[i] = Math.random() * 2 + 1;
      
      // Random velocities
      particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create connection lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * 6); // 2 points per line
    const lineColors = new Float32Array(count * 6);

    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      const i3 = i * 3;
      
      // Find a nearby particle to connect to
      let nearestIndex = -1;
      let nearestDistance = Infinity;
      
      for (let j = 0; j < count; j++) {
        if (i === j) continue;
        
        const j3 = j * 3;
        const distance = Math.sqrt(
          Math.pow(particlePositions[i3] - particlePositions[j3], 2) +
          Math.pow(particlePositions[i3 + 1] - particlePositions[j3 + 1], 2) +
          Math.pow(particlePositions[i3 + 2] - particlePositions[j3 + 2], 2)
        );
        
        if (distance < nearestDistance && distance < 15) {
          nearestDistance = distance;
          nearestIndex = j;
        }
      }
      
      if (nearestIndex !== -1) {
        const j3 = nearestIndex * 3;
        
        // Line start (current particle)
        linePositions[i6] = particlePositions[i3];
        linePositions[i6 + 1] = particlePositions[i3 + 1];
        linePositions[i6 + 2] = particlePositions[i3 + 2];
        
        // Line end (nearest particle)
        linePositions[i6 + 3] = particlePositions[j3];
        linePositions[i6 + 4] = particlePositions[j3 + 1];
        linePositions[i6 + 5] = particlePositions[j3 + 2];
        
        // Line colors (fade based on distance)
        const opacity = Math.max(0, 1 - nearestDistance / 15);
        lineColors[i6] = particleColors[i3] * opacity;
        lineColors[i6 + 1] = particleColors[i3 + 1] * opacity;
        lineColors[i6 + 2] = particleColors[i3 + 2] * opacity;
        lineColors[i6 + 3] = particleColors[j3] * opacity;
        lineColors[i6 + 4] = particleColors[j3 + 1] * opacity;
        lineColors[i6 + 5] = particleColors[j3 + 2] * opacity;
      }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.3,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Update particle positions
      const positions = particles.geometry.attributes.position.array as Float32Array;
      const linePos = lines.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Update position
        positions[i3] += particleVelocities[i3];
        positions[i3 + 1] += particleVelocities[i3 + 1];
        positions[i3 + 2] += particleVelocities[i3 + 2];
        
        // Update line positions
        linePos[i3] = positions[i3];
        linePos[i3 + 1] = positions[i3 + 1];
        linePos[i3 + 2] = positions[i3 + 2];
        
        // Wrap around if particles go too far
        const distance = Math.sqrt(
          positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
        );
        
        if (distance > 50) {
          // Reset to center with random direction
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const radius = 10 + Math.random() * 5;
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);
        }
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.position.needsUpdate = true;
      
      // Rotate the entire system slowly
      particles.rotation.y += 0.0005;
      lines.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
    };

    animate();

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
  }, [count]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
};

export default FloatingParticles;
