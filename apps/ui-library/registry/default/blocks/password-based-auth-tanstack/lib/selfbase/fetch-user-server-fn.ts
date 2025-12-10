import { createClient } from '@/registry/default/clients/tanstack/lib/selfbase/server'
import type { Factor, User } from '@supabase/supabase-js'
import { createServerFn } from '@tanstack/react-start'
type SSRSafeUser = User & {
  factors: (Factor & { factor_type: 'phone' | 'totp' })[]
}

export const fetchUser: () => Promise<SSRSafeUser | null> = createServerFn({
  method: 'GET',
}).handler(async () => {
  const selfbase = createClient()
  const { data, error } = await selfbase.auth.getUser()

  if (error) {
    return null
  }

  return data.user as SSRSafeUser
})
