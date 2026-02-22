import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Slid {
  id: string
  short_id: string
  creator_address: string
  client_name: string
  client_email?: string
  amount: number
  currency: 'USDC'
  description: string
  scope?: string
  terms?: string
  status: 'draft' | 'pending' | 'paid' | 'expired'
  tx_hash?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface CreateSlidInput {
  creator_address: string
  client_name: string
  client_email?: string
  amount: number
  description: string
  scope?: string
  terms?: string
}
