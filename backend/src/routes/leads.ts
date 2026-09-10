import { Router, Request, Response } from 'express'
import { leads, generateId } from '../models/index'
import { Lead } from '../types/index'

const router = Router()

// GET all leads
router.get('/', (_req: Request, res: Response) => {
  const leadList = Array.from(leads.values())
  res.json(leadList)
})

// GET lead by ID
router.get('/:id', (req: Request, res: Response): void => {
  const lead = leads.get(req.params.id)
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' })
    return
  }
  res.json(lead)
})

// POST create lead
router.post('/', (req: Request, res: Response): void => {
  try {
    const { firstName, lastName, email, phone, company, title, source, status, notes } = req.body
    
    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: 'firstName, lastName, and email are required' })
      return
    }
    
    const now = new Date().toISOString()
    const newLead: Lead = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
      source: source || 'other',
      status: status || 'new',
      notes,
      createdAt: now,
      updatedAt: now,
    }
    
    leads.set(newLead.id, newLead)
    res.status(201).json(newLead)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' })
  }
})

// PUT update lead
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const lead = leads.get(req.params.id)
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }
    
    const updated: Lead = {
      ...lead,
      ...req.body,
      id: lead.id,
      createdAt: lead.createdAt,
      updatedAt: new Date().toISOString(),
    }
    
    leads.set(updated.id, updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' })
  }
})

// DELETE lead
router.delete('/:id', (req: Request, res: Response): void => {
  const lead = leads.get(req.params.id)
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' })
    return
  }
  
  leads.delete(req.params.id)
  res.json({ success: true, message: 'Lead deleted' })
})

export default router
