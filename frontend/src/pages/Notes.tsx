import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, Button, Loading, EmptyState, Modal } from '@/components/UI'
import { notesAPI } from '@/services/api'

interface Note {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
  })

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    try {
      const data = await notesAPI.getAll()
      setNotes(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddNote() {
    if (!formData.content) {
      alert('Please enter a note')
      return
    }
    try {
      await notesAPI.create(formData)
      setFormData({ content: '' })
      setShowModal(false)
      loadNotes()
    } catch (err) {
      alert('Failed to create note')
    }
  }

  async function handleDeleteNote(id: string) {
    if (window.confirm('Delete this note?')) {
      try {
        await notesAPI.delete(id)
        loadNotes()
      } catch (err) {
        alert('Failed to delete note')
      }
    }
  }

  if (loading) return <Loading message="Loading notes..." />

  return (
    <div>
      <Header title="Notes" subtitle="Keep track of important information" />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{notes.length} Notes</h2>
          <Button onClick={() => setShowModal(true)}>+ New Note</Button>
        </div>

        {notes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No Notes"
            description="Create notes to store information"
            action={{ label: '+ New Note', onClick: () => setShowModal(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((n) => (
              <Card key={n.id} className="relative">
                <p className="text-gray-900 mb-4">{n.content}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <button className="text-blue-600">Edit</button>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal isOpen={showModal} title="New Note" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <textarea
              placeholder="Write your note..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
            <div className="flex space-x-2 pt-3">
              <Button onClick={handleAddNote}>Save Note</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
