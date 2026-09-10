const API_URL = ((import.meta as any).env.VITE_API_URL as string) || 'http://localhost:3000'

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API error')
  }
  return response.json()
}

// Customers
export const customersAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/customers`)
    return handleResponse(response)
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/customers/${id}`)
    return handleResponse(response)
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

// Leads
export const leadsAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/leads`)
    return handleResponse(response)
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/leads/${id}`)
    return handleResponse(response)
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/leads/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

// Contacts
export const contactsAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/contacts`)
    return handleResponse(response)
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/contacts/${id}`)
    return handleResponse(response)
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/contacts/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

// Deals
export const dealsAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/deals`)
    return handleResponse(response)
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/deals/${id}`)
    return handleResponse(response)
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/deals/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

// Tasks
export const tasksAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/tasks`)
    return handleResponse(response)
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/tasks/${id}`)
    return handleResponse(response)
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

// Notes
export const notesAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/notes`)
    return handleResponse(response)
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/notes/${id}`)
    return handleResponse(response)
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

// Dashboard
export const dashboardAPI = {
  async getStats() {
    const response = await fetch(`${API_URL}/api/dashboard`)
    return handleResponse(response)
  },
}

// Health check
export const healthAPI = {
  async check() {
    try {
      const response = await fetch(`${API_URL}/api/health`)
      return handleResponse(response)
    } catch (error) {
      return null
    }
  },
}
