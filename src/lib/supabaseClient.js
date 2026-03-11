import { createClient } from '@supabase/supabase-js'

// Add these console logs right here
console.log('URL from env:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key from env:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Exists' : 'Missing')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if credentials exist
let supabase

try {
  if (supabaseUrl && supabaseAnonKey && 
      supabaseUrl !== 'your_supabase_url_here' && 
      supabaseUrl.startsWith('https://')) {
    
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client initialized with real credentials')
    
  } else {
    throw new Error('Invalid or missing credentials')
  }
} catch (e) {
  console.log('⚠️ Using enhanced mock Supabase client')
  
  // Create a better mock client with all methods
  supabase = {
    from: (table) => ({
      select: () => ({
        data: [],
        error: null,
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: (data) => Promise.resolve({ data, error: null }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      }),
      upsert: (data) => Promise.resolve({ data, error: null })
    }),
  }
}

export default supabase