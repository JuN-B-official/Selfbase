import { Terminal } from 'lucide-react'

import { useParams } from 'common'
import CommandRender from 'components/interfaces/Functions/CommandRender'
import { Card, CardContent, CardHeader, CardTitle } from 'ui'
import { EmptyStatePresentational } from 'ui-patterns'

export const MigrationsEmptyState = () => {
  const { ref } = useParams()

  const commands = [
    {
      comment: 'Link your project',
      command: `selfbase link --project-ref ${ref}`,
      jsx: () => {
        return (
          <>
            <span className="text-brand-600">selfbase</span> link --project-ref {ref}
          </>
        )
      },
    },
    {
      comment: 'Create a new migration called "new-migration"',
      command: `selfbase migration new new-migration`,
      jsx: () => {
        return (
          <>
            <span className="text-brand-600">selfbase</span> migration new new-migration
          </>
        )
      },
    },
    {
      comment: 'Run all migrations for this project',
      command: `selfbase db push`,
      jsx: () => {
        return (
          <>
            <span className="text-brand-600">selfbase</span> db push
          </>
        )
      },
    },
  ]

  return (
    <EmptyStatePresentational
      icon={Terminal}
      title="Run your first migration"
      description="Create and run your first migration using the Selfbase CLI."
      className="gap-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Terminal instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <CommandRender commands={commands} />
        </CardContent>
      </Card>
    </EmptyStatePresentational>
  )
}
