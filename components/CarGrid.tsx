'use client'

import CarCard from './CarCard'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Car = {
  id: number
  car_name: string
  car_model: string
  make_id: number
  photo_path: string
  model_path: string
  make: {
    make: string
    logo_path: string
  }
}

type CarGridProps = {
  makeId: number
}

export default function CarGrid({ makeId }: CarGridProps) {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          make (
            make,
            logo_path
          )
        `)
        .eq('make_id', makeId)

      if (error) {
        console.error(error)
        return
      }

      setCars(data || [])
    }

    fetchCars()
  }, [makeId])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}