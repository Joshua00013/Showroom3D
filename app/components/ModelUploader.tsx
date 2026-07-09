'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

export default function CarUploader() {
  const [car_name, setCarName] = useState('')
  const [car_model, setCarModel] = useState('')
  const [price, setPrice] = useState('')
  const [engine_power, setEnginePower] = useState('')
  const [engine_capacity, setEngineCapacity] = useState('')
  const [max_speed, setMaxSpeed] = useState('')
  const [engine_torque, setEngineTorque] = useState('')
  const [acceleration, setAcceleration] = useState('')

  // Dropdown
  const [makes, setMakes] = useState<any[]>([])
  const [makeId, setMakeId] = useState('')

  const [glbFile, setGlbFile] = useState<File | null>(null)
  const [pngFile, setPngFile] = useState<File | null>(null)

  // Load makes
  useEffect(() => {
    const fetchMakes = async () => {
      const { data, error } = await supabase
        .from('make')
        .select('id, make')
        .order('make')

      if (error) {
        console.error(error)
        return
      }

      setMakes(data ?? [])
    }

    fetchMakes()
  }, [])

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

    if (!makeId) {
      alert('Please select a car make.')
      return
    }

    const id = Date.now()

    const glbName = `${id}-${glbFile.name}`
    const pngName = `${id}-${pngFile.name}`

    const { error: glbError } = await supabase.storage
      .from('CarModels')
      .upload(glbName, glbFile)

    if (glbError) {
      console.error(glbError)
      return
    }

    const { error: pngError } = await supabase.storage
      .from('CarModels')
      .upload(pngName, pngFile)

    if (pngError) {
      console.error(pngError)
      return
    }

    const model_path = glbName
    const photo_path = pngName

    const { error: dbError } = await supabase
      .from('cars')
      .insert({
        car_name,
        car_model,
        make_id: Number(makeId),
        model_path,
        photo_path,
        price: Number(price),
        engine_power: Number(engine_power),
        engine_capacity: Number(engine_capacity),
        max_speed: Number(max_speed),
        engine_torque: Number(engine_torque),
        acceleration: Number(acceleration),
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
        value={car_name}
        onChange={(e) => setCarName(e.target.value)}
      />

      <input
        placeholder="Car Model"
        value={car_model}
        onChange={(e) => setCarModel(e.target.value)}
      />

      {/* Make Dropdown */}
      <select
        value={makeId}
        onChange={(e) => setMakeId(e.target.value)}
        className='bg-gray-500'
      >
        <option value="" className='bg-gray-500'>Select Car Make</option>

        {makes.map((make) => (
          <option key={make.id} value={make.id}>
            {make.make}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Engine Power (HP)"
        value={engine_power}
        onChange={(e) => setEnginePower(e.target.value)}
      />

      <input
        type="number"
        step="0.1"
        placeholder="Engine Capacity (L)"
        value={engine_capacity}
        onChange={(e) => setEngineCapacity(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Speed (km/h)"
        value={max_speed}
        onChange={(e) => setMaxSpeed(e.target.value)}
      />

      <input
        type="number"
        placeholder="Engine Torque (Nm)"
        value={engine_torque}
        onChange={(e) => setEngineTorque(e.target.value)}
      />

      <input
        type="number"
        step="0.1"
        placeholder="0-100 Acceleration (s)"
        value={acceleration}
        onChange={(e) => setAcceleration(e.target.value)}
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

      <button onClick={upload} className="bg-gray-500 hover:bg-gray-600 p-5 rounded-2xl">
        Upload Car
      </button>
    </div>
  )
}