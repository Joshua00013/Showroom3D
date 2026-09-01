'use client'

import { useGLTF } from '@react-three/drei'

export default function Model() {
  const { scene } = useGLTF('/showroom_full.glb')

  return <primitive object={scene} />
}