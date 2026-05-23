"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";

function LogoModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <primitive ref={ref} object={scene} scale={2.2} />
    </Float>
  );
}

function FallbackMark() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src="/aws-upb-logo.svg"
        alt="AWS Student Builder Group UPB"
        width={240}
        height={240}
        className="opacity-90"
      />
    </div>
  );
}

export default function LogoCanvas({ glbPath }: { glbPath?: string }) {
  if (!glbPath) {
    return <FallbackMark />;
  }

  return (
    <div className="w-full h-full">
      <Suspense fallback={<FallbackMark />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} color="#5cf2c8" intensity={0.8} />
          <Environment preset="city" />
          <LogoModel url={glbPath} />
        </Canvas>
      </Suspense>
    </div>
  );
}
