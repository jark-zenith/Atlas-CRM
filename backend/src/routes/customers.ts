import { Router, Request, Response } from 'express'
import { customers, generateId } from '../models/index'
import { Customer } from '../types/index'

const router = Router()

// GET all customers
router.get('/', (_req: Request, res: Response) => {
  const customerList = Array.from(customers.values())
  res.json(customerList)
})

// GET customer by ID
router.get('/:id', (req: Request, res: Response): void => {
  const customer = customers.get(req.params.id)
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' })
    return
  }
  res.json(customer)
})

// POST create customer
router.post('/', (req: Request, res: Response): void => {
  try {
    const { firstName, lastName, email, phone, company, address, city, state, zipCode, country } = req.body
    
    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: 'firstName, lastName, and email are required' })
      return
    }
    
    const now = new Date().toISOString()
    const newCustomer: Customer = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      city,
      state,
      zipCode,
      country,
      createdAt: now,
      updatedAt: now,
    }
    
    customers.set(newCustomer.id, newCustomer)
    res.status(201).json(newCustomer)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' })
  }
})

// PUT update customer
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const customer = customers.get(req.params.id)
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' })
      return
    }
    
    const updated: Customer = {
      ...customer,
      ...req.body,
      id: customer.id,
      createdAt: customer.createdAt,
      updatedAt: new Date().toISOString(),
    }
    
    customers.set(updated.id, updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' })
  }
})

// DELETE customer
router.delete('/:id', (req: Request, res: Response): void => {
  const customer = customers.get(req.params.id)
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' })
    return
  }
  
  customers.delete(req.params.id)
  res.json({ success: true, message: 'Customer deleted' })
})

export default router
