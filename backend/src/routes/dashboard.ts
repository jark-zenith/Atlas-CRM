import { Router, Request, Response } from 'express'
import { customers, leads, deals, tasks } from '../models/index'
import { DashboardStats } from '../types/index'

const router = Router()

// GET dashboard statistics
router.get('/', (_req: Request, res: Response) => {
  try {
    const customerList = Array.from(customers.values())
    const leadList = Array.from(leads.values())
    const dealList = Array.from(deals.values())
    const taskList = Array.from(tasks.values())
    
    // Calculate stats
    const totalCustomers = customerList.length
    const newLeads = leadList.filter(l => l.status === 'new').length
    const activeDeals = dealList.filter(d => d.stage !== 'won' && d.stage !== 'lost').length
    
    const totalRevenue = dealList
      .filter(d => d.stage === 'won')
      .reduce((sum, d) => sum + d.value, 0)
    
    const wonDeals = dealList.filter(d => d.stage === 'won').length
    const totalDeals = dealList.length
    const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0
    
    // Recent activity
    const recentActivity = [
      ...customerList.slice(-3).map(c => ({
        id: c.id,
        type: 'customer_created' as const,
        description: `New customer: ${c.firstName} ${c.lastName}`,
        createdAt: c.createdAt,
      })),
      ...dealList.filter(d => d.stage === 'won').slice(-2).map(d => ({
        id: d.id,
        type: 'deal_won' as const,
        description: `Deal won: ${d.name} ($${d.value})`,
        createdAt: d.updatedAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    
    // Upcoming tasks
    const upcomingTasks = taskList
      .filter(t => t.status !== 'done')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
    
    const stats: DashboardStats = {
      totalCustomers,
      newLeads,
      activeDeals,
      totalRevenue,
      conversionRate,
      recentActivity,
      upcomingTasks,
    }
    
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

export default router
