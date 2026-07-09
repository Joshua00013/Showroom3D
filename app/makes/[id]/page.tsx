import CarGrid from '@/app/components/CarGrid'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main>
      <CarGrid makeId={Number(id)} />
    </main>
  )
}