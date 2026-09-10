import { Router, Request, Response } from 'express'
import { contacts, generateId } from '../models/index'
import { Contact } from '../types/index'

const router = Router()

// GET all contacts
router.get('/', (_req: Request, res: Response) => {
  const contactList = Array.from(contacts.values())
  res.json(contactList)
})

// GET contact by ID
router.get('/:id', (req: Request, res: Response): void => {
  const contact = contacts.get(req.params.id)
  if (!contact) {
    res.status(404).json({ error: 'Contact not found' })
    return
  }
  res.json(contact)
})

// POST create contact
router.post('/', (req: Request, res: Response): void => {
  try {
    const { firstName, lastName, email, phone, company, title, customerId, leadId } = req.body
    
    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: 'firstName, lastName, and email are required' })
      return
    }
    
    const now = new Date().toISOString()
    const newContact: Contact = {
      id: generateId(),
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
    
    contacts.set(newContact.id, newContact)
    res.status(201).json(newContact)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' })
  }
})

// PUT update contact
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const contact = contacts.get(req.params.id)
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' })
      return
    }
    
    const updated: Contact = {
      ...contact,
      ...req.body,
      id: contact.id,
      createdAt: contact.createdAt,
      updatedAt: new Date().toISOString(),
    }
    
    contacts.set(updated.id, updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

// DELETE contact
router.delete('/:id', (req: Request, res: Response): void => {
  const contact = contacts.get(req.params.id)
  if (!contact) {
    res.status(404).json({ error: 'Contact not found' })
    return
  }
  
  contacts.delete(req.params.id)
  res.json({ success: true, message: 'Contact deleted' })
})

export default router
