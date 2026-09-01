'use client'

import { useEffect, useRef } from 'react'

interface Props {
  image: string
}

export default function InteriorViewer({ image }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !image) return

    let viewer: any

    async function init() {
      // Dynamically import Marzipano only in the browser
      const Marzipano = (await import('marzipano')).default

      containerRef.current!.innerHTML = ''

      viewer = new Marzipano.Viewer(containerRef.current!)

      const source = Marzipano.ImageUrlSource.fromString(image)

      const geometry = new Marzipano.EquirectGeometry([
        {
          width: 4000,
        },
      ])

      const limiter = Marzipano.RectilinearView.limit.traditional(
        4096,
        (120 * Math.PI) / 180
      )

      const view = new Marzipano.RectilinearView(
        {
          yaw: 0,
          pitch: 0,
          fov: Math.PI, // Wider default view
        },
        limiter
      )

      const scene = viewer.createScene({
        source,
        geometry,
        view,
      })

      scene.switchTo()
    }

    init()

    return () => {
      containerRef.current?.replaceChildren()
    }
  }, [image])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black"
    />
  )
}