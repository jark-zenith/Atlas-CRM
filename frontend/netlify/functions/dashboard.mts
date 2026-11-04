import { getDatabase } from '@netlify/database'
import type { Config } from '@netlify/functions'

type CustomerActivity = {
  id: string
  first_name: string
  last_name: string
  created_at: Date | string
}

type WonDeal = {
  id: string
  name: string
  value: string | number
  updated_at: Date | string
}

type UpcomingTask = {
  id: string
  title: string
  due_date: Date | string
  status: string
  priority: string
}

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const db = getDatabase()
    const [counts, customers, wonDeals, tasks] = await Promise.all([
      db.sql`
        SELECT
          (SELECT COUNT(*)::int FROM customers) AS total_customers,
          (SELECT COUNT(*)::int FROM leads WHERE status = 'new') AS new_leads,
          (SELECT COUNT(*)::int FROM deals WHERE stage NOT IN ('won', 'lost')) AS active_deals,
          (SELECT COALESCE(SUM(value), 0)::float8 FROM deals WHERE stage = 'won') AS total_revenue,
          (SELECT COUNT(*)::int FROM deals WHERE stage = 'won') AS won_deals,
          (SELECT COUNT(*)::int FROM deals) AS total_deals
      `,
      db.sql`
        SELECT id, first_name, last_name, created_at
        FROM customers
        ORDER BY created_at DESC
        LIMIT 3
      `,
      db.sql`
        SELECT id, name, value, updated_at
        FROM deals
        WHERE stage = 'won'
        ORDER BY updated_at DESC
        LIMIT 2
      `,
      db.sql`
        SELECT id, title, due_date, status, priority
        FROM tasks
        WHERE status <> 'done'
        ORDER BY due_date ASC
        LIMIT 5
      `,
    ])

    const totals = counts[0]
    const totalDeals = Number(totals.total_deals)
    const conversionRate = totalDeals > 0
      ? Math.round((Number(totals.won_deals) / totalDeals) * 100)
      : 0

    const recentActivity = [
      ...(customers as CustomerActivity[]).map((customer) => ({
        id: customer.id,
        type: 'customer_created',
        description: `New customer: ${customer.first_name} ${customer.last_name}`,
        createdAt: customer.created_at,
      })),
      ...(wonDeals as WonDeal[]).map((deal) => ({
        id: deal.id,
        type: 'deal_won',
        description: `Deal won: ${deal.name} ($${deal.value})`,
        createdAt: deal.updated_at,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    return Response.json({
      totalCustomers: Number(totals.total_customers),
      newLeads: Number(totals.new_leads),
      activeDeals: Number(totals.active_deals),
      totalRevenue: Number(totals.total_revenue),
      conversionRate,
      recentActivity,
      upcomingTasks: (tasks as UpcomingTask[]).map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error)
    return Response.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}

export const config: Config = {
  path: '/api/dashboard',
}
