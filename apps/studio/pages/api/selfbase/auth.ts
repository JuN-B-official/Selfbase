// Selfbase: Authentication API - validates against DASHBOARD_USERNAME/PASSWORD env vars
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  // Selfbase: Validate against environment variables
  const validUsername = process.env.DASHBOARD_USERNAME || 'selfbase'
  const validPassword = process.env.DASHBOARD_PASSWORD || 'this_password_is_insecure_and_should_be_updated'

  if (username === validUsername && password === validPassword) {
    // Generate a simple session token (in production, use JWT or secure session)
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64')

    return res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        username: validUsername,
        role: 'admin'
      }
    })
  }

  return res.status(401).json({ error: 'Invalid username or password' })
}
