import ModelUploader from '../components/ModelUploader'
import AdminCarGrid from '../components/AdminCarGrid'
export default function Home() {
  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ModelUploader />
        <AdminCarGrid/>
      </div>
    </main>
  )
}