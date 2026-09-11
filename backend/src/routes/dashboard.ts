import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'
import { DashboardStats, Customer, Lead, Deal, Task } from '../types/index.js'

const router = Router()

// GET dashboard statistics
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      { data: customerList, error: customersError },
      { data: leadList, error: leadsError },
      { data: dealList, error: dealsError },
      { data: taskList, error: tasksError },
    ] = await Promise.all([
      supabase
        .from('customers')
        .select('*')
        .order('createdAt', { ascending: true }),

      supabase
        .from('leads')
        .select('*')
        .order('createdAt', { ascending: true }),

      supabase
        .from('deals')
        .select('*')
        .order('createdAt', { ascending: true }),

      supabase
        .from('tasks')
        .select('*'),
    ])

    if (customersError || leadsError || dealsError || tasksError) {
      console.error('Failed to fetch dashboard data:', {
        customersError,
        leadsError,
        dealsError,
        tasksError,
      })

      res.status(500).json({ error: 'Failed to fetch dashboard stats' })
      return
    }

    const customers = (customerList || []) as Customer[]
    const leads = (leadList || []) as Lead[]
    const deals = (dealList || []) as Deal[]
    const tasks = (taskList || []) as Task[]

    // Calculate stats
    const totalCustomers = customers.length

    const newLeads = leads.filter(
      lead => lead.status === 'new'
    ).length

    const activeDeals = deals.filter(
      deal => deal.stage !== 'won' && deal.stage !== 'lost'
    ).length

    const totalRevenue = deals
      .filter(deal => deal.stage === 'won')
      .reduce((sum, deal) => sum + Number(deal.value), 0)

    const wonDeals = deals.filter(
      deal => deal.stage === 'won'
    ).length

    const totalDeals = deals.length

    const conversionRate =
      totalDeals > 0
        ? Math.round((wonDeals / totalDeals) * 100)
        : 0

    // Recent activity
    const recentActivity = [
      ...customers.slice(-3).map(customer => ({
        id: customer.id,
        type: 'customer_created' as const,
        description: `New customer: ${customer.firstName} ${customer.lastName}`,
        createdAt: customer.createdAt,
      })),

      ...deals
        .filter(deal => deal.stage === 'won')
        .slice(-2)
        .map(deal => ({
          id: deal.id,
          type: 'deal_won' as const,
          description: `Deal won: ${deal.name} ($${deal.value})`,
          createdAt: deal.updatedAt,
        })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5)

    // Upcoming tasks
    const upcomingTasks = tasks
      .filter(task => task.status !== 'done')
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      )
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
    console.error('Failed to fetch dashboard stats:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

export default router
