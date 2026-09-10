import { Router, Request, Response } from 'express'
import { tasks, generateId } from '../models/index'
import { Task } from '../types/index'

const router = Router()

// GET all tasks
router.get('/', (_req: Request, res: Response) => {
  const taskList = Array.from(tasks.values())
  res.json(taskList)
})

// GET task by ID
router.get('/:id', (req: Request, res: Response): void => {
  const task = tasks.get(req.params.id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json(task)
})

// POST create task
router.post('/', (req: Request, res: Response): void => {
  try {
    const { title, description, dueDate, status, priority, customerId, leadId, dealId, assignedTo } = req.body
    
    if (!title || !dueDate) {
      res.status(400).json({ error: 'title and dueDate are required' })
      return
    }
    
    const now = new Date().toISOString()
    const newTask: Task = {
      id: generateId(),
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
    
    tasks.set(newTask.id, newTask)
    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT update task
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const task = tasks.get(req.params.id)
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    
    const updated: Task = {
      ...task,
      ...req.body,
      id: task.id,
      createdAt: task.createdAt,
      updatedAt: new Date().toISOString(),
    }
    
    tasks.set(updated.id, updated)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE task
router.delete('/:id', (req: Request, res: Response): void => {
  const task = tasks.get(req.params.id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  
  tasks.delete(req.params.id)
  res.json({ success: true, message: 'Task deleted' })
})

export default router
