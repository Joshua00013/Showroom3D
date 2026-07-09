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
        .select(`
          *,
          make (
            make
          )
        `)
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
      <div className="absolute top-1/2 right-6 -translate-y-1/2 w-80 rounded-xl bg-white/90 p-6 shadow-xl">
        <div className="mt-4 space-y-2 text-black">
          <p><span className="font-semibold">Make:</span> {car.make.make}</p>
          <p><span className="font-semibold">Model:</span> {car.car_model}</p>
          <p><span className="font-semibold">Price:</span> ₱{car.price.toLocaleString()}</p>
          <p><span className="font-semibold">Engine Power:</span> {car.engine_power} HP</p>
          <p><span className="font-semibold">Engine Capacity:</span> {car.engine_capacity} L</p>
          <p><span className="font-semibold">Max Speed:</span> {car.max_speed} km/h</p>
          <p><span className="font-semibold">Torque:</span> {car.engine_torque} Nm</p>
          <p><span className="font-semibold">0–100 km/h:</span> {car.acceleration} s</p>
        </div>

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