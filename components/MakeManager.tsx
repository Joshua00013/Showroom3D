'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useDropzone } from 'react-dropzone'

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Make = {
  id: number
  make: string
  logo_path: string | null
}

export default function MakeManager() {
  const [makes, setMakes] = useState<Make[]>([])
  const [newMake, setNewMake] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingMake, setEditingMake] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const fetchMakes = async () => {
    const { data, error } = await supabase
      .from('make')
      .select('*')
      .order('make')

    if (error) {
      console.error(error)
      return
    }

    setMakes(data || [])
  }

  useEffect(() => {
    fetchMakes()
  }, [])

  const {
    getRootProps: logoRoot,
    getInputProps: logoInput,
  } = useDropzone({
    onDrop: (files) => setLogoFile(files[0]),
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: false,
  })

  const addMake = async () => {
    if (!newMake.trim()) {
      alert('Please enter a car make.')
      return
    }

    let logo_path: string | null = null

    if (logoFile) {
      const fileName = `${Date.now()}-${logoFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('CarModels')
        .upload(fileName, logoFile)

      if (uploadError) {
        console.error(uploadError)
        alert(uploadError.message)
        return
      }

      logo_path = fileName
    }

    const { error } = await supabase
      .from('make')
      .insert({
        make: newMake.trim(),
        logo_path,
      })

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setNewMake('')
    setLogoFile(null)

    fetchMakes()
  }

  const updateMake = async () => {
    if (editingId === null || !editingMake.trim()) return

    const updates: {
      make: string
      logo_path?: string
    } = {
      make: editingMake.trim(),
    }

    if (logoFile) {
      const fileName = `${Date.now()}-${logoFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('CarModels')
        .upload(fileName, logoFile)

      if (uploadError) {
        console.error(uploadError)
        alert(uploadError.message)
        return
      }

      updates.logo_path = fileName
    }

    const { error } = await supabase
      .from('make')
      .update(updates)
      .eq('id', editingId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setEditingId(null)
    setEditingMake('')
    setLogoFile(null)

    fetchMakes()
  }

  const deleteMake = async (id: number) => {
    if (!confirm('Delete this make?')) return

    const { error } = await supabase
      .from('make')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    fetchMakes()
  }

  const getLogoUrl = (path: string) => {
    return supabase.storage
      .from('CarModels')
      .getPublicUrl(path).data.publicUrl
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Car Makes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Make */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter car make..."
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addMake()
                }
              }}
            />

            <Button onClick={addMake}>
              Add
            </Button>
          </div>

          {/* Logo Upload */}
          <div
            {...logoRoot()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50"
          >
            <input {...logoInput()} />

            <p className="text-sm font-medium">
              {logoFile
                ? logoFile.name
                : 'Drop logo here or click to browse'}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              PNG or JPG
            </p>
          </div>

          {/* Makes Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead className="w-32">Logo</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {makes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No makes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  makes.map((make) => (
                    <TableRow key={make.id}>
                      {/* ID */}
                      <TableCell className="font-medium">
                        {make.id}
                      </TableCell>

                      {/* Logo */}
                      <TableCell>
                        {editingId === make.id ? (
                          <div
                            {...logoRoot()}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-3 text-center hover:bg-muted/50"
                          >
                            <input {...logoInput()} />

                            <span className="text-xs text-muted-foreground">
                              {logoFile
                                ? logoFile.name
                                : 'Change logo'}
                            </span>
                          </div>
                        ) : make.logo_path ? (
                          <img
                            src={getLogoUrl(make.logo_path)}
                            alt={make.make}
                            className="mx-auto h-12 w-12 object-contain"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No Logo
                          </span>
                        )}
                      </TableCell>

                      {/* Make */}
                      <TableCell>
                        {editingId === make.id ? (
                          <Input
                            value={editingMake}
                            onChange={(e) =>
                              setEditingMake(e.target.value)
                            }
                            className="max-w-sm"
                          />
                        ) : (
                          <span className="font-medium">
                            {make.make}
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        {editingId === make.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={updateMake}
                            >
                              Save
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null)
                                setEditingMake('')
                                setLogoFile(null)
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(make.id)
                                setEditingMake(make.make)
                                setLogoFile(null)
                              }}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                deleteMake(make.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}