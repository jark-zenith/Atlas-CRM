import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, Button, Loading, EmptyState, Modal } from '@/components/UI'
import { dealsAPI } from '@/services/api'

interface Deal {
  id: string
  name: string
  value: number
  currency: string
  stage: string
  probability: number
  customerId: string
  createdAt: string
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    currency: 'USD',
    stage: 'prospect',
    probability: '50',
    customerId: '',
  })

  useEffect(() => {
    loadDeals()
  }, [])

  async function loadDeals() {
    try {
      const data = await dealsAPI.getAll()
      setDeals(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddDeal() {
    if (!formData.name || !formData.value || !formData.customerId) {
      alert('Please fill in required fields')
      return
    }
    try {
      await dealsAPI.create({
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
      })
      setFormData({ name: '', value: '', currency: 'USD', stage: 'prospect', probability: '50', customerId: '' })
      setShowModal(false)
      loadDeals()
    } catch (err) {
      alert('Failed to create deal')
    }
  }

  async function handleDeleteDeal(id: string) {
    if (window.confirm('Delete this deal?')) {
      try {
        await dealsAPI.delete(id)
        loadDeals()
      } catch (err) {
        alert('Failed to delete deal')
      }
    }
  }

  if (loading) return <Loading message="Loading deals..." />

  const stageColors: Record<string, string> = {
    prospect: 'bg-blue-100 text-blue-700',
    proposal: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-yellow-100 text-yellow-700',
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <Header title="Sales Pipeline" subtitle="Track and manage deals" />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{deals.length} Deals</h2>
          <Button onClick={() => setShowModal(true)}>+ New Deal</Button>
        </div>

        {deals.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No Deals"
            description="Create deals to track your sales pipeline"
            action={{ label: '+ New Deal', onClick: () => setShowModal(true) }}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">Deal Name</th>
                    <th className="text-left py-4 px-4 font-semibold">Value</th>
                    <th className="text-left py-4 px-4 font-semibold">Stage</th>
                    <th className="text-left py-4 px-4 font-semibold">Probability</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d) => (
                    <tr key={d.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{d.name}</td>
                      <td className="py-4 px-4">${d.value.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageColors[d.stage] || stageColors.prospect}`}>
                          {d.stage}
                        </span>
                      </td>
                      <td className="py-4 px-4">{d.probability}%</td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 mr-4">Edit</button>
                        <button
                          onClick={() => handleDeleteDeal(d.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Modal isOpen={showModal} title="New Deal" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Deal Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Value *"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>CAD</option>
            </select>
            <input
              type="text"
              placeholder="Customer ID *"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>prospect</option>
              <option>proposal</option>
              <option>negotiation</option>
              <option>won</option>
              <option>lost</option>
            </select>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Probability %"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2 pt-3">
              <Button onClick={handleAddDeal}>Create Deal</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
