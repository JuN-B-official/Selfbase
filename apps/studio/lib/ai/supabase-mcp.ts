import { createSelfbaseMcpServer } from '@selfbase/mcp-server-selfbase'
import { createSelfbaseApiPlatform } from '@selfbase/mcp-server-selfbase/platform/api'
import { StreamTransport } from '@selfbase/mcp-utils'
import { experimental_createMCPClient as createMCPClient } from 'ai'

import { API_URL } from 'lib/constants'

export async function createSelfbaseMCPClient({
  accessToken,
  projectId,
}: {
  accessToken: string
  projectId: string
}) {
  // Create an in-memory transport pair
  const clientTransport = new StreamTransport()
  const serverTransport = new StreamTransport()
  clientTransport.readable.pipeTo(serverTransport.writable)
  serverTransport.readable.pipeTo(clientTransport.writable)

  // Instantiate the MCP server and connect to its transport
  const apiUrl = API_URL?.replace('/platform', '')
  const server = createSelfbaseMcpServer({
    platform: createSelfbaseApiPlatform({
      accessToken,
      apiUrl,
    }),
    contentApiUrl: process.env.NEXT_PUBLIC_CONTENT_API_URL,
    projectId,
    readOnly: true,
  })
  await server.connect(serverTransport)

  // Create the MCP client and connect to its transport
  const client = await createMCPClient({
    name: 'selfbase-studio',
    transport: clientTransport,
  })

  return client
}
