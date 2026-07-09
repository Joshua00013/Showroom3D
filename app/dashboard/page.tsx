import ModelUploader from '../components/ModelUploader'
import AdminCarGrid from '../components/AdminCarGrid'
import MakeManager from '../components/MakeManager'
export default function Home() {
  return (
    <main>
      <div className='grid grid-cols-2 gap-1'>
        <ModelUploader />
        <MakeManager/>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AdminCarGrid/>
      </div>
    </main>
  )
}