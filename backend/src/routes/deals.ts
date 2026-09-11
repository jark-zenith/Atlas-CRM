import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { Deal } from '../types/index.js'

const router = Router()

// GET all deals
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch deals:', error)
    res.status(500).json({ error: 'Failed to fetch deals' })
    return
  }

  res.json(data as Deal[])
})

// GET deal by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Deal not found' })
    return
  }

  res.json(data as Deal)
})

// POST create deal
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      value,
      currency,
      stage,
      customerId,
      contactId,
      expectedCloseDate,
      probability,
      notes,
    } = req.body

    if (!name || value === undefined || value === null || !customerId) {
      res.status(400).json({
        error: 'name, value, and customerId are required',
      })
      return
    }

    const now = new Date().toISOString()

    const newDeal: Deal = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      name,
      value,
      currency: currency || 'USD',
      stage: stage || 'prospect',
      customerId,
      contactId,
      expectedCloseDate,
      probability: probability ?? 50,
      notes,
      createdAt: now,
      updatedAt: now,
    }

    const { data, error } = await supabase
      .from('deals')
      .insert(newDeal)
      .select()
      .single()

    if (error) {
      console.error('Failed to create deal:', error)
      res.status(500).json({ error: 'Failed to create deal' })
      return
    }

    res.status(201).json(data as Deal)
  } catch (error) {
    console.error('Failed to create deal:', error)
    res.status(500).json({ error: 'Failed to create deal' })
  }
})

// PUT update deal
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: existingDeal, error: findError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (findError || !existingDeal) {
      res.status(404).json({ error: 'Deal not found' })
      return
    }

    const updated = {
      ...existingDeal,
      ...req.body,
      id: existingDeal.id,
      createdAt: existingDeal.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('deals')
      .update(updated)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update deal:', error)
      res.status(500).json({ error: 'Failed to update deal' })
      return
    }

    res.json(data as Deal)
  } catch (error) {
    console.error('Failed to update deal:', error)
    res.status(500).json({ error: 'Failed to update deal' })
  }
})

// DELETE deal
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data: existingDeal, error: findError } = await supabase
    .from('deals')
    .select('id')
    .eq('id', req.params.id)
    .single()

  if (findError || !existingDeal) {
    res.status(404).json({ error: 'Deal not found' })
    return
  }

  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    console.error('Failed to delete deal:', error)
    res.status(500).json({ error: 'Failed to delete deal' })
    return
  }

  res.json({ success: true, message: 'Deal deleted' })
})

export default router
