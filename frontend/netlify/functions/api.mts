import { getDatabase } from '@netlify/database'
import type { Config, Context } from '@netlify/functions'

type ResourceName = 'customers' | 'leads' | 'contacts' | 'deals' | 'tasks' | 'notes'
type FieldMap = Record<string, string>

type ResourceConfig = {
  fields: FieldMap
  required: string[]
  orderBy: string
}

function getResources(): Record<ResourceName, ResourceConfig> {
  return {
    customers: {
      fields: { firstName: 'first_name', lastName: 'last_name', email: 'email', phone: 'phone', company: 'company', address: 'address', city: 'city', state: 'state', zipCode: 'zip_code', country: 'country' },
      required: ['firstName', 'lastName', 'email'],
      orderBy: 'created_at',
    },
    leads: {
      fields: { firstName: 'first_name', lastName: 'last_name', email: 'email', phone: 'phone', company: 'company', title: 'title', source: 'source', status: 'status', notes: 'notes' },
      required: ['firstName', 'lastName', 'email', 'source', 'status'],
      orderBy: 'created_at',
    },
    contacts: {
      fields: { firstName: 'first_name', lastName: 'last_name', email: 'email', phone: 'phone', company: 'company', title: 'title', customerId: 'customer_id', leadId: 'lead_id' },
      required: ['firstName', 'lastName', 'email'],
      orderBy: 'created_at',
    },
    deals: {
      fields: { name: 'name', value: 'value', currency: 'currency', stage: 'stage', customerId: 'customer_id', contactId: 'contact_id', expectedCloseDate: 'expected_close_date', probability: 'probability', notes: 'notes' },
      required: ['name', 'value', 'currency', 'stage', 'customerId', 'probability'],
      orderBy: 'created_at',
    },
    tasks: {
      fields: { title: 'title', description: 'description', dueDate: 'due_date', status: 'status', priority: 'priority', customerId: 'customer_id', leadId: 'lead_id', dealId: 'deal_id', assignedTo: 'assigned_to' },
      required: ['title', 'dueDate', 'status', 'priority'],
      orderBy: 'due_date',
    },
    notes: {
      fields: { content: 'content', customerId: 'customer_id', leadId: 'lead_id', dealId: 'deal_id', contactId: 'contact_id' },
      required: ['content'],
      orderBy: 'created_at',
    },
  }
}

function toCamelCase(value: string) {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function serializeRow(row: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [toCamelCase(key), value]))
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export default async (req: Request, context: Context) => {
  const resourceName = context.params.resource
  const id = context.params.id

  if (!resourceName && new URL(req.url).pathname === '/api/health') {
    return Response.json({ status: 'ok', message: 'CRM API is running', timestamp: new Date().toISOString() })
  }

  const resources = getResources()
  if (!resourceName || !(resourceName in resources)) {
    return errorResponse('API resource not found', 404)
  }

  const resource = resourceName as ResourceName
  const definition = resources[resource]
  const pool = getDatabase().pool

  try {
    if (req.method === 'GET') {
      const result = id
        ? await pool.query(`SELECT * FROM ${resource} WHERE id = $1 LIMIT 1`, [id])
        : await pool.query(`SELECT * FROM ${resource} ORDER BY ${definition.orderBy} DESC`)

      if (id && result.rows.length === 0) return errorResponse('Record not found', 404)
      return Response.json(id ? serializeRow(result.rows[0]) : result.rows.map(serializeRow))
    }

    if (req.method === 'POST') {
      const body = await req.json() as Record<string, unknown>
      const missing = definition.required.filter((field) => body[field] === undefined || body[field] === '')
      if (missing.length > 0) return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400)

      const entries = Object.entries(definition.fields).filter(([field]) => body[field] !== undefined)
      const columns = ['id', ...entries.map(([, column]) => column), 'created_at', 'updated_at']
      const values = [crypto.randomUUID(), ...entries.map(([field]) => body[field]), new Date(), new Date()]
      const placeholders = values.map((_, index) => `$${index + 1}`)
      const result = await pool.query(
        `INSERT INTO ${resource} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values,
      )
      return Response.json(serializeRow(result.rows[0]), { status: 201 })
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Record ID is required', 400)
      const body = await req.json() as Record<string, unknown>
      const entries = Object.entries(definition.fields).filter(([field]) => body[field] !== undefined)
      if (entries.length === 0) return errorResponse('No supported fields supplied', 400)

      const values = entries.map(([field]) => body[field])
      const assignments = entries.map(([, column], index) => `${column} = $${index + 1}`)
      values.push(new Date(), id)
      const result = await pool.query(
        `UPDATE ${resource} SET ${assignments.join(', ')}, updated_at = $${values.length - 1} WHERE id = $${values.length} RETURNING *`,
        values,
      )
      if (result.rows.length === 0) return errorResponse('Record not found', 404)
      return Response.json(serializeRow(result.rows[0]))
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Record ID is required', 400)
      const result = await pool.query(`DELETE FROM ${resource} WHERE id = $1 RETURNING id`, [id])
      if (result.rows.length === 0) return errorResponse('Record not found', 404)
      return Response.json({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error(`CRM API ${req.method} ${resource} failed`, error)
    const duplicate = error instanceof Error && 'code' in error && error.code === '23505'
    return errorResponse(duplicate ? 'A record with this value already exists' : 'API request failed', duplicate ? 409 : 500)
  }
}

export const config: Config = {
  path: ['/api/health', '/api/:resource', '/api/:resource/:id'],
  excludedPath: '/api/dashboard',
}
