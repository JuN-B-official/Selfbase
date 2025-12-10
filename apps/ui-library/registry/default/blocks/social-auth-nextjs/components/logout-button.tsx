'use client'

import { createClient } from '@/registry/default/clients/nextjs/lib/selfbase/client'
import { Button } from '@/registry/default/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const selfbase = createClient()
    await selfbase.auth.signOut()
    router.push('/example/password-based-auth/auth/login')
  }

  return <Button onClick={logout}>Logout</Button>
}
