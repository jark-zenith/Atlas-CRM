import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, Button, Loading, EmptyState, Modal } from '@/components/UI'
import { customersAPI } from '@/services/api'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  city?: string
  createdAt: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const data = await customersAPI.getAll()
      setCustomers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCustomer() {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await customersAPI.create(formData)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '' })
      setShowModal(false)
      loadCustomers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create customer')
    }
  }

  async function handleDeleteCustomer(id: string) {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id)
        loadCustomers()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete customer')
      }
    }
  }

  if (loading) return <Loading message="Loading customers..." />

  return (
    <div>
      <Header
        title="Customers"
        subtitle="Manage your customer relationships"
      />

      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {customers.length} Customers
          </h2>
          <Button onClick={() => setShowModal(true)}>+ Add Customer</Button>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {customers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No Customers Yet"
            description="Start building your customer base by adding your first customer."
            action={{ label: '+ Add Customer', onClick: () => setShowModal(true) }}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Company</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{customer.email}</td>
                      <td className="py-4 px-4 text-gray-600">{customer.phone || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">{customer.company || '-'}</td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium mr-4">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
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
          title="Add New Customer"
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
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddCustomer}>Create Customer</Button>
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
