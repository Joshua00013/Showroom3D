'use client'
import CarCard from './CarCard'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Car = {
  id: number
  car_name: string
  car_model: string
  car_make: string
  photo_url: string
  model_url: string
}

export default function CarGrid() {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')

      if (error) {
        console.error(error)
        return
      }

      setCars(data || [])
    }

    fetchCars()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}