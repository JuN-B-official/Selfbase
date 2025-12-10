import { IS_PLATFORM, useParams } from 'common'
import Panel from 'components/ui/Panel'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { BASE_PATH } from 'lib/constants'
import { McpConfigPanel } from 'ui-patterns/McpUrlBuilder'
import type { projectKeys } from './Connect.types'

export const McpTabContent = ({ projectKeys }: { projectKeys: projectKeys }) => {
  const { ref: projectRef } = useParams()

  return (
    <Panel className="bg-inherit border-none shadow-none">
      {projectRef ? (
        <McpConfigPanel
          basePath={BASE_PATH}
          projectRef={projectRef}
          isPlatform={IS_PLATFORM}
          apiUrl={projectKeys.apiUrl ?? undefined}
          serviceKey={projectKeys.serviceKey ?? undefined}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <ShimmeringLoader className="w-3/4" />
          <ShimmeringLoader className="w-1/2" />
        </div>
      )}
    </Panel>
  )
}
