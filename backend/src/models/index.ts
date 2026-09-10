import { Customer, Lead, Contact, Deal, Task, Note } from '../types/index'

// In-memory data stores - in production these would be database
export const customers: Map<string, Customer> = new Map()
export const leads: Map<string, Lead> = new Map()
export const contacts: Map<string, Contact> = new Map()
export const deals: Map<string, Deal> = new Map()
export const tasks: Map<string, Task> = new Map()
export const notes: Map<string, Note> = new Map()

// Utility function to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Seed initial data
export function seedData() {
  const now = new Date().toISOString()
  
  // Add sample customers
  const customer1: Customer = {
    id: generateId(),
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acmecorp.com',
    phone: '555-1234',
    company: 'Acme Corporation',
    address: '123 Business Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'USA',
    createdAt: now,
    updatedAt: now,
  }
  
  const customer2: Customer = {
    id: generateId(),
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techstart.io',
    phone: '555-5678',
    company: 'TechStart Inc',
    address: '456 Innovation Dr',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    createdAt: now,
    updatedAt: now,
  }
  
  customers.set(customer1.id, customer1)
  customers.set(customer2.id, customer2)
  
  // Add sample leads
  const lead1: Lead = {
    id: generateId(),
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@globaltech.com',
    phone: '555-9999',
    company: 'Global Tech Solutions',
    title: 'VP Sales',
    source: 'website',
    status: 'qualified',
    notes: 'High potential lead, interested in enterprise plan',
    createdAt: now,
    updatedAt: now,
  }
  
  leads.set(lead1.id, lead1)
  
  // Add sample deals
  const deal1: Deal = {
    id: generateId(),
    name: 'Enterprise Software License',
    value: 50000,
    currency: 'USD',
    stage: 'proposal',
    customerId: customer1.id,
    probability: 75,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Waiting for customer approval on terms',
    createdAt: now,
    updatedAt: now,
  }
  
  deals.set(deal1.id, deal1)
  
  // Add sample tasks
  const task1: Task = {
    id: generateId(),
    title: 'Follow up with Acme Corporation',
    description: 'Call John Smith about contract terms',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'todo',
    priority: 'high',
    customerId: customer1.id,
    createdAt: now,
    updatedAt: now,
  }
  
  tasks.set(task1.id, task1)
}
