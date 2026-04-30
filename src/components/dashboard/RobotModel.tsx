import React, { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Robot rig — based on visual inspection of the GLB.
 *
 * The arm has TWO bolted disc motors. Both discs have their faces pointing
 * along the X axis (we see them from the side), so both rotations are PITCH
 * around the X axis. The base turntable is unpowered and stays still.
 *
 *   STATIC  : Node1 (base + turntable) + Node2 (shoulder block w/ Disc 1 housing)
 *   JOINT 1 : pitch around X at the shoulder disc center (Motor 1)
 *             carries Node3 (upper arm) + Node4 (elbow housing w/ Disc 2 housing)
 *   JOINT 2 : pitch around X at the elbow disc center (Motor 2)
 *             carries Node5..Node9 (forearm + wrist + gripper)
 *
 * Each joint group uses the "translate-rotate-translate-back" trick so the
 * rotation pivots at the disc center instead of the world origin. The X
 * coordinate of the pivot is irrelevant for an X-axis rotation, so we just
 * pick the model's mid-X for clarity.
 */

const SHOULDER_PIVOT: [number, number, number] = [16, 22, 18] // Disc 1 center
const ELBOW_PIVOT: [number, number, number] = [16, 42, 23]    // Disc 2 center

function Model({ latestData, ...props }: any) {
  const { nodes } = useGLTF('/robot.glb') as any
  const joint1Ref = useRef<THREE.Group>(null!)
  const joint2Ref = useRef<THREE.Group>(null!)

  // One material per motor housing so heat color is per-motor.
  const matMotor1 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#02D6A3', metalness: 0.85, roughness: 0.2 }),
    [],
  )
  const matMotor2 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#02D6A3', metalness: 0.85, roughness: 0.2 }),
    [],
  )
  // Plain link material (everything else).
  const matLink = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#02D6A3', metalness: 0.8, roughness: 0.25 }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Autonomous mockup pitch. Different periods + phase offset so they don't
    // move in lockstep.
    if (joint1Ref.current) {
      joint1Ref.current.rotation.x = Math.sin(t * 0.6) * 0.5        // ≈ ±29°
    }
    if (joint2Ref.current) {
      joint2Ref.current.rotation.x = Math.sin(t * 0.9 + 1.2) * 0.7  // ≈ ±40°
    }

    // Heat visualization on the motor housings.
    if (!latestData) return
    const tempToVisual = (temp: number) => {
      const ratio = Math.min(Math.max((temp - 30) / 15, 0), 1)
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#02D6A3'),
        new THREE.Color('#ef4444'),
        ratio,
      )
      return { color, intensity: ratio * 0.6 }
    }
    const v1 = tempToVisual(latestData.m1_temp ?? 30)
    const v2 = tempToVisual(latestData.m2_temp ?? 25)
    matMotor1.color.copy(v1.color)
    matMotor1.emissive.copy(v1.color)
    matMotor1.emissiveIntensity = v1.intensity
    matMotor2.color.copy(v2.color)
    matMotor2.emissive.copy(v2.color)
    matMotor2.emissiveIntensity = v2.intensity
  })

  return (
    <group {...props} dispose={null}>
      {/* STATIC: base + turntable + shoulder block (Disc 1 housing baked in) */}
      <mesh geometry={nodes.Node1.geometry} material={matLink} castShadow receiveShadow />
      <mesh geometry={nodes.Node2.geometry} material={matMotor1} castShadow receiveShadow />

      {/* JOINT 1 (Motor 1) — pitch around X at the shoulder disc */}
      <group ref={joint1Ref} position={SHOULDER_PIVOT}>
        <group position={[-SHOULDER_PIVOT[0], -SHOULDER_PIVOT[1], -SHOULDER_PIVOT[2]]}>
          <mesh geometry={nodes.Node3.geometry} material={matLink} castShadow receiveShadow />
          <mesh geometry={nodes.Node4.geometry} material={matMotor2} castShadow receiveShadow />

          {/* JOINT 2 (Motor 2) — pitch around X at the elbow disc */}
          <group ref={joint2Ref} position={ELBOW_PIVOT}>
            <group position={[-ELBOW_PIVOT[0], -ELBOW_PIVOT[1], -ELBOW_PIVOT[2]]}>
              <mesh geometry={nodes.Node5.geometry} material={matLink} castShadow receiveShadow />
              <mesh geometry={nodes.Node6.geometry} material={matLink} castShadow receiveShadow />
              <mesh geometry={nodes.Node7.geometry} material={matLink} castShadow receiveShadow />
              <mesh geometry={nodes.Node8.geometry} material={matLink} castShadow receiveShadow />
              <mesh geometry={nodes.Node9.geometry} material={matLink} castShadow receiveShadow />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

export default function RobotModel({ latestData }: any) {
  return (
    <div className="w-full h-full min-h-[500px] bg-[#1a1c23]/50 rounded-2xl overflow-hidden border border-white/5 relative shadow-2xl">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#02D6A3] animate-pulse" />
          Real-time Digital Twin
        </h3>
        <div className="mt-2 flex gap-4">
          <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-md">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Motor 1 (Shoulder)</p>
            <p className="text-[#02D6A3] text-sm font-mono">{latestData?.m1_temp?.toFixed(1) || '0.0'}°C</p>
          </div>
          <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-md">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Motor 2 (Elbow)</p>
            <p className="text-[#02D6A3] text-sm font-mono">{latestData?.m2_temp?.toFixed(1) || '0.0'}°C</p>
          </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [60, 45, 60], fov: 35 }}>
        <Suspense fallback={null}>
          <OrbitControls makeDefault minDistance={20} maxDistance={150} />

          <ambientLight intensity={0.7} />
          <spotLight position={[40, 60, 40]} angle={0.25} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-40, -20, -40]} intensity={1} />

          <Center top>
            <Model latestData={latestData} />
          </Center>

          <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={80} blur={2} far={10} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/robot.glb')
