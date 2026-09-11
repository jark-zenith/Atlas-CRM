import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { Contact } from '../types/index.js'

const router = Router()

// GET all contacts
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch contacts:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
    return
  }

  res.json(data as Contact[])
})

// GET contact by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Contact not found' })
    return
  }

  res.json(data as Contact)
})

// POST create contact
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
      customerId,
      leadId,
    } = req.body

    if (!firstName || !lastName || !email) {
      res.status(400).json({
        error: 'firstName, lastName, and email are required',
      })
      return
    }

    const now = new Date().toISOString()

    const newContact: Contact = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
      customerId,
      leadId,
      createdAt: now,
      updatedAt: now,
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert(newContact)
      .select()
      .single()

    if (error) {
      console.error('Failed to create contact:', error)
      res.status(500).json({ error: 'Failed to create contact' })
      return
    }

    res.status(201).json(data as Contact)
  } catch (error) {
    console.error('Failed to create contact:', error)
    res.status(500).json({ error: 'Failed to create contact' })
  }
})

// PUT update contact
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: existingContact, error: findError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (findError || !existingContact) {
      res.status(404).json({ error: 'Contact not found' })
      return
    }

    const updated = {
      ...existingContact,
      ...req.body,
      id: existingContact.id,
      createdAt: existingContact.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(updated)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update contact:', error)
      res.status(500).json({ error: 'Failed to update contact' })
      return
    }

    res.json(data as Contact)
  } catch (error) {
    console.error('Failed to update contact:', error)
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

// DELETE contact
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data: existingContact, error: findError } = await supabase
    .from('contacts')
    .select('id')
    .eq('id', req.params.id)
    .single()

  if (findError || !existingContact) {
    res.status(404).json({ error: 'Contact not found' })
    return
  }

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    console.error('Failed to delete contact:', error)
    res.status(500).json({ error: 'Failed to delete contact' })
    return
  }

  res.json({ success: true, message: 'Contact deleted' })
})

export default router
