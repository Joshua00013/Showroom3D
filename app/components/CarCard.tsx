'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CarCard({ car }: { car: any }) {
  const router = useRouter()
  const photoUrl = car.photo_path
    ? supabase.storage
        .from('CarModels')
        .getPublicUrl(car.photo_path).data.publicUrl
    : ''

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

      <img
        src={photoUrl}
        alt={car.car_name}
        className="h-48 w-full object-cover"
      />

      <div className="p-4 space-y-1">
        <h2 className="text-lg font-bold text-black">{car.car_name}</h2>

        <p className="text-sm text-gray-500">
          {car.car_make} • {car.car_model}
        </p>

        <button
          onClick={() => router.push(`/car/${car.id}`)}
          className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          View 3D Model
        </button>
      </div>
    </div>
  )
}