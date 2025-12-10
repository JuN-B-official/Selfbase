// Selfbase: Platform Organizations API - no default fallback
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

import apiWrapper from 'lib/api/apiWrapper'
import { IS_PLATFORM } from 'lib/constants'

const selfbaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000'
const selfbaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    case 'POST':
      return handlePost(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  // For self-hosted, get from Selfbase DB (no default fallback)
  if (!IS_PLATFORM) {
    try {
      const selfbase = createClient(selfbaseUrl, selfbaseServiceKey, {
        auth: { persistSession: false },
      })

      const { data, error } = await selfbase
        .from('selfbase.organizations')
        .select('*')
        .order('name', { ascending: true })

      if (!error && data) {
        // Transform to platform format - return empty array if no orgs
        const orgs = data.map((org: any) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          billing_email: org.billing_email || 'admin@localhost',
          plan: { id: 'free', name: 'Free' },
        }))
        return res.status(200).json(orgs)
      }

      // Table doesn't exist or error - return empty array
      return res.status(200).json([])
    } catch (e) {
      console.log('Selfbase DB not available')
      return res.status(200).json([])
    }
  }

  // Platform mode - should not reach here in self-hosted
  return res.status(200).json([])
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (IS_PLATFORM) {
    return res.status(403).json({ error: 'Use platform API for organization creation' })
  }

  const { name, billing_email } = req.body

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Organization name is required' })
  }

  const selfbase = createClient(selfbaseUrl, selfbaseServiceKey, {
    auth: { persistSession: false },
  })

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const { data, error } = await selfbase
    .from('selfbase.organizations')
    .insert({ name, slug, billing_email: billing_email || null })
    .select()
    .single()

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(201).json(data)
}
