// Selfbase: Projects API endpoint for self-hosted multi-project management
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const selfbaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000'
const selfbaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize Selfbase client
  const selfbase = createClient(selfbaseUrl, selfbaseServiceKey, {
    auth: { persistSession: false },
  })

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(selfbase, req, res)
      case 'POST':
        return await handlePost(selfbase, req, res)
      case 'DELETE':
        return await handleDelete(selfbase, req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Selfbase Projects API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// GET: List all projects
async function handleGet(
  selfbase: ReturnType<typeof createClient>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await selfbase
    .from('selfbase.projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    // If table doesn't exist, return empty array
    if (error.code === '42P01') {
      return res.status(200).json([])
    }
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json(data || [])
}

// POST: Create new project
async function handlePost(
  selfbase: ReturnType<typeof createClient>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description } = req.body

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Project name is required' })
  }

  // Generate unique schema name
  const schemaName = `project_${Date.now()}_${Math.random().toString(36).substring(7)}`

  const { data, error } = await selfbase
    .from('selfbase.projects')
    .insert({
      name,
      description: description || null,
      schema_name: schemaName,
      organization_id: '00000000-0000-0000-0000-000000000000',
    })
    .select()
    .single()

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  // Create the project schema
  const { error: schemaError } = await selfbase.rpc('selfbase.create_project_schema', {
    project_schema: schemaName,
  })

  if (schemaError) {
    console.error('Failed to create project schema:', schemaError)
  }

  return res.status(201).json(data)
}

// DELETE: Delete project (soft delete)
async function handleDelete(
  selfbase: ReturnType<typeof createClient>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  const { error } = await selfbase
    .from('selfbase.projects')
    .update({ status: 'deleted', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}
