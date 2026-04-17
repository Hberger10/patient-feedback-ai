import { createBrowserClient } from '@supabase/ssr'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Erro: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não foram encontradas no .env.local')
}



export function createClient() {
  
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  )
}