import ModelUploader from "@/components/ModelUploader"
import CarTable from "@/components/CarTable"

export default function Page() {
  return (
    <main className="w-full min-w-0">
      <ModelUploader />

      <div className="h-6" />

      <div className="w-full min-w-0 overflow-x-auto">
        <CarTable />
      </div>
    </main>
  )
}