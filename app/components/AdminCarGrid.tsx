'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Car = {
  id: number
  car_name: string
  car_model: string
  car_make: string
  photo_path: string
  model_path: string
}

export default function CarGrid() {
  const [cars, setCars] = useState<Car[]>([])

  // ---------------- FETCH ----------------
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

  useEffect(() => {
    fetchCars()
  }, [])

  // ---------------- DELETE (PATH VERSION) ----------------
  const deleteCar = async (car: Car) => {
    try {
      if (!car?.id) {
        console.error('Invalid car:', car)
        return
      }

      // -------------------------
      // DELETE MODEL FILE
      // -------------------------
      if (car.model_path) {
        const { error: modelError } = await supabase.storage
          .from('CarModels')
          .remove([car.model_path])

        if (modelError) {
          console.error('Model delete error:', modelError)
        }
      }

      // -------------------------
      // DELETE IMAGE FILE
      // -------------------------
      if (car.photo_path) {
        const { error: photoError } = await supabase.storage
          .from('CarModels')
          .remove([car.photo_path])

        if (photoError) {
          console.error('Photo delete error:', photoError)
        }
      }

      // -------------------------
      // DELETE DATABASE ROW
      // -------------------------
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', car.id)

      if (error) {
        console.error('DB delete error:', error)
        return
      }

      // -------------------------
      // UPDATE UI
      // -------------------------
      setCars((prev) => prev.filter((c) => c.id !== car.id))

      console.log('Deleted car fully:', car.id)

    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  // ---------------- UPDATE ----------------
  const updateCar = async (car: Car) => {
    const newName = prompt('New name', car.car_name)
    const newModel = prompt('New model', car.car_model)
    const newMake = prompt('New make', car.car_make)

    if (!newName || !newModel || !newMake) return

    const { error } = await supabase
      .from('cars')
      .update({
        car_name: newName,
        car_model: newModel,
        car_make: newMake,
      })
      .eq('id', car.id)

    if (error) {
      console.error(error)
      return
    }

    fetchCars()
  }

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">

      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-white rounded-2xl shadow overflow-hidden"
        >

          <img
            src={car.photo_path
              ? supabase.storage.from('CarModels').getPublicUrl(car.photo_path).data.publicUrl
              : ''
            }
            className="h-44 w-full object-cover"
          />

          <div className="p-4 space-y-2">

            <h2 className="text-lg font-bold text-black">
              {car.car_name}
            </h2>

            <p className="text-sm text-gray-500">
              {car.car_make} • {car.car_model}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => deleteCar(car)}
                className="flex-1 bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      ))}

    </div>
  )
}