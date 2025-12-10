import type { ContentFileProps } from 'components/interfaces/Connect/Connect.types'

import {
  ConnectTabs,
  ConnectTabTrigger,
  ConnectTabTriggers,
  ConnectTabContent,
} from 'components/interfaces/Connect/ConnectTabs'
import { SimpleCodeBlock } from 'ui'

const ContentFile = ({ projectKeys }: ContentFileProps) => {
  return (
    <ConnectTabs>
      <ConnectTabTriggers>
        <ConnectTabTrigger value=".env.local" />
        <ConnectTabTrigger value="utils/selfbase.ts" />
        <ConnectTabTrigger value="src/App.jsx" />
      </ConnectTabTriggers>

      <ConnectTabContent value=".env.local">
        <SimpleCodeBlock className="bash" parentClassName="min-h-72">
          {[
            '',
            `SUPABASE_URL=${projectKeys.apiUrl ?? 'your-project-url'}`,
            projectKeys?.publishableKey
              ? `SUPABASE_PUBLISHABLE_DEFAULT_KEY=${projectKeys.publishableKey}`
              : `SUPABASE_ANON_KEY=${projectKeys.anonKey ?? 'your-anon-key'}`,
            '',
          ].join('\n')}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="utils/selfbase.ts">
        <SimpleCodeBlock className="ts" parentClassName="min-h-72">
          {`
import { createClient } from "@selfbase/selfbase-js";

const selfbaseUrl = process.env.SUPABASE_URL;
const selfbaseKey = process.env.${projectKeys.publishableKey ? 'SUPABASE_PUBLISHABLE_DEFAULT_KEY' : 'SUPABASE_ANON_KEY'};

export const selfbase = createClient(selfbaseUrl!, selfbaseKey!);
        `}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="src/App.jsx">
        <SimpleCodeBlock className="jsx" parentClassName="min-h-72">
          {`
import { selfbase } from '../utils/selfbase'
import { createResource, For } from "solid-js";

async function getTodos() {
  const { data: todos } = await selfbase.from("todos").select();
  return data;
}

function App() {
  const [todos] = createResource(getTodos);

  return (
    <ul>
      <For each={todos()}>{(country) => <li>{todo.name}</li>}</For>
    </ul>
  );
}

export default App;
`}
        </SimpleCodeBlock>
      </ConnectTabContent>
    </ConnectTabs>
  )
}

export default ContentFile
