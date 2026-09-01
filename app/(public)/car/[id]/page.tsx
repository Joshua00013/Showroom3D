'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ModelViewer from '@/components/ModelViewer'
import { useRouter } from "next/navigation";
import CarSidebar from '@/components/CarSidebar'

export default function CarPage() {
  const router = useRouter();
  const { id } = useParams()
  const [car, setCar] = useState<any>(null)
  const [color, setColor] = useState('')

  useEffect(() => {
    const fetchCar = async () => {
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
      console.log(data)

      if (data.colors?.length > 0) {
        setColor(data.colors[0].hex_code)
      }
    }
    if (id) fetchCar()
  }, [id])

  if (!car) return <div>Loading...</div>

  return (
    <div className="h-screen w-full relative">
      
      {/* 3D MODEL */}
        <ModelViewer
          path={car.model_path}
          color={color}
        />

        <CarSidebar
          id={id as string}
          car={car}
          color={color}
          setColor={setColor}
          currentView="exterior"
        />
    </div>
  )
}