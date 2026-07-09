'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Make = {
  id: number
  make: string
}

export default function MakeManager() {
  const [makes, setMakes] = useState<Make[]>([])
  const [newMake, setNewMake] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingMake, setEditingMake] = useState('')

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

  const addMake = async () => {
    if (!newMake.trim()) {
      alert('Please enter a car make.')
      return
    }

    const { error } = await supabase
      .from('make')
      .insert({
        make: newMake.trim(),
      })

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setNewMake('')
    fetchMakes()
  }

  const updateMake = async () => {
    if (editingId === null || !editingMake.trim()) return

    const { error } = await supabase
      .from('make')
      .update({
        make: editingMake.trim(),
      })
      .eq('id', editingId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setEditingId(null)
    setEditingMake('')
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Manage Car Makes</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Enter car make..."
          value={newMake}
          onChange={(e) => setNewMake(e.target.value)}
        />

        <button onClick={addMake}className="bg-gray-600 hover:bg-gray-700 text-white px-4 rounded">
          Add
        </button>
      </div>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-600 text-black">
            <th className="border p-2">ID</th>
            <th className="border p-2">Make</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {makes.length === 0 ? (
            <tr>
              <td colSpan={3} className="border p-4 text-center">
                No makes found.
              </td>
            </tr>
          ) : (
            makes.map((make) => (
              <tr key={make.id}>
                <td className="border border-gray-600 p-2">{make.id}</td>

                <td className="border border-gray-600 p-2">
                  {editingId === make.id ? (
                    <input
                      className="border rounded p-1 w-full"
                      value={editingMake}
                      onChange={(e) => setEditingMake(e.target.value)}
                    />
                  ) : (
                    make.make
                  )}
                </td>

                <td className="border border-gray-600 p-2">
                  {editingId === make.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={updateMake}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditingMake('')
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(make.id)
                          setEditingMake(make.make)
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMake(make.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}