'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import InteriorViewer from '@/components/InteriorViewer'
import CarSidebar from '@/components/CarSidebar'

export default function InteriorPage() {
  const params = useParams()
  const id = params.id as string

  const [car, setCar] = useState<any>(null)
  const [color, setColor] = useState('')
  const [interiorUrl, setInteriorUrl] = useState('')

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          make (
            make
          ),
          colors (
            id,
            hex_code
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setCar(data)

      if (data.colors?.length > 0) {
        setColor(data.colors[0].hex_code)
      }

      if (data.interior_path) {
        const url = supabase.storage
          .from('CarModels')
          .getPublicUrl(data.interior_path).data.publicUrl

        setInteriorUrl(url)
      }
    }

    if (id) {
      fetchCar()
    }
  }, [id])

  if (!car || !interiorUrl) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative h-screen w-full">
      <InteriorViewer image={interiorUrl} />

      <CarSidebar
        id={id}
        car={car}
        color={color}
        setColor={setColor}
        currentView="interior"
      />
    </div>
  )
}