import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { Lead } from '../types/index.js'

const router = Router()

// GET all leads
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch leads:', error)
    res.status(500).json({ error: 'Failed to fetch leads' })
    return
  }

  res.json(data as Lead[])
})

// GET lead by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Lead not found' })
    return
  }

  res.json(data as Lead)
})

// POST create lead
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
      source,
      status,
      notes,
    } = req.body

    if (!firstName || !lastName || !email) {
      res.status(400).json({
        error: 'firstName, lastName, and email are required',
      })
      return
    }

    const now = new Date().toISOString()

    const newLead: Lead = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
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

    const { data, error } = await supabase
      .from('leads')
      .insert(newLead)
      .select()
      .single()

    if (error) {
      console.error('Failed to create lead:', error)
      res.status(500).json({ error: 'Failed to create lead' })
      return
    }

    res.status(201).json(data as Lead)
  } catch (error) {
    console.error('Failed to create lead:', error)
    res.status(500).json({ error: 'Failed to create lead' })
  }
})

// PUT update lead
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: existingLead, error: findError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (findError || !existingLead) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }

    const updated = {
      ...existingLead,
      ...req.body,
      id: existingLead.id,
      createdAt: existingLead.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('leads')
      .update(updated)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update lead:', error)
      res.status(500).json({ error: 'Failed to update lead' })
      return
    }

    res.json(data as Lead)
  } catch (error) {
    console.error('Failed to update lead:', error)
    res.status(500).json({ error: 'Failed to update lead' })
  }
})

// DELETE lead
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data: existingLead, error: findError } = await supabase
    .from('leads')
    .select('id')
    .eq('id', req.params.id)
    .single()

  if (findError || !existingLead) {
    res.status(404).json({ error: 'Lead not found' })
    return
  }

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    console.error('Failed to delete lead:', error)
    res.status(500).json({ error: 'Failed to delete lead' })
    return
  }

  res.json({ success: true, message: 'Lead deleted' })
})

export default router
