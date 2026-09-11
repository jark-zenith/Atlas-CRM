import express, { Express, Request, Response } from 'express'
import customerRoutes from './routes/customers.js'
import leadRoutes from './routes/leads.js'
import contactRoutes from './routes/contacts.js'
import dealRoutes from './routes/deals.js'
import taskRoutes from './routes/tasks.js'
import noteRoutes from './routes/notes.js'
import dashboardRoutes from './routes/dashboard.js'

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req: Request, res: Response, next: () => void): void => {
  const origin = req.headers.origin || '*'
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})


// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'CRM API is running',
    timestamp: new Date().toISOString(),
  })
})

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'CRM API',
    version: '1.0.0',
    description: 'Customer Relationship Management System API',
  })
})

// Mount route handlers
app.use('/api/customers', customerRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/deals', dealRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  })
})

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`[CRM API] Server is running at http://localhost:${PORT}`)
  console.log(`[CRM API] Health check available at http://localhost:${PORT}/api/health`)
  console.log(`[CRM API] API documentation:`)
  console.log(`  GET    /api/customers`)
  console.log(`  GET    /api/leads`)
  console.log(`  GET    /api/contacts`)
  console.log(`  GET    /api/deals`)
  console.log(`  GET    /api/tasks`)
  console.log(`  GET    /api/notes`)
  console.log(`  GET    /api/dashboard`)
})

export default server
