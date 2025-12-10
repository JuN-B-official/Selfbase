// Selfbase: Organization Projects API - list projects for an organization
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

import apiWrapper from 'lib/api/apiWrapper'
import { IS_PLATFORM } from 'lib/constants'
import { DEFAULT_PROJECT } from 'lib/constants/api'

const selfbaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000'
const selfbaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetProjects(req, res)
    case 'POST':
      return handleCreateProject(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetProjects = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query
  const { limit = '96', offset = '0', sort = 'name_asc', search } = req.query

  // For self-hosted, try to get from Selfbase DB
  if (!IS_PLATFORM) {
    try {
      const selfbase = createClient(selfbaseUrl, selfbaseServiceKey, {
        auth: { persistSession: false },
      })

      let query = selfbase
        .from('selfbase.projects')
        .select('*', { count: 'exact' })
        .eq('status', 'active')

      // Apply search filter
      if (search && typeof search === 'string') {
        query = query.ilike('name', `%${search}%`)
      }

      // Apply sorting
      if (sort === 'name_asc') {
        query = query.order('name', { ascending: true })
      } else if (sort === 'name_desc') {
        query = query.order('name', { ascending: false })
      } else if (sort === 'created_asc') {
        query = query.order('created_at', { ascending: true })
      } else if (sort === 'created_desc') {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      query = query.range(Number(offset), Number(offset) + Number(limit) - 1)

      const { data, error, count } = await query

      if (!error && data) {
        // Transform to platform format
        const projects = data.map((p: any) => ({
          id: p.id,
          ref: p.id,
          name: p.name,
          status: 'ACTIVE_HEALTHY',
          organization_id: p.organization_id,
          cloud_provider: 'LOCAL',
          region: 'local',
          created_at: p.created_at,
          databases: [
            {
              identifier: p.id,
              host: 'localhost',
              version: '15',
              status: 'ACTIVE_HEALTHY',
              infra_compute_size: 'nano',
            },
          ],
        }))

        return res.status(200).json({
          projects,
          pagination: {
            count: count || 0,
            has_more: (count || 0) > Number(offset) + projects.length,
          },
        })
      }
    } catch (e) {
      console.log('Selfbase DB not available, using default project')
    }
  }

  // Default project fallback
  return res.status(200).json({
    projects: [DEFAULT_PROJECT],
    pagination: { count: 1, has_more: false },
  })
}

const handleCreateProject = async (req: NextApiRequest, res: NextApiResponse) => {
  if (IS_PLATFORM) {
    return res.status(403).json({ error: 'Use platform API for project creation' })
  }

  const { name, description } = req.body
  const { slug } = req.query

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Project name is required' })
  }

  const selfbase = createClient(selfbaseUrl, selfbaseServiceKey, {
    auth: { persistSession: false },
  })

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
  try {
    await selfbase.rpc('selfbase.create_project_schema', {
      project_schema: schemaName,
    })
  } catch (e) {
    console.error('Failed to create project schema:', e)
  }

  return res.status(201).json(data)
}
