import { Router, Request, Response } from 'express'
import { notes, generateId } from '../models/index'
import { Note } from '../types/index'

const router = Router()

// GET all notes
router.get('/', (_req: Request, res: Response) => {
  const noteList = Array.from(notes.values())
  res.json(noteList)
})

// GET note by ID
router.get('/:id', (req: Request, res: Response): void => {
  const note = notes.get(req.params.id)
  if (!note) {
    res.status(404).json({ error: 'Note not found' })
    return
  }
  res.json(note)
})

// POST create note
router.post('/', (req: Request, res: Response): void => {
  try {
    const { content, customerId, leadId, dealId, contactId } = req.body
    
    if (!content) {
      res.status(400).json({ error: 'content is required' })
      return
    }
    
    const now = new Date().toISOString()
    const newNote: Note = {
      id: generateId(),
      content,
      customerId,
      leadId,
      dealId,
      contactId,
      createdAt: now,
      updatedAt: now,
    }
    
    notes.set(newNote.id, newNote)
    res.status(201).json(newNote)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// PUT update note
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const note = notes.get(req.params.id)
    if (!note) {
      res.status(404).json({ error: 'Note not found' })
      return
    }
    
    const updated: Note = {
      ...note,
      ...req.body,
      id: note.id,
      createdAt: note.createdAt,
      updatedAt: new Date().toISOString(),
    }
    
    notes.set(updated.id, updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' })
  }
})

// DELETE note
router.delete('/:id', (req: Request, res: Response): void => {
  const note = notes.get(req.params.id)
  if (!note) {
    res.status(404).json({ error: 'Note not found' })
    return
  }
  
  notes.delete(req.params.id)
  res.json({ success: true, message: 'Note deleted' })
})

export default router
