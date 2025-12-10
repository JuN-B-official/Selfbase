import { LogoutButton } from '@/registry/default/blocks/password-based-auth-nextjs/components/logout-button'
import { createClient } from '@/registry/default/clients/nextjs/lib/selfbase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const selfbase = await createClient()

  const { data, error } = await selfbase.auth.getUser()
  if (error || !data?.user) {
    redirect('/example/password-based-auth/auth/login')
  }

  return (
    <>
      <p>Hello {data.user.email}</p>
      <LogoutButton />
    </>
  )
}
