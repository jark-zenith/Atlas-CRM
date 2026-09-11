import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { Task } from '../types/index.js'

const router = Router()

// GET all tasks
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('dueDate', { ascending: true })

  if (error) {
    console.error('Failed to fetch tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
    return
  }

  res.json(data as Task[])
})

// GET task by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.json(data as Task)
})

// POST create task
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      dueDate,
      status,
      priority,
      customerId,
      leadId,
      dealId,
      assignedTo,
    } = req.body

    if (!title || !dueDate) {
      res.status(400).json({ error: 'title and dueDate are required' })
      return
    }

    const now = new Date().toISOString()

    const newTask: Task = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      title,
      description,
      dueDate,
      status: status || 'todo',
      priority: priority || 'medium',
      customerId,
      leadId,
      dealId,
      assignedTo,
      createdAt: now,
      updatedAt: now,
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single()

    if (error) {
      console.error('Failed to create task:', error)
      res.status(500).json({ error: 'Failed to create task' })
      return
    }

    res.status(201).json(data as Task)
  } catch (error) {
    console.error('Failed to create task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT update task
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: existingTask, error: findError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (findError || !existingTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const updated = {
      ...existingTask,
      ...req.body,
      id: existingTask.id,
      createdAt: existingTask.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updated)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update task:', error)
      res.status(500).json({ error: 'Failed to update task' })
      return
    }

    res.json(data as Task)
  } catch (error) {
    console.error('Failed to update task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { data: existingTask, error: findError } = await supabase
    .from('tasks')
    .select('id')
    .eq('id', req.params.id)
    .single()

  if (findError || !existingTask) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    console.error('Failed to delete task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
    return
  }

  res.json({ success: true, message: 'Task deleted' })
})

export default router
