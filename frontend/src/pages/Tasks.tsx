import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, Button, Loading, EmptyState, Modal } from '@/components/UI'
import { tasksAPI } from '@/services/api'

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate: string
  createdAt: string
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  })

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const data = await tasksAPI.getAll()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTask() {
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in required fields')
      return
    }
    try {
      await tasksAPI.create(formData)
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' })
      setShowModal(false)
      loadTasks()
    } catch (err) {
      alert('Failed to create task')
    }
  }

  async function handleDeleteTask(id: string) {
    if (window.confirm('Delete this task?')) {
      try {
        await tasksAPI.delete(id)
        loadTasks()
      } catch (err) {
        alert('Failed to delete task')
      }
    }
  }

  if (loading) return <Loading message="Loading tasks..." />

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }

  return (
    <div>
      <Header title="Tasks" subtitle="Manage your to-do list" />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{tasks.length} Tasks</h2>
          <Button onClick={() => setShowModal(true)}>+ Add Task</Button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon="✅"
            title="No Tasks"
            description="Create tasks to stay organized"
            action={{ label: '+ Add Task', onClick: () => setShowModal(true) }}
          />
        ) : (
          <Card>
            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center space-x-4 p-4 border-b hover:bg-gray-50">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{t.title}</p>
                    {t.description && <p className="text-gray-600 text-sm">{t.description}</p>}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${priorityColors[t.priority] || priorityColors.medium}`}>
                        {t.priority}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Due {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button className="text-blue-600 mr-2">Edit</button>
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Modal isOpen={showModal} title="New Task" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>high</option>
              <option>medium</option>
              <option>low</option>
            </select>
            <div className="flex space-x-2 pt-3">
              <Button onClick={handleAddTask}>Create Task</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
