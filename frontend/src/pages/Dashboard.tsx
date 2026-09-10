import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, StatCard, Loading, EmptyState } from '@/components/UI'
import { dashboardAPI } from '@/services/api'

interface DashboardStats {
  totalCustomers: number
  newLeads: number
  activeDeals: number
  totalRevenue: number
  conversionRate: number
  recentActivity: any[]
  upcomingTasks: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardAPI.getStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) return <Loading message="Loading dashboard..." />

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Error Loading Dashboard"
        description={error}
      />
    )
  }

  if (!stats) {
    return (
      <EmptyState
        icon="📊"
        title="No Data Available"
        description="Start by adding customers and creating deals"
      />
    )
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your business overview."
      />

      <main className="ml-64 p-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            icon="👥"
            color="blue"
            trend={{ value: 12, direction: 'up' }}
          />
          <StatCard
            label="New Leads"
            value={stats.newLeads}
            icon="🎯"
            color="green"
            trend={{ value: 8, direction: 'up' }}
          />
          <StatCard
            label="Active Deals"
            value={stats.activeDeals}
            icon="💼"
            color="purple"
            trend={{ value: 5, direction: 'down' }}
          />
          <StatCard
            label="Total Revenue"
            value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
            icon="💰"
            color="orange"
            trend={{ value: 24, direction: 'up' }}
          />
        </div>

        {/* Conversion Rate */}
        <div className="mb-8">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Conversion Rate</h2>
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-blue-600">{stats.conversionRate}%</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${stats.conversionRate}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 mt-2">Successfully converted leads to customers</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.description}</p>
                      <p className="text-gray-600 text-sm">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent activity</p>
            )}
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tasks</h2>
            {stats.upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 pb-4 border-b border-gray-200 last:border-0">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-gray-600 text-sm">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No upcoming tasks</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'customer_created':
      return '👤'
    case 'lead_created':
      return '🎯'
    case 'deal_won':
      return '🎉'
    case 'task_completed':
      return '✅'
    default:
      return '📌'
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'low':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
