import type { ContentFileProps } from 'components/interfaces/Connect/Connect.types'

import {
  ConnectTabContent,
  ConnectTabs,
  ConnectTabTrigger,
  ConnectTabTriggers,
} from 'components/interfaces/Connect/ConnectTabs'
import { SimpleCodeBlock } from 'ui'

const ContentFile = ({ projectKeys }: ContentFileProps) => {
  return (
    <ConnectTabs>
      <ConnectTabTriggers>
        <ConnectTabTrigger value=".env.local" />
        <ConnectTabTrigger value="page.tsx" />
        <ConnectTabTrigger value="utils/selfbase/server.ts" />
        <ConnectTabTrigger value="utils/selfbase/client.ts" />
        <ConnectTabTrigger value="utils/selfbase/middleware.ts" />
      </ConnectTabTriggers>

      <ConnectTabContent value=".env.local">
        <SimpleCodeBlock className="bash" parentClassName="min-h-72">
          {[
            '',
            `NEXT_PUBLIC_SUPABASE_URL=${projectKeys.apiUrl ?? 'your-project-url'}`,
            projectKeys?.publishableKey
              ? `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=${projectKeys.publishableKey}`
              : `NEXT_PUBLIC_SUPABASE_ANON_KEY=${projectKeys.anonKey ?? 'your-anon-key'}`,
            '',
          ].join('\n')}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="page.tsx">
        <SimpleCodeBlock className="tsx" parentClassName="min-h-72">
          {`
import { createClient } from '@/utils/selfbase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const selfbase = createClient(cookieStore)

  const { data: todos } = await selfbase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li>{todo}</li>
      ))}
    </ul>
  )
}
`}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="utils/selfbase/server.ts">
        <SimpleCodeBlock className="ts" parentClassName="min-h-72">
          {`
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const selfbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const selfbaseKey = process.env.${projectKeys?.publishableKey ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY'};

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    selfbaseUrl!,
    selfbaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The \`setAll\` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
`}
        </SimpleCodeBlock>
      </ConnectTabContent>
      <ConnectTabContent value="utils/selfbase/client.ts">
        <SimpleCodeBlock className="ts" parentClassName="min-h-72">
          {`
import { createBrowserClient } from "@selfbase/ssr";

const selfbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const selfbaseKey = process.env.${projectKeys?.publishableKey ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY'};

export const createClient = () =>
  createBrowserClient(
    selfbaseUrl!,
    selfbaseKey!,
  );
`}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="utils/selfbase/middleware.ts">
        <SimpleCodeBlock className="ts" parentClassName="min-h-72">
          {`
import { createServerClient, type CookieOptions } from "@selfbase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const selfbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const selfbaseKey = process.env.${projectKeys?.publishableKey ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY'};

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let selfbaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const selfbase = createServerClient(
    selfbaseUrl!,
    selfbaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          selfbaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            selfbaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return selfbaseResponse
};
`}
        </SimpleCodeBlock>
      </ConnectTabContent>
    </ConnectTabs>
  )
}

// [Joshen] Used as a dynamic import
// eslint-disable-next-line no-restricted-exports
export default ContentFile
