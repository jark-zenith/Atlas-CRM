import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, Button, Loading, EmptyState, Modal } from '@/components/UI'
import { contactsAPI } from '@/services/api'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  createdAt: string
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
  })

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      const data = await contactsAPI.getAll()
      setContacts(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddContact() {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in required fields')
      return
    }
    try {
      await contactsAPI.create(formData)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '' })
      setShowModal(false)
      loadContacts()
    } catch (err) {
      alert('Failed to create contact')
    }
  }

  async function handleDeleteContact(id: string) {
    if (window.confirm('Delete this contact?')) {
      try {
        await contactsAPI.delete(id)
        loadContacts()
      } catch (err) {
        alert('Failed to delete contact')
      }
    }
  }

  if (loading) return <Loading message="Loading contacts..." />

  return (
    <div>
      <Header title="Contacts" subtitle="Manage contact information" />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{contacts.length} Contacts</h2>
          <Button onClick={() => setShowModal(true)}>+ Add Contact</Button>
        </div>

        {contacts.length === 0 ? (
          <EmptyState
            icon="📞"
            title="No Contacts"
            description="Add contacts to track communications"
            action={{ label: '+ Add Contact', onClick: () => setShowModal(true) }}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">Name</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Phone</th>
                    <th className="text-left py-4 px-4 font-semibold">Company</th>
                    <th className="text-left py-4 px-4 font-semibold">Title</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{c.firstName} {c.lastName}</td>
                      <td className="py-4 px-4">{c.email}</td>
                      <td className="py-4 px-4">{c.phone || '-'}</td>
                      <td className="py-4 px-4">{c.company || '-'}</td>
                      <td className="py-4 px-4">{c.title || '-'}</td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 mr-4">Edit</button>
                        <button
                          onClick={() => handleDeleteContact(c.id)}
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

        <Modal isOpen={showModal} title="Add Contact" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2 pt-3">
              <Button onClick={handleAddContact}>Create</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
