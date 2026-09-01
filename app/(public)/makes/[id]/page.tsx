import CarGrid from '@/components/CarGrid'
import MakeCard from '@/components/MakeCard'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main>
      <div className='flex justify-center items-center gap-10 pb-10 mt-10'>
        <MakeCard></MakeCard>
      </div>
      <div className = 'px-60'>
        <CarGrid makeId={Number(id)} />
      </div>
    </main>
  )
}