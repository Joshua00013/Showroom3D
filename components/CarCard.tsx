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

  const logoUrl = car.make?.logo_path
    ? supabase.storage
        .from('CarModels')
        .getPublicUrl(car.make.logo_path).data.publicUrl
    : ''

  return (
    <div className="relative overflow-visible">
      {/* Floating Logo */}
      {logoUrl && (
        <div className="absolute -top-4 -right-4 z-20 bg-white rounded-xl shadow-lg p-2">
          <img
            src={logoUrl}
            alt={`${car.make?.make} logo`}
            className="w-10 h-10 object-contain"
          />
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={photoUrl}
          alt={car.car_name}
          onClick={() => router.push(`/car/${car.id}`)}
          className="h-52 w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
        />

        <div className="p-4">
          <h2 className="text-lg font-bold text-black">
            {car.car_name}
          </h2>
        </div>
      </div>
    </div>
  )
}