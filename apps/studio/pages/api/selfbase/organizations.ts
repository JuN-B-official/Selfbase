// Selfbase: Organizations API - no default fallback, users must create their own
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const selfbaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000'
const selfbaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    console.error('Selfbase Organizations API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// GET: List all organizations (no default fallback)
async function handleGet(
  selfbase: SelfbaseClient,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await selfbase
    .from('selfbase.organizations')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    // If table doesn't exist, return empty array (user needs to run migration)
    if (error.code === '42P01') {
      return res.status(200).json([])
    }
    return res.status(400).json({ error: error.message })
  }

  // Return empty array if no organizations - user will be redirected to create one
  return res.status(200).json(data || [])
}

// POST: Create new organization
async function handlePost(
  selfbase: SelfbaseClient,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, billing_email } = req.body

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Organization name is required' })
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const { data, error } = await selfbase
    .from('selfbase.organizations')
    .insert({
      name,
      slug,
      billing_email: billing_email || null,
    })
    .select()
    .single()

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(201).json(data)
}

// DELETE: Delete organization
async function handleDelete(
  selfbase: SelfbaseClient,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' })
  }

  const { error } = await selfbase
    .from('selfbase.organizations')
    .delete()
    .eq('id', id)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}
