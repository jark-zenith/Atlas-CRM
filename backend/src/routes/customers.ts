import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { Customer } from '../types/index.js'

const router = Router()

// GET all customers
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
    return
  }

  res.json(data as Customer[])
})

// GET customer by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Customer not found' })
    return
  }

  res.json(data as Customer)
})

// POST create customer
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
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
    } = req.body

    if (!firstName || !lastName || !email) {
      res.status(400).json({
        error: 'firstName, lastName, and email are required',
      })
      return
    }

    const now = new Date().toISOString()

    const newCustomer: Customer = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
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

    const { data, error } = await supabase
      .from('customers')
      .insert(newCustomer)
      .select()
      .single()

    if (error) {
      console.error('Failed to create customer:', error)
      res.status(500).json({ error: 'Failed to create customer' })
      return
    }

    res.status(201).json(data as Customer)
  } catch (error) {
    console.error('Failed to create customer:', error)
    res.status(500).json({ error: 'Failed to create customer' })
  }
})

// PUT update customer
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: existingCustomer, error: findError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (findError || !existingCustomer) {
      res.status(404).json({ error: 'Customer not found' })
      return
    }

    const updatedCustomer = {
      ...req.body,
      id: existingCustomer.id,
      createdAt: existingCustomer.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updatedCustomer)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update customer:', error)
      res.status(500).json({ error: 'Failed to update customer' })
      return
    }

    res.json(data as Customer)
  } catch (error) {
    console.error('Failed to update customer:', error)
    res.status(500).json({ error: 'Failed to update customer' })
  }
})

// DELETE customer
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data: customer, error: findError } = await supabase
    .from('customers')
    .select('id')
    .eq('id', req.params.id)
    .single()

  if (findError || !customer) {
    res.status(404).json({ error: 'Customer not found' })
    return
  }

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    console.error('Failed to delete customer:', error)
    res.status(500).json({ error: 'Failed to delete customer' })
    return
  }

  res.json({ success: true, message: 'Customer deleted' })
})

export default router
