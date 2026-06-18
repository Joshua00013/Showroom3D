'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

export default function CarUploader() {
  const [car_name, setCarName] = useState('')
  const [car_model, setCarModel] = useState('')
  const [car_make, setCarMake] = useState('')

  const [glbFile, setGlbFile] = useState<File | null>(null)
  const [pngFile, setPngFile] = useState<File | null>(null)

  // GLB drop
  const { getRootProps: glbRoot, getInputProps: glbInput } = useDropzone({
    onDrop: (files) => setGlbFile(files[0]),
    accept: { 'model/gltf-binary': ['.glb'] },
    multiple: false,
  })

  // PNG drop
  const { getRootProps: pngRoot, getInputProps: pngInput } = useDropzone({
    onDrop: (files) => setPngFile(files[0]),
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: false,
  })

  const upload = async () => {
    if (!glbFile || !pngFile) {
      alert('Missing files')
      return
    }

    const id = Date.now()

    const glbName = `${id}-${glbFile.name}`
    const pngName = `${id}-${pngFile.name}`

    // Upload GLB
    const { error: glbError } = await supabase.storage
      .from('CarModels')
      .upload(glbName, glbFile)

    if (glbError) {
      console.error(glbError)
      return
    }

    // Upload PNG
    const { error: pngError } = await supabase.storage
      .from('CarModels')
      .upload(pngName, pngFile)

    if (pngError) {
      console.error(pngError)
      return
    }

    // -----------------------------
    // SAVE ONLY PATHS (IMPORTANT)
    // -----------------------------
    const model_path = glbName
    const photo_path = pngName

    // INSERT INTO DB
    const { error: dbError } = await supabase
      .from('cars')
      .insert({
        car_name,
        car_model,
        car_make,
        model_path,
        photo_path,
      })

    if (dbError) {
      console.error(dbError)
      return
    }

    alert('Car uploaded successfully!')
  }

  return (
    <div className="mx-auto space-y-4 flex flex-col">
        <h1 className="text-center text-xl">Upload Car Model</h1>
      <input
        placeholder="Car Name"
        onChange={(e) => setCarName(e.target.value)}
      />

      <input
        placeholder="Car Model"
        onChange={(e) => setCarModel(e.target.value)}
      />

      <input
        placeholder="Car Make"
        onChange={(e) => setCarMake(e.target.value)}
      />

      {/* GLB */}
      <div {...glbRoot()} style={{ border: '2px dashed gray', padding: 20 }}>
        <input {...glbInput()} />
        {glbFile ? glbFile.name : 'Drop GLB file here'}
      </div>

      {/* PNG */}
      <div {...pngRoot()} style={{ border: '2px dashed gray', padding: 20 }}>
        <input {...pngInput()} />
        {pngFile ? pngFile.name : 'Drop PNG file here'}
      </div>

      <button onClick={upload} style={{ padding: 10 }}>
        Upload Car
      </button>
    </div>
  )
}