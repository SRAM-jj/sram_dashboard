import React, { Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'

function Model({ latestData, ...props }: any) {
  // nodes를 직접 추출하여 개별 제어 가능하게 합니다.
  const { nodes, materials } = useGLTF('/robot.glb') as any

  // 온도 시각화를 위한 재질 생성 (성능을 위해 useMemo 사용)
  const mat1 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#02D6A3', metalness: 0.8, roughness: 0.2 }), []);
  const mat2 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#02D6A3', metalness: 0.8, roughness: 0.2 }), []);

  useFrame(() => {
    if (!latestData) return;
    const { m1_temp, m2_temp, m1_torque, m2_torque } = latestData;

    // 1. 온도 시각화 로직 (30도 기준 색상 변화)
    const getVisuals = (temp: number) => {
      const ratio = Math.min(Math.max((temp - 30) / 15, 0), 1);
      const color = new THREE.Color().lerpColors(new THREE.Color('#02D6A3'), new THREE.Color('#ef4444'), ratio);
      return { color, intensity: ratio * 0.5 };
    };

    const v1 = getVisuals(m1_temp || 30);
    const v2 = getVisuals(m2_temp || 25);

    mat1.color.copy(v1.color);
    mat1.emissive.copy(v1.color);
    mat1.emissiveIntensity = v1.intensity;

    mat2.color.copy(v2.color);
    mat2.emissive.copy(v2.color);
    mat2.emissiveIntensity = v2.intensity;

    // 2. 실시간 회전 로직 (부품이 흩어지지 않게 nodes 객체 직접 수정)
    // m1_torque와 m2_torque 값을 각도로 환산하여 적용 (lerp로 부드럽게)
    if (nodes.Node2) {
      nodes.Node2.rotation.y = THREE.MathUtils.lerp(nodes.Node2.rotation.y, (m1_torque || 0) * (Math.PI / 180), 0.05);
    }
    if (nodes.Node3) {
      nodes.Node3.rotation.x = THREE.MathUtils.lerp(nodes.Node3.rotation.x, (m2_torque || 0) * (Math.PI / 180), 0.05);
    }
  });

  return (
    <group {...props} dispose={null}>
      {/* 부품들이 흩어지지 않도록 개별 mesh로 나열하고 정의한 재질을 입힙니다.[cite: 1] */}
      <mesh geometry={nodes.Node1.geometry} material={mat1} castShadow receiveShadow />
      <mesh geometry={nodes.Node2.geometry} material={mat1} castShadow receiveShadow />
      <mesh geometry={nodes.Node3.geometry} material={mat2} castShadow receiveShadow />
      <mesh geometry={nodes.Node4.geometry} material={mat1} castShadow receiveShadow />
      <mesh geometry={nodes.Node5.geometry} material={mat2} castShadow receiveShadow />
      <mesh geometry={nodes.Node6.geometry} material={mat2} castShadow receiveShadow />
      <mesh geometry={nodes.Node7.geometry} material={mat2} castShadow receiveShadow />
      <mesh geometry={nodes.Node8.geometry} material={mat2} castShadow receiveShadow />
      <mesh geometry={nodes.Node9.geometry} material={mat2} castShadow receiveShadow />
    </group>
  )
}

export default function RobotModel({ latestData }: any) {
  return (
    <div className="w-full h-full min-h-[500px] bg-[#1a1c23]/50 rounded-2xl overflow-hidden border border-white/5 relative shadow-2xl">
      {/* 상단 오버레이 UI */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#02D6A3] animate-pulse" />
          Real-time Digital Twin
        </h3>
        <div className="mt-2 flex gap-4">
          <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-md">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Motor 1 (Base)</p>
            <p className="text-[#02D6A3] text-sm font-mono">{latestData?.m1_temp?.toFixed(1) || '0.0'}°C</p>
          </div>
          <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-md">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Motor 2 (Arm)</p>
            <p className="text-[#02D6A3] text-sm font-mono">{latestData?.m2_temp?.toFixed(1) || '0.0'}°C</p>
          </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [20, 15, 20], fov: 40 }}>
        <Suspense fallback={null}>
          <OrbitControls makeDefault minDistance={5} maxDistance={50} />

          <ambientLight intensity={0.7} />
          <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-20, -20, -20]} intensity={1} />

          <Center top>
            <Model latestData={latestData} scale={0.5} />
          </Center>

          {/* 바닥 그림자 */}
          <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={30} blur={2} far={4} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/robot.glb')