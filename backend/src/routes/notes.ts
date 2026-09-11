import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { Note } from '../types/index.js'

const router = Router()

// GET all notes
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch notes:', error)
    res.status(500).json({ error: 'Failed to fetch notes' })
    return
  }

  res.json(data as Note[])
})

// GET note by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Note not found' })
    return
  }

  res.json(data as Note)
})

// POST create note
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      content,
      customerId,
      leadId,
      dealId,
      contactId,
    } = req.body

    if (!content) {
      res.status(400).json({ error: 'content is required' })
      return
    }

    const now = new Date().toISOString()

    const newNote: Note = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      content,
      customerId,
      leadId,
      dealId,
      contactId,
      createdAt: now,
      updatedAt: now,
    }

    const { data, error } = await supabase
      .from('notes')
      .insert(newNote)
      .select()
      .single()

    if (error) {
      console.error('Failed to create note:', error)
      res.status(500).json({ error: 'Failed to create note' })
      return
    }

    res.status(201).json(data as Note)
  } catch (error) {
    console.error('Failed to create note:', error)
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// PUT update note
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: existingNote, error: findError } = await supabase
      .from('notes')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (findError || !existingNote) {
      res.status(404).json({ error: 'Note not found' })
      return
    }

    const updated = {
      ...existingNote,
      ...req.body,
      id: existingNote.id,
      createdAt: existingNote.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('notes')
      .update(updated)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update note:', error)
      res.status(500).json({ error: 'Failed to update note' })
      return
    }

    res.json(data as Note)
  } catch (error) {
    console.error('Failed to update note:', error)
    res.status(500).json({ error: 'Failed to update note' })
  }
})

// DELETE note
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data: existingNote, error: findError } = await supabase
    .from('notes')
    .select('id')
    .eq('id', req.params.id)
    .single()

  if (findError || !existingNote) {
    res.status(404).json({ error: 'Note not found' })
    return
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    console.error('Failed to delete note:', error)
    res.status(500).json({ error: 'Failed to delete note' })
    return
  }

  res.json({ success: true, message: 'Note deleted' })
})

export default router
