"use client"
import { useRouter } from 'next/navigation'
import { Shield, User } from 'lucide-react'

export default function Page() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center gap-8">
      <div
        className="group w-72 cursor-pointer"
        onClick={() => router.push('/admin')}
      >
        <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
          <Shield className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-2xl font-semibold">Admin</span>
        </div>
      </div>

      <div
        className="group w-72 cursor-pointer"
        onClick={() => router.push('/makes')}
      >
        <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
          <User className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-2xl font-semibold">User</span>
        </div>
      </div>
    </div>
  )
}