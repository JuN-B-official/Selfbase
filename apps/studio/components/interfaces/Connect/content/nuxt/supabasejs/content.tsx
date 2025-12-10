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
        <ConnectTabTrigger value="src/App.vue" />
      </ConnectTabTriggers>

      <ConnectTabContent value=".env.local">
        <SimpleCodeBlock className="bash" parentClassName="min-h-72">
          {`
SUPABASE_URL=${projectKeys.apiUrl ?? 'your-project-url'}
SUPABASE_KEY=${projectKeys.publishableKey ?? projectKeys.anonKey ?? 'your-anon-key'}
        `}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="utils/selfbase.ts">
        <SimpleCodeBlock className="ts" parentClassName="min-h-72">
          {`
import { createClient } from "@selfbase/selfbase-js";

const selfbaseUrl = process.env.SUPABASE_URL;
const selfbaseKey = process.env.SUPABASE_KEY;

export const selfbase = createClient(selfbaseUrl, selfbaseKey);
        `}
        </SimpleCodeBlock>
      </ConnectTabContent>

      <ConnectTabContent value="src/App.vue">
        <SimpleCodeBlock className="jsx" parentClassName="min-h-72">
          {`
<script setup>
  import { selfbase } from '../utils/selfbase'
  const todos = ref([])

  async function getTodos() {
    const { data } = await selfbase.from('todos').select()
    todos.value = data
  }

  onMounted(() => {
    getTodos()
  })

</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
  </ul>
</template>
`}
        </SimpleCodeBlock>
      </ConnectTabContent>
    </ConnectTabs>
  )
}

export default ContentFile
