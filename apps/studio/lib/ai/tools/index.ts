import { AiOptInLevel } from 'hooks/misc/useOrgOptedIntoAi'
import { filterToolsByOptInLevel } from '../tool-filter'
import { getFallbackTools } from './fallback-tools'
import { ToolSet } from 'ai'
import { getSchemaTools } from './schema-tools'
import { getRenderingTools } from './rendering-tools'

export const getTools = async ({
  projectRef,
  connectionString,
  authorization,
  aiOptInLevel,
}: {
  projectRef: string
  connectionString: string
  authorization?: string
  aiOptInLevel: AiOptInLevel
  accessToken?: string
}) => {
  // Always include rendering tools
  let tools: ToolSet = getRenderingTools()

  // For self-hosted, use fallback tools (direct DB access)
  tools = {
    ...tools,
    ...getFallbackTools({
      projectRef,
      connectionString,
      authorization,
      includeSchemaMetadata: aiOptInLevel !== 'disabled',
    }),
    ...getSchemaTools({
      projectRef,
      connectionString,
      authorization,
    }),
  }

  // Filter all tools based on the (potentially modified) AI opt-in level
  const filteredTools: ToolSet = filterToolsByOptInLevel(tools, aiOptInLevel)

  return filteredTools
}

