"use client"
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <>
    <div className='mx-auto flex space-x-20 items-center pt-20 text-4xl'>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
      <button onClick={() => router.push('/cars')}>View Cars</button>
    </div>

    </>
  )
}