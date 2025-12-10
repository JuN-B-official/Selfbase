import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import { handler } from './handler.js'

serve(handler)

console.log('Serving og-images function')
