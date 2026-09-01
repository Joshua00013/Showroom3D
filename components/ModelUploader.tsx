'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function CarUploader() {
  const [car_name, setCarName] = useState('')
  const [car_model, setCarModel] = useState('')
  const [price, setPrice] = useState('')
  const [engine_power, setEnginePower] = useState('')
  const [engine_capacity, setEngineCapacity] = useState('')
  const [max_speed, setMaxSpeed] = useState('')
  const [engine_torque, setEngineTorque] = useState('')
  const [acceleration, setAcceleration] = useState('')

  const [makes, setMakes] = useState<any[]>([])
  const [makeId, setMakeId] = useState('')

  const makeItems = makes.map((make) => ({
    value: String(make.id),
    label: make.make,
  }))


  const [glbFile, setGlbFile] = useState<File | null>(null)
  const [pngFile, setPngFile] = useState<File | null>(null)
  const [interiorFile, setInteriorFile] = useState<File | null>(null)

  const [colors, setColors] = useState<string[]>([])
  const [newColor, setNewColor] = useState('#ffffff')

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
  const {
    getRootProps: glbRoot,
    getInputProps: glbInput,
  } = useDropzone({
    onDrop: (files) => setGlbFile(files[0]),
    accept: {
      'model/gltf-binary': ['.glb'],
    },
    multiple: false,
  })

  // Exterior image drop
  const {
    getRootProps: pngRoot,
    getInputProps: pngInput,
  } = useDropzone({
    onDrop: (files) => setPngFile(files[0]),
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: false,
  })

  // Interior image drop
  const {
    getRootProps: interiorRoot,
    getInputProps: interiorInput,
  } = useDropzone({
    onDrop: (files) => setInteriorFile(files[0]),
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: false,
  })

  // Colors
  const addColor = () => {
    if (!colors.includes(newColor)) {
      setColors([...colors, newColor])
    }
  }

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color))
  }

  // Upload
  const upload = async () => {
    if (!glbFile || !pngFile || !interiorFile) {
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
    const interiorName = `${id}-${interiorFile.name}`

    // Upload GLB
    const { error: glbError } = await supabase.storage
      .from('CarModels')
      .upload(glbName, glbFile)

    if (glbError) {
      console.error(glbError)
      return
    }

    // Upload exterior image
    const { error: pngError } = await supabase.storage
      .from('CarModels')
      .upload(pngName, pngFile)

    if (pngError) {
      console.error(pngError)
      return
    }

    // Upload interior image
    const { error: interiorError } = await supabase.storage
      .from('CarModels')
      .upload(interiorName, interiorFile)

    if (interiorError) {
      console.error(interiorError)
      return
    }

    const model_path = glbName
    const photo_path = pngName
    const interior_path = interiorName

    // Insert car
    const { data: newCar, error: dbError } = await supabase
      .from('cars')
      .insert({
        car_name,
        car_model,
        make_id: Number(makeId),
        model_path,
        photo_path,
        interior_path,
        price: Number(price),
        engine_power: Number(engine_power),
        engine_capacity: Number(engine_capacity),
        max_speed: Number(max_speed),
        engine_torque: Number(engine_torque),
        acceleration: Number(acceleration),
      })
      .select()
      .single()

    if (dbError) {
      console.error(dbError)
      return
    }

    // Insert colors
    if (colors.length > 0) {
      const { error: colorError } = await supabase
        .from('colors')
        .insert(
          colors.map((hex) => ({
            car_id: newCar.id,
            hex_code: hex,
          }))
        )

      if (colorError) {
        console.error(colorError)
        return
      }
    }

    alert('Car uploaded successfully!')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Car Model</CardTitle>

        <CardDescription>
          Add a new vehicle to your showroom inventory.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* ================= BASIC INFORMATION ================= */}

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">
              Basic Information
            </h2>

            <p className="text-sm text-muted-foreground">
              Enter the vehicle's basic information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Car Name */}
            <div className="space-y-2">
              <Label htmlFor="car-name">
                Car Name
              </Label>

              <Input
                id="car-name"
                placeholder="e.g. Mitsubishi Mirage G4 2026"
                value={car_name}
                onChange={(e) =>
                  setCarName(e.target.value)
                }
              />
            </div>

            {/* Car Model */}
            <div className="space-y-2">
              <Label htmlFor="car-model">
                Car Model
              </Label>

              <Input
                id="car-model"
                placeholder="e.g. Mirage G4"
                value={car_model}
                onChange={(e) =>
                  setCarModel(e.target.value)
                }
              />
            </div>

            {/* Make */}
            <div className="space-y-2 sm:col-span-2">
              <Label>
                Car Make
              </Label>

        <Select
          items={makeItems}
          value={makeId}
          onValueChange={(value) => {
            if (value !== null) {
              setMakeId(value)
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select car make" />
          </SelectTrigger>

          <SelectContent side="bottom" sideOffset={8} >
            {makeItems.map((make) => (
              <SelectItem
                key={make.value}
                value={make.value}
                className="py-2"
              >
                {make.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

        </div>
        </section>

        <Separator />

        {/* ================= SPECIFICATIONS ================= */}

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">
              Specifications
            </h2>

            <p className="text-sm text-muted-foreground">
              Enter the vehicle's performance specifications.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Price */}
            <div className="space-y-2">
              <Label>
                Price
              </Label>

              <Input
                type="number"
                placeholder="₱0"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            </div>

            {/* Engine Power */}
            <div className="space-y-2">
              <Label>
                Engine Power
              </Label>

              <Input
                type="number"
                placeholder="HP"
                value={engine_power}
                onChange={(e) =>
                  setEnginePower(e.target.value)
                }
              />
            </div>

            {/* Engine Capacity */}
            <div className="space-y-2">
              <Label>
                Engine Capacity
              </Label>

              <Input
                type="number"
                step="0.1"
                placeholder="Liters"
                value={engine_capacity}
                onChange={(e) =>
                  setEngineCapacity(e.target.value)
                }
              />
            </div>

            {/* Max Speed */}
            <div className="space-y-2">
              <Label>
                Max Speed
              </Label>

              <Input
                type="number"
                placeholder="km/h"
                value={max_speed}
                onChange={(e) =>
                  setMaxSpeed(e.target.value)
                }
              />
            </div>

            {/* Torque */}
            <div className="space-y-2">
              <Label>
                Engine Torque
              </Label>

              <Input
                type="number"
                placeholder="Nm"
                value={engine_torque}
                onChange={(e) =>
                  setEngineTorque(e.target.value)
                }
              />
            </div>

            {/* Acceleration */}
            <div className="space-y-2">
              <Label>
                0–100 Acceleration
              </Label>

              <Input
                type="number"
                step="0.1"
                placeholder="Seconds"
                value={acceleration}
                onChange={(e) =>
                  setAcceleration(e.target.value)
                }
              />
            </div>

          </div>
        </section>

        <Separator />

        {/* ================= FILES ================= */}

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">
              Vehicle Assets
            </h2>

            <p className="text-sm text-muted-foreground">
              Upload the 3D model and images used by the showroom.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">

            {/* GLB */}
            <div
              {...glbRoot()}
              className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50"
            >
              <input {...glbInput()} />

              <p className="text-sm font-medium">
                3D Model
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {glbFile
                  ? glbFile.name
                  : 'Drop GLB file here'}
              </p>
            </div>

            {/* Exterior */}
            <div
              {...pngRoot()}
              className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50"
            >
              <input {...pngInput()} />

              <p className="text-sm font-medium">
                Exterior Image
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {pngFile
                  ? pngFile.name
                  : 'Drop PNG/JPG here'}
              </p>
            </div>

            {/* Interior */}
            <div
              {...interiorRoot()}
              className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50"
            >
              <input {...interiorInput()} />

              <p className="text-sm font-medium">
                Interior 360°
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {interiorFile
                  ? interiorFile.name
                  : 'Drop interior image here'}
              </p>
            </div>

          </div>
        </section>

        <Separator />

        {/* ================= COLORS ================= */}

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">
              Exterior Colors
            </h2>

            <p className="text-sm text-muted-foreground">
              Add the available exterior colors for this vehicle.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <Input
              type="color"
              value={newColor}
              onChange={(e) =>
                setNewColor(e.target.value)
              }
              className="h-10 w-14 cursor-pointer p-1"
            />

          <Button
            type="button"
            variant="default"
            onClick={addColor}
          >
            Add Color
          </Button>

          </div>

          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">

              {colors.map((color) => (
                <Badge
                  key={color}
                  variant="outline"
                  className="gap-2 px-3 py-2"
                >
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: color,
                    }}
                  />

                  {color}

                  <button
                    type="button"
                    onClick={() =>
                      removeColor(color)
                    }
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}

            </div>
          )}
        </section>

        <Separator />

        {/* ================= SUBMIT ================= */}

        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            onClick={upload}
          >
            Upload Car
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}