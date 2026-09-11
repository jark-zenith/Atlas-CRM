import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import {
  Card,
  Button,
  Loading,
  EmptyState,
  Modal,
  FormField,
  ConfirmDialog,
  ToastContainer,
  Pagination,
} from '@/components/UI'
import { leadsAPI } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { validateForm, ValidationErrors, commonPatterns } from '@/lib/validation'

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

const ITEMS_PER_PAGE = 10

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formErrors, setFormErrors] = useState<ValidationErrors>({})
  const { toasts, removeToast, success, error: showError } = useToast()
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
      setCurrentPage(1)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load leads'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const validationRules = {
    firstName: { required: 'First name is required', minLength: 2 },
    lastName: { required: 'Last name is required', minLength: 2 },
    email: {
      required: 'Email is required',
      pattern: { value: commonPatterns.email, message: 'Invalid email format' },
    },
  }

  async function handleAddLead() {
    const errors = validateForm(formData, validationRules)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      showError('Please fix the validation errors')
      return
    }

    try {
      await leadsAPI.create(formData)
      success('Lead created successfully')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        title: '',
        source: 'website',
        status: 'new',
      })
      setFormErrors({})
      setShowModal(false)
      loadLeads()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create lead'
      showError(errorMsg)
    }
  }

  async function handleDeleteLead() {
    if (!deleteTarget) return

    try {
      await leadsAPI.delete(deleteTarget)
      success('Lead deleted successfully')
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
      loadLeads()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete lead'
      showError(errorMsg)
    }
  }

  function openDeleteConfirm(id: string) {
    setDeleteTarget(id)
    setShowDeleteConfirm(true)
  }

  if (loading) return <Loading message="Loading leads..." />

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
  }

  // Pagination logic
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLeads = leads.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div>
      <Header title="Leads" subtitle="Track and manage your sales pipeline" />

      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{leads.length} Leads</h2>
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
          <>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Company
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Source</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLeads.map((lead) => (
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
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              statusColors[lead.status as keyof typeof statusColors] ||
                              statusColors.new
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-blue-600 hover:text-blue-800 font-medium mr-4">
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(lead.id)}
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
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        <Modal
          isOpen={showModal}
          title="Add New Lead"
          onClose={() => {
            setShowModal(false)
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              company: '',
              title: '',
              source: 'website',
              status: 'new',
            })
            setFormErrors({})
          }}
        >
          <div className="space-y-4">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value })
                if (formErrors.firstName) {
                  setFormErrors({ ...formErrors, firstName: '' })
                }
              }}
              error={formErrors.firstName}
              required
              placeholder="John"
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value })
                if (formErrors.lastName) {
                  setFormErrors({ ...formErrors, lastName: '' })
                }
              }}
              error={formErrors.lastName}
              required
              placeholder="Doe"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (formErrors.email) {
                  setFormErrors({ ...formErrors, email: '' })
                }
              }}
              error={formErrors.email}
              required
              placeholder="john@example.com"
            />
            <FormField
              label="Company"
              name="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Corp"
            />
            <FormField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Sales Manager"
            />
            <FormField
              label="Source"
              name="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'referral', label: 'Referral' },
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <FormField
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'converted', label: 'Converted' },
                { value: 'lost', label: 'Lost' },
              ]}
            />
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddLead}>Create Lead</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false)
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    company: '',
                    title: '',
                    source: 'website',
                    status: 'new',
                  })
                  setFormErrors({})
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Lead"
          message="Are you sure you want to delete this lead? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous
          onConfirm={handleDeleteLead}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setDeleteTarget(null)
          }}
        />

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </main>
    </div>
  )
}
