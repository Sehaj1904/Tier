import { createClient } from "@supabase/supabase-js"

const databaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const publicApiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(databaseUrl, publicApiKey)

export type EventDetails = {
  id: string
  title: string
  description: string
  event_date: string
  image_url: string | null
  tier: "free" | "silver" | "gold" | "platinum"
  location: string | null
  max_attendees: number
  current_attendees: number
  created_at: string
  updated_at: string
}

export type UserEventResponse = {
  id: string
  user_id: string
  event_id: string
  rsvp_date: string
  status: "attending" | "maybe" | "not_attending"
}

export type EventWithUserResponse = EventDetails & {
  user_rsvp?: UserEventResponse
  is_full?: boolean
  is_accessible?: boolean
}
