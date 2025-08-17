import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error('❌ Supabase Configuration Error:')
  console.error('Missing or invalid Supabase environment variables.')
  console.error('Please check your .env file and ensure:')
  console.error('- VITE_SUPABASE_URL is set to a valid URL (e.g., https://your-project.supabase.co)')
  console.error('- VITE_SUPABASE_ANON_KEY is set to your Supabase anon key')
  console.error('Current values:')
  console.error(`- VITE_SUPABASE_URL: "${supabaseUrl}"`)
  console.error(`- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '[SET]' : '[NOT SET]'}`)
}

export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}