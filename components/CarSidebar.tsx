'use client'

import { useRouter } from 'next/navigation'

interface CarSidebarProps {
  id: string
  car: any
  color: string
  setColor: (color: string) => void
  currentView: 'interior' | 'exterior'
}

export default function CarSidebar({
  id,
  car,
  color,
  setColor,
  currentView,
}: CarSidebarProps) {
  const router = useRouter()

  return (
    <div
    className="
        absolute
        top-0
        right-0
        h-screen
        w-80
        bg-linear-to-b
        from-white/10
        via-black/40
        to-black/70
        backdrop-blur-xl
        border-l border-white/10
        shadow-2xl
        text-white
        flex
        flex-col
        px-8
        py-10
    "
    >

    {/* Price */}
    <div className="text-center">
        <h2 className="text-4xl font-light tracking-wide">
        ₱ {car.price.toLocaleString()}
        </h2>
    </div>

    {/* Interior / Exterior */}
    <div className="mt-6 flex rounded-lg bg-white/10 p-1">
    <button
        onClick={() => router.push(`/car/${id}/interior`)}
        className={`flex-1 rounded-md py-2 text-xs transition ${
        currentView === 'interior'
            ? 'bg-white font-medium text-black'
            : 'text-gray-300'
        }`}
    >
        Interior
    </button>

    <button
        onClick={() => router.push(`/car/${id}`)}
        className={`flex-1 rounded-md py-2 text-xs transition ${
        currentView === 'exterior'
            ? 'bg-white font-medium text-black'
            : 'text-gray-300'
        }`}
    >
        Exterior
    </button>
    </div>

    {/* Specs */}
    <div className="mt-8 grid grid-cols-2 gap-y-8 text-center">

        <div>
        <p className="text-2xl font-semibold">
            {car.engine_power} hp
        </p>
        <p className="text-xs text-gray-400">
            Engine Power
        </p>
        </div>

        <div>
        <p className="text-2xl font-semibold">
            {car.engine_capacity} L
        </p>
        <p className="text-xs text-gray-400">
            Engine Capacity
        </p>
        </div>

        <div>
        <p className="text-2xl font-semibold">
            {car.max_speed} km/h
        </p>
        <p className="text-xs text-gray-400">
            Max Speed
        </p>
        </div>

        <div>
        <p className="text-2xl font-semibold">
            {car.engine_torque} Nm
        </p>
        <p className="text-xs text-gray-400">
            Engine Torque
        </p>
        </div>

    </div>

    {/* Acceleration */}
    <div className="mt-10 text-center">
        <p className="text-3xl font-semibold">
        0–100 km/h
        </p>
        <p className="text-sm text-gray-400">
        {car.acceleration} seconds
        </p>
    </div>

    {/* Color Picker */}
    <div className="mt-10 flex justify-center">

    <div className="flex justify-center gap-3 flex-wrap">
        {car.colors?.map((c: any) => (
        <button
            key={c.id}
            onClick={() => setColor(c.hex_code)}
            className={`h-10 w-10 rounded-full border-4 transition ${
            color === c.hex_code
                ? "border-white scale-110"
                : "border-gray-500"
            }`}
            style={{ backgroundColor: c.hex_code }}
        />
        ))}
    </div>

    </div>

    {/* Button */}
    <button
        className="mt-10 w-full rounded-md bg-white py-3
        text-sm font-semibold text-black transition hover:bg-gray-200"
    >
        VIEW PRICE
    </button>

    </div>
  )
}

