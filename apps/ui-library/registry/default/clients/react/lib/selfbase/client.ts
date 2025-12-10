import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSelfbaseClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  )
}
