import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Falten VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY al .env')
}

export const supabase = createClient(url, key)
