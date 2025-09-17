import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreePill: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    camera?: THREE.PerspectiveCamera;
    pill?: THREE.Group;
    animationId?: number;
    cleanup?: () => void;
  }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setClearColor(0x000000, 0);
    
    mount.appendChild(renderer.domElement);

    // Create scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      34, 
      mount.clientWidth / mount.clientHeight, 
      0.1, 
      100
    );
    camera.position.set(0.6, 1.3, 7);

    // Add lights
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0e1624, 0.9);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3.5, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.setScalar(2048);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9ac4ff, 0.55);
    rimLight.position.set(-4.5, 5, -3);
    scene.add(rimLight);

    // Create pill
    const pill = new THREE.Group();
    scene.add(pill);

    const BASE_Y = 1.05;
    pill.position.set(0, BASE_Y, 0);

    // Materials
    const topColor = 0xEAF2F9;
    const bottomColor = 0x0fa37b;
    
    const matTop = new THREE.MeshPhysicalMaterial({ 
      color: topColor, 
      roughness: 0.26, 
      clearcoat: 1.0, 
      clearcoatRoughness: 0.12 
    });
    
    const matBottom = new THREE.MeshPhysicalMaterial({ 
      color: bottomColor, 
      roughness: 0.32, 
      clearcoat: 0.9, 
      clearcoatRoughness: 0.14 
    });
    
    const matBlack = new THREE.MeshPhysicalMaterial({ 
      color: 0x0f1113, 
      roughness: 0.45 
    });

    // Create pill body
    const R = 0.58;
    const H = 1.65;
    
    const topGroup = new THREE.Group();
    const bottomGroup = new THREE.Group();

    const topCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R, H/2, 64, 1), 
      matTop
    );
    topCylinder.position.y = H/4;
    topCylinder.castShadow = true;

    const topHemisphere = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 48), 
      matTop
    );
    topHemisphere.position.y = H/2 + 0.0001;
    topHemisphere.castShadow = true;

    const bottomCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R, H/2, 64, 1), 
      matBottom
    );
    bottomCylinder.position.y = -H/4;
    bottomCylinder.castShadow = true;

    const bottomHemisphere = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 48), 
      matBottom
    );
    bottomHemisphere.position.y = -H/2 - 0.0001;
    bottomHemisphere.castShadow = true;

    topGroup.add(topCylinder, topHemisphere);
    bottomGroup.add(bottomCylinder, bottomHemisphere);
    
    const body = new THREE.Group();
    body.add(topGroup, bottomGroup);
    pill.add(body);

    // Create seam ring
    const seam = new THREE.Mesh(
      new THREE.TorusGeometry(R * 0.99, 0.009, 12, 64),
      new THREE.MeshStandardMaterial({ 
        color: 0x1e2430, 
        roughness: 0.7, 
        metalness: 0.15 
      })
    );
    seam.rotation.x = Math.PI / 2;
    seam.position.y = 0;
    pill.add(seam);

    // Create face
    const face = new THREE.Group();
    face.position.set(0, 0.25, R + 0.01);
    pill.add(face);

    // Create eyes
    const createEyeWindow = (x: number) => {
      const group = new THREE.Group();
      const eye = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.11, 0.49, 8, 16), 
        matBlack
      );
      eye.scale.set(0.98, 1.0, 0.98);
      group.add(eye);
      group.position.set(x, 0.36, 0.0);
      return { group, eye };
    };

    const leftEye = createEyeWindow(-0.19);
    const rightEye = createEyeWindow(0.19);
    face.add(leftEye.group, rightEye.group);

    // Create mouth
    const createRoundedRectShape = (width: number, height: number, radius: number) => {
      const shape = new THREE.Shape();
      const hw = width / 2;
      const hh = height / 2;
      
      shape.absarc(-hw + radius, -hh + radius, radius, Math.PI, Math.PI * 1.5);
      shape.absarc(hw - radius, -hh + radius, radius, Math.PI * 1.5, 0);
      shape.absarc(hw - radius, hh - radius, radius, 0, Math.PI / 2);
      shape.absarc(-hw + radius, hh - radius, radius, Math.PI / 2, Math.PI);
      shape.closePath();
      
      return shape;
    };

    const mouth = new THREE.Mesh(
      new THREE.ExtrudeGeometry(
        createRoundedRectShape(0.12, 0.05, 0.025),
        { 
          depth: 0.025, 
          bevelEnabled: true, 
          bevelSize: 0.0035, 
          bevelThickness: 0.0035, 
          bevelSegments: 2 
        }
      ),
      matBlack
    );
    mouth.position.set(0, -0.10, 0.012);
    face.add(mouth);

    // Blinking animation
    const blinkOnce = () => {
      const lids = [leftEye.group, rightEye.group];
      lids.forEach(lid => lid.scale.y = 0.18); // close eyes
      
      setTimeout(() => {
        lids.forEach(lid => lid.scale.y = 1.0); // open eyes
        setTimeout(blinkOnce, 1400 + Math.random() * 2200);
      }, 120);
    };

    setTimeout(blinkOnce, 800);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      pill.rotation.y = x * 0.22;
      pill.rotation.x = y * 0.12;
    };

    mount.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const t0 = performance.now();
    const animate = () => {
      const t = (performance.now() - t0) / 1000;
      
      // Idle floating animation
      const idleBob = Math.sin(t * 1.05) * 0.06;
      const sway = Math.sin(t * 1.6) * 0.02;
      
      pill.position.y = BASE_Y + idleBob;
      pill.rotation.z = sway;
      
      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mount) return;
      
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store references for cleanup
    sceneRef.current = {
      scene,
      renderer,
      camera,
      pill,
      cleanup: () => {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        mount.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };

    return () => {
      if (sceneRef.current.cleanup) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-10"
      style={{ 
        width: '100%', 
        height: '100%',
        pointerEvents: 'auto'
      }}
    />
  );
};

export default ThreePill;