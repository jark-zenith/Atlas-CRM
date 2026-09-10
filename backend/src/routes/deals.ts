import { Router, Request, Response } from 'express'
import { deals, generateId } from '../models/index'
import { Deal } from '../types/index'

const router = Router()

// GET all deals
router.get('/', (_req: Request, res: Response) => {
  const dealList = Array.from(deals.values())
  res.json(dealList)
})

// GET deal by ID
router.get('/:id', (req: Request, res: Response): void => {
  const deal = deals.get(req.params.id)
  if (!deal) {
    res.status(404).json({ error: 'Deal not found' })
    return
  }
  res.json(deal)
})

// POST create deal
router.post('/', (req: Request, res: Response): void => {
  try {
    const { name, value, currency, stage, customerId, contactId, expectedCloseDate, probability, notes } = req.body
    
    if (!name || !value || !customerId) {
      res.status(400).json({ error: 'name, value, and customerId are required' })
      return
    }
    
    const now = new Date().toISOString()
    const newDeal: Deal = {
      id: generateId(),
      name,
      value,
      currency: currency || 'USD',
      stage: stage || 'prospect',
      customerId,
      contactId,
      expectedCloseDate,
      probability: probability || 50,
      notes,
      createdAt: now,
      updatedAt: now,
    }
    
    deals.set(newDeal.id, newDeal)
    res.status(201).json(newDeal)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deal' })
  }
})

// PUT update deal
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const deal = deals.get(req.params.id)
    if (!deal) {
      res.status(404).json({ error: 'Deal not found' })
      return
    }
    
    const updated: Deal = {
      ...deal,
      ...req.body,
      id: deal.id,
      createdAt: deal.createdAt,
      updatedAt: new Date().toISOString(),
    }
    
    deals.set(updated.id, updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deal' })
  }
})

// DELETE deal
router.delete('/:id', (req: Request, res: Response): void => {
  const deal = deals.get(req.params.id)
  if (!deal) {
    res.status(404).json({ error: 'Deal not found' })
    return
  }
  
  deals.delete(req.params.id)
  res.json({ success: true, message: 'Deal deleted' })
})

export default router
