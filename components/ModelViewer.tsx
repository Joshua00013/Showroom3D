'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { supabase } from '@/lib/supabase'
import Model from './Model'
import ModelBackground from './ModelBackground'

type Props = {
  path: string
  color: string
}

export default function ModelViewer({ path, color }: Props) {

  const modelUrl = supabase.storage
    .from('CarModels')
    .getPublicUrl(path).data.publicUrl

  return (
    <Canvas 
    camera={{ 
        position: [0, 2, 4],
        fov: 90,
        near: 0.1,
        far: 1000

        }}>

      <Model url={modelUrl} color={color} />
      <ModelBackground/>

      <Environment preset="city" />

      {/* camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 2.4}
      />

    </Canvas>
  )
}