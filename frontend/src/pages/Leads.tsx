import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, Button, Loading, EmptyState, Modal } from '@/components/UI'
import { leadsAPI } from '@/services/api'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  company?: string
  title?: string
  source: string
  status: string
  createdAt: string
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    title: '',
    source: 'website',
    status: 'new',
  })

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    try {
      const data = await leadsAPI.getAll()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddLead() {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await leadsAPI.create(formData)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        title: '',
        source: 'website',
        status: 'new',
      })
      setShowModal(false)
      loadLeads()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create lead')
    }
  }

  async function handleDeleteLead(id: string) {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsAPI.delete(id)
        loadLeads()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete lead')
      }
    }
  }

  if (loading) return <Loading message="Loading leads..." />

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <Header
        title="Leads"
        subtitle="Track and manage your sales pipeline"
      />

      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {leads.length} Leads
          </h2>
          <Button onClick={() => setShowModal(true)}>+ Add Lead</Button>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {leads.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="No Leads Yet"
            description="Start by adding leads to your sales pipeline."
            action={{ label: '+ Add Lead', onClick: () => setShowModal(true) }}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Company</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Source</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{lead.email}</td>
                      <td className="py-4 px-4 text-gray-600">{lead.company || '-'}</td>
                      <td className="py-4 px-4 text-gray-600 capitalize">{lead.source}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[lead.status as keyof typeof statusColors] || statusColors.new}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium mr-4">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
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

        <Modal
          isOpen={showModal}
          title="Add New Lead"
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>website</option>
              <option>referral</option>
              <option>email</option>
              <option>phone</option>
              <option>other</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>new</option>
              <option>contacted</option>
              <option>qualified</option>
              <option>converted</option>
              <option>lost</option>
            </select>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddLead}>Create Lead</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
