import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeViewer({ model, location, radius }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      1, 
      10000
    );
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(50, 100, 50);
    scene.add(dirLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(500, 50, 0x1E293B, 0x1E293B);
    scene.add(gridHelper);

    // Temporary placeholder for model
    const geometry = new THREE.BoxGeometry(20, 40, 20);
    const material = new THREE.MeshStandardMaterial({ color: 0x00B8D4 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 20;
    scene.add(cube);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01; // Simple spin for demo
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [model]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
