import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Page() {
  const { data: makes, error } = await supabase
    .from('make')
    .select('*')
    .order('make')

  if (error) {
    console.error(error)
  }

  return (
    <main>
      <div className="flex flex-wrap gap-4">
        {makes?.map((make) => (
          <Link
            key={make.id}
            href={`/makes/${make.id}`}
            className="rounded-lg bg-zinc-800 px-6 py-3 text-white font-semibold transition-all hover:bg-zinc-700 hover:scale-105 active:scale-95"
          >
            {make.make}
          </Link>
        ))}
      </div>
    </main>
  )
}