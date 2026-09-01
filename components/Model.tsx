'use client'

import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
  url: string
  color: string
}

export default function Model({ url, color }: Props) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((child: any) => {
      if (!child.isMesh) return

      const material = child.material

      // target BaseColor
      if (material?.name === 'BaseColor') {
        const newMat = material.clone()

        // remove texture influence if it exists
        if (newMat.map) newMat.map = null

        newMat.color = new THREE.Color(color)
        newMat.metalness = 0.9
        newMat.roughness = 0.25
        newMat.needsUpdate = true

        child.material = newMat
      }
    })
  }, [scene, color])

  return <primitive object={scene} />
}