import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserType = {
  id: string
  email: string
  display_name: string
  modules: {
    poster: { uploads: any[] }
    wardMap: { links: string[] }
    skywalk: { images: string[] }
    survey: { data: any }
    interview: { media: string[] }
    mapillary: { links: string[]; images: string[] }
    problemSolving: { links: string[] }
  }
}