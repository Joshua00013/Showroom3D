'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Make = {
  id: number
  make: string
}

type Color = {
  id: number
  hex_code: string
}

type Car = {
  id: number
  car_name: string
  car_model: string
  make_id: number | null

  photo_path: string | null
  model_path: string | null
  interior_path: string | null

  price: number | null
  engine_power: number | null
  engine_capacity: number | null
  max_speed: number | null
  engine_torque: number | null
  acceleration: number | null

  make: {
    id: number
    make: string
  } | null

  colors: Color[]
}

export default function CarTable() {
  const [cars, setCars] = useState<Car[]>([])
  const [makes, setMakes] = useState<Make[]>([])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [interiorFile, setInteriorFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)

  // --------------------------------------------------
  // FETCH CARS
  // --------------------------------------------------

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select(`
        *,
        make (
          id,
          make
        ),
        colors (
          id,
          hex_code
        )
      `)
      .order('car_name')

    if (error) {
      console.error('FETCH CARS ERROR:', error)
      return
    }

    console.log('CARS:', data)

    setCars(data || [])
  }

  // --------------------------------------------------
  // FETCH MAKES
  // --------------------------------------------------

  const fetchMakes = async () => {
    const { data, error } = await supabase
      .from('make')
      .select('id, make')
      .order('make')

    if (error) {
      console.error('FETCH MAKES ERROR:', error)
      return
    }

    setMakes(data || [])
  }

  useEffect(() => {
    fetchCars()
    fetchMakes()
  }, [])

  // --------------------------------------------------
  // STORAGE URL
  // --------------------------------------------------

  const getPublicUrl = (path: string | null) => {
    if (!path) return ''

    return supabase.storage
      .from('CarModels')
      .getPublicUrl(path)
      .data.publicUrl
  }

  // --------------------------------------------------
  // START EDITING
  // --------------------------------------------------

  const startEditing = (car: Car) => {
    setEditingId(car.id)

    setEditingCar({
      ...car,
      colors: car.colors ? [...car.colors] : [],
    })

    setPhotoFile(null)
    setInteriorFile(null)
    setModelFile(null)
  }

  // --------------------------------------------------
  // CANCEL
  // --------------------------------------------------

  const cancelEditing = () => {
    setEditingId(null)
    setEditingCar(null)

    setPhotoFile(null)
    setInteriorFile(null)
    setModelFile(null)
  }

  // --------------------------------------------------
  // UPLOAD FILE
  // --------------------------------------------------

  const uploadFile = async (
    file: File,
    oldPath: string | null
  ) => {
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('CarModels')
      .upload(fileName, file)

    if (error) {
      throw error
    }

    if (oldPath) {
      const { error: deleteError } = await supabase.storage
        .from('CarModels')
        .remove([oldPath])

      if (deleteError) {
        console.error(
          'Old file delete error:',
          deleteError
        )
      }
    }

    return fileName
  }

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const saveCar = async () => {
    if (!editingCar) return

    setSaving(true)

    try {
      let photoPath = editingCar.photo_path
      let interiorPath = editingCar.interior_path
      let modelPath = editingCar.model_path

      // Exterior image
      if (photoFile) {
        photoPath = await uploadFile(
          photoFile,
          editingCar.photo_path
        )
      }

      // Interior image
      if (interiorFile) {
        interiorPath = await uploadFile(
          interiorFile,
          editingCar.interior_path
        )
      }

      // 3D model
      if (modelFile) {
        modelPath = await uploadFile(
          modelFile,
          editingCar.model_path
        )
      }

      // Update car
      const { error } = await supabase
        .from('cars')
        .update({
          car_name: editingCar.car_name,
          car_model: editingCar.car_model,
          make_id: editingCar.make_id,

          price: editingCar.price,
          engine_power: editingCar.engine_power,
          engine_capacity: editingCar.engine_capacity,
          max_speed: editingCar.max_speed,
          engine_torque: editingCar.engine_torque,
          acceleration: editingCar.acceleration,

          photo_path: photoPath,
          interior_path: interiorPath,
          model_path: modelPath,
        })
        .eq('id', editingCar.id)

      if (error) {
        console.error('UPDATE CAR ERROR:', error)
        alert(error.message)
        return
      }

      // ------------------------------------------------
      // UPDATE COLORS
      // ------------------------------------------------

      const { error: deleteColorsError } = await supabase
        .from('colors')
        .delete()
        .eq('car_id', editingCar.id)

      if (deleteColorsError) {
        console.error(
          'DELETE COLORS ERROR:',
          deleteColorsError
        )
      }

      if (editingCar.colors.length > 0) {
        const colorsToInsert = editingCar.colors
          .filter(
            (color) => color.hex_code.trim() !== ''
          )
          .map((color) => ({
            car_id: editingCar.id,
            hex_code: color.hex_code,
          }))

        const { error: insertColorsError } =
          await supabase
            .from('colors')
            .insert(colorsToInsert)

        if (insertColorsError) {
          console.error(
            'INSERT COLORS ERROR:',
            insertColorsError
          )
        }
      }

      await fetchCars()

      cancelEditing()

    } catch (error) {
      console.error('SAVE ERROR:', error)

      if (error instanceof Error) {
        alert(error.message)
      }

    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const deleteCar = async (car: Car) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${car.car_name}?`
    )

    if (!confirmed) return

    try {

      if (car.model_path) {
        const { error } = await supabase.storage
          .from('CarModels')
          .remove([car.model_path])

        if (error) {
          console.error(
            'MODEL DELETE ERROR:',
            error
          )
        }
      }

      if (car.photo_path) {
        const { error } = await supabase.storage
          .from('CarModels')
          .remove([car.photo_path])

        if (error) {
          console.error(
            'PHOTO DELETE ERROR:',
            error
          )
        }
      }

      if (car.interior_path) {
        const { error } = await supabase.storage
          .from('CarModels')
          .remove([car.interior_path])

        if (error) {
          console.error(
            'INTERIOR DELETE ERROR:',
            error
          )
        }
      }

      const { error: colorsError } =
        await supabase
          .from('colors')
          .delete()
          .eq('car_id', car.id)

      if (colorsError) {
        console.error(
          'COLORS DELETE ERROR:',
          colorsError
        )
      }

      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', car.id)

      if (error) {
        console.error(
          'DATABASE DELETE ERROR:',
          error
        )
        return
      }

      setCars((prev) =>
        prev.filter((c) => c.id !== car.id)
      )

    } catch (error) {
      console.error('DELETE ERROR:', error)
    }
  }

  // --------------------------------------------------
  // COLORS
  // --------------------------------------------------

  const addColor = () => {
    if (!editingCar) return

    setEditingCar({
      ...editingCar,
      colors: [
        ...editingCar.colors,
        {
          id: Date.now(),
          hex_code: '#ffffff',
        },
      ],
    })
  }

  const removeColor = (index: number) => {
    if (!editingCar) return

    setEditingCar({
      ...editingCar,
      colors: editingCar.colors.filter(
        (_, i) => i !== index
      ),
    })
  }

  const changeColor = (
    index: number,
    value: string
  ) => {
    if (!editingCar) return

    const colors = [...editingCar.colors]

    colors[index] = {
      ...colors[index],
      hex_code: value,
    }

    setEditingCar({
      ...editingCar,
      colors,
    })
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="w-full min-w-0 overflow-hidden">
    <div className="w-full overflow-x-auto rounded-lg border">

      <Table className="min-w-[1400px]">

        {/* HEADER */}

        <TableHeader>
          <TableRow>

            <TableHead className="w-16">
              ID
            </TableHead>

            <TableHead className="min-w-[200px]">
              Exterior
            </TableHead>

            <TableHead className="min-w-[200px]">
              Interior
            </TableHead>

            <TableHead className="min-w-[240px]">
              3D Model
            </TableHead>

            <TableHead className="min-w-[180px]">
              Car Name
            </TableHead>

            <TableHead className="min-w-[160px]">
              Make
            </TableHead>

            <TableHead className="min-w-[180px]">
              Model
            </TableHead>

            <TableHead className="min-w-[130px]">
              Price
            </TableHead>

            <TableHead className="min-w-[130px]">
              Power
            </TableHead>

            <TableHead className="min-w-[150px]">
              Capacity
            </TableHead>

            <TableHead className="min-w-[140px]">
              Max Speed
            </TableHead>

            <TableHead className="min-w-[130px]">
              Torque
            </TableHead>

            <TableHead className="min-w-[150px]">
              Acceleration
            </TableHead>

            <TableHead className="min-w-[180px]">
              Colors
            </TableHead>

            <TableHead className="min-w-[180px] text-right">
              Actions
            </TableHead>

          </TableRow>
        </TableHeader>

        {/* BODY */}

        <TableBody>

          {cars.length === 0 ? (

            <TableRow>

              <TableCell
                colSpan={15}
                className="h-24 text-center text-muted-foreground"
              >
                No cars found.
              </TableCell>

            </TableRow>

          ) : (

            cars.map((car) => {

              const editing =
                editingId === car.id &&
                editingCar !== null

              return (

                <TableRow key={car.id}>

                  {/* ID */}

                  <TableCell>
                    {car.id}
                  </TableCell>

                  {/* EXTERIOR */}

                  <TableCell>

                    {editing ? (

                      <div className="min-w-[180px] space-y-2">

                        <Input
                          type="file"
                          accept="image/png,image/jpeg"
                          className="w-full"
                          onChange={(e) =>
                            setPhotoFile(
                              e.target.files?.[0] ||
                              null
                            )
                          }
                        />

                        {photoFile && (
                          <p className="text-xs text-muted-foreground break-all">
                            {photoFile.name}
                          </p>
                        )}

                      </div>

                    ) : car.photo_path ? (

                      <img
                        src={getPublicUrl(
                          car.photo_path
                        )}
                        alt={car.car_name}
                        className="h-16 w-24 rounded-md object-cover"
                      />

                    ) : (

                      <span className="text-sm text-muted-foreground">
                        No image
                      </span>

                    )}

                  </TableCell>

                  {/* INTERIOR */}

                  <TableCell>

                    {editing ? (

                      <div className="min-w-[180px] space-y-2">

                        <Input
                          type="file"
                          accept="image/png,image/jpeg"
                          className="w-full"
                          onChange={(e) =>
                            setInteriorFile(
                              e.target.files?.[0] ||
                              null
                            )
                          }
                        />

                        {interiorFile && (
                          <p className="text-xs text-muted-foreground break-all">
                            {interiorFile.name}
                          </p>
                        )}

                      </div>

                    ) : car.interior_path ? (

                      <img
                        src={getPublicUrl(
                          car.interior_path
                        )}
                        alt={`${car.car_name} interior`}
                        className="h-16 w-24 rounded-md object-cover"
                      />

                    ) : (

                      <span className="text-sm text-muted-foreground">
                        No image
                      </span>

                    )}

                  </TableCell>

                  {/* 3D MODEL */}

                  <TableCell>

                    {editing ? (

                      <div className="min-w-[220px] space-y-2">

                        <Input
                          type="file"
                          accept=".glb,.gltf"
                          className="w-full"
                          onChange={(e) =>
                            setModelFile(
                              e.target.files?.[0] ||
                              null
                            )
                          }
                        />

                        {modelFile && (
                          <p className="text-xs text-muted-foreground break-all">
                            {modelFile.name}
                          </p>
                        )}

                      </div>

                    ) : (

                      <span className="text-sm break-all">
                        {car.model_path
                          ? car.model_path
                              .split('/')
                              .pop()
                          : 'No model'}
                      </span>

                    )}

                  </TableCell>

                  {/* CAR NAME */}

                  <TableCell>

                    {editing ? (

                      <Input
                        value={editingCar.car_name}
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            car_name:
                              e.target.value,
                          })
                        }
                      />

                    ) : (

                      <span className="font-medium">
                        {car.car_name}
                      </span>

                    )}

                  </TableCell>

                  {/* MAKE */}

                  <TableCell>

                    {editing ? (

                      <select
                        value={
                          editingCar.make_id ?? ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            make_id: e.target.value
                              ? Number(
                                  e.target.value
                                )
                              : null,
                          })
                        }
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                      >

                        <option value="">
                          Select make
                        </option>

                        {makes.map((make) => (

                          <option
                            key={make.id}
                            value={make.id}
                          >
                            {make.make}
                          </option>

                        ))}

                      </select>

                    ) : (

                      <span>
                        {car.make?.make ??
                          'Unknown'}
                      </span>

                    )}

                  </TableCell>

                  {/* MODEL */}

                  <TableCell>

                    {editing ? (

                      <Input
                        value={
                          editingCar.car_model
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            car_model:
                              e.target.value,
                          })
                        }
                      />

                    ) : (

                      car.car_model

                    )}

                  </TableCell>

                  {/* PRICE */}

                  <TableCell>

                    {editing ? (

                      <Input
                        type="number"
                        value={
                          editingCar.price ?? ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            price: e.target.value
                              ? Number(
                                  e.target.value
                                )
                              : null,
                          })
                        }
                      />

                    ) : (

                      car.price ?? '—'

                    )}

                  </TableCell>

                  {/* ENGINE POWER */}

                  <TableCell>

                    {editing ? (

                      <Input
                        type="number"
                        value={
                          editingCar.engine_power ??
                          ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            engine_power:
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null,
                          })
                        }
                      />

                    ) : (

                      car.engine_power ?? '—'

                    )}

                  </TableCell>

                  {/* ENGINE CAPACITY */}

                  <TableCell>

                    {editing ? (

                      <Input
                        type="number"
                        value={
                          editingCar.engine_capacity ??
                          ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            engine_capacity:
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null,
                          })
                        }
                      />

                    ) : (

                      car.engine_capacity ?? '—'

                    )}

                  </TableCell>

                  {/* MAX SPEED */}

                  <TableCell>

                    {editing ? (

                      <Input
                        type="number"
                        value={
                          editingCar.max_speed ??
                          ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            max_speed:
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null,
                          })
                        }
                      />

                    ) : (

                      car.max_speed ?? '—'

                    )}

                  </TableCell>

                  {/* TORQUE */}

                  <TableCell>

                    {editing ? (

                      <Input
                        type="number"
                        value={
                          editingCar.engine_torque ??
                          ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            engine_torque:
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null,
                          })
                        }
                      />

                    ) : (

                      car.engine_torque ?? '—'

                    )}

                  </TableCell>

                  {/* ACCELERATION */}

                  <TableCell>

                    {editing ? (

                      <Input
                        type="number"
                        step="0.1"
                        value={
                          editingCar.acceleration ??
                          ''
                        }
                        onChange={(e) =>
                          setEditingCar({
                            ...editingCar,
                            acceleration:
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null,
                          })
                        }
                      />

                    ) : (

                      car.acceleration ?? '—'

                    )}

                  </TableCell>

                  {/* COLORS */}

                  <TableCell>

                    {editing ? (

                      <div className="min-w-[160px] space-y-2">

                        {editingCar.colors.map(
                          (color, index) => (

                            <div
                              key={color.id}
                              className="flex items-center gap-2"
                            >

                              <Input
                                type="color"
                                value={
                                  color.hex_code
                                }
                                onChange={(e) =>
                                  changeColor(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="h-9 w-12 p-1"
                              />

                              <Input
                                value={
                                  color.hex_code
                                }
                                onChange={(e) =>
                                  changeColor(
                                    index,
                                    e.target.value
                                  )
                                }
                              />

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  removeColor(
                                    index
                                  )
                                }
                              >
                                ×
                              </Button>

                            </div>

                          )
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={addColor}
                        >
                          + Color
                        </Button>

                      </div>

                    ) : (

                      <div className="flex gap-1">

                        {car.colors?.map(
                          (color) => (

                            <div
                              key={color.id}
                              title={
                                color.hex_code
                              }
                              className="h-6 w-6 rounded-full border"
                              style={{
                                backgroundColor:
                                  color.hex_code,
                              }}
                            />

                          )
                        )}

                      </div>

                    )}

                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell>

                    {editing ? (

                      <div className="flex justify-end gap-2">

                        <Button
                          size="sm"
                          onClick={saveCar}
                          disabled={saving}
                        >
                          {saving
                            ? 'Saving...'
                            : 'Save'}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={
                            cancelEditing
                          }
                          disabled={saving}
                        >
                          Cancel
                        </Button>

                      </div>

                    ) : (

                      <div className="flex justify-end gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            startEditing(car)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            deleteCar(car)
                          }
                        >
                          Delete
                        </Button>

                      </div>

                    )}

                  </TableCell>

                </TableRow>
              )
            })

          )}

        </TableBody>

      </Table>

    </div>
    </div>
  )
}