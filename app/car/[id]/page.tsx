'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ModelViewer from '@/app/components/ModelViewer'

export default function CarPage() {
  const { id } = useParams()
  const [car, setCar] = useState<any>(null)
  const [color, setColor] = useState('#ff0000')

  useEffect(() => {
    const fetchCar = async () => {
      const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      setCar(data)
    }

    if (id) fetchCar()
  }, [id])

  if (!car) return <div>Loading...</div>

  return (
    <div className="h-screen w-full relative">
      
      {/* 3D MODEL */}
      <ModelViewer path={car.model_path} color={color} />

      {/* UI overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg">
        <h1 className="text-black font-bold">{car.car_name}</h1>
        <h1 className="text-black">Make: {car.car_make}</h1>
        <h1 className="text-black">Model: {car.car_model}</h1>
        <div className="flex">
          <h1 className="text-black">Color:</h1>
          <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-16 cursor-pointer"
          />
        </div>
        
      </div>

    </div>
  )
}