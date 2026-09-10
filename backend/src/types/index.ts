export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  source: 'website' | 'referral' | 'email' | 'phone' | 'other'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  customerId?: string
  leadId?: string
  createdAt: string
  updatedAt: string
}

export interface Deal {
  id: string
  name: string
  value: number
  currency: string
  stage: 'prospect' | 'proposal' | 'negotiation' | 'won' | 'lost'
  customerId: string
  contactId?: string
  expectedCloseDate?: string
  probability: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  customerId?: string
  leadId?: string
  dealId?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  content: string
  customerId?: string
  leadId?: string
  dealId?: string
  contactId?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalCustomers: number
  newLeads: number
  activeDeals: number
  totalRevenue: number
  conversionRate: number
  recentActivity: Activity[]
  upcomingTasks: Task[]
}

export interface Activity {
  id: string
  type: 'customer_created' | 'lead_created' | 'deal_won' | 'task_completed'
  description: string
  createdAt: string
}
