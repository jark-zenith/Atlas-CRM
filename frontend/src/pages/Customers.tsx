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
import { customersAPI } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { validateForm, ValidationErrors, commonPatterns } from '@/lib/validation'

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

const ITEMS_PER_PAGE = 10

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
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
      setCurrentPage(1)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load customers'
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
    phone: {
      pattern: {
        value: commonPatterns.phone,
        message: 'Invalid phone number format',
      },
    },
  }

  async function handleAddCustomer() {
    const errors = validateForm(formData, validationRules)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      showError('Please fix the validation errors')
      return
    }

    try {
      await customersAPI.create(formData)
      success('Customer created successfully')
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '' })
      setFormErrors({})
      setShowModal(false)
      loadCustomers()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create customer'
      showError(errorMsg)
    }
  }

  async function handleDeleteCustomer() {
    if (!deleteTarget) return

    try {
      await customersAPI.delete(deleteTarget)
      success('Customer deleted successfully')
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
      loadCustomers()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete customer'
      showError(errorMsg)
    }
  }

  function openDeleteConfirm(id: string) {
    setDeleteTarget(id)
    setShowDeleteConfirm(true)
  }

  if (loading) return <Loading message="Loading customers..." />

  // Pagination logic
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCustomers = customers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
          <>
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
                    {paginatedCustomers.map((customer) => (
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
                            onClick={() => openDeleteConfirm(customer.id)}
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
          title="Add New Customer"
          onClose={() => {
            setShowModal(false)
            setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '' })
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
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value })
                if (formErrors.phone) {
                  setFormErrors({ ...formErrors, phone: '' })
                }
              }}
              error={formErrors.phone}
              placeholder="+1 (555) 000-0000"
            />
            <FormField
              label="Company"
              name="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Corp"
            />
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddCustomer}>Create Customer</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false)
                  setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '' })
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
          title="Delete Customer"
          message="Are you sure you want to delete this customer? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous
          onConfirm={handleDeleteCustomer}
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
