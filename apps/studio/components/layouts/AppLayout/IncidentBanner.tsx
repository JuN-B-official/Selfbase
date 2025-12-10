import Link from 'next/link'

import { HeaderBanner } from 'components/interfaces/Organization/HeaderBanner'

export const IncidentBanner = () => {
  return (
    <Link href="https://status.selfbase.com" target="_blank" rel="noopener noreferrer">
      <HeaderBanner
        type="incident"
        title="We are currently investigating a technical issue"
        message="Follow status.selfbase.com for updates"
      />
    </Link>
  )
}
