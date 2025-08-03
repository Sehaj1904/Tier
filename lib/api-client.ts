import { supabase, type EventDetails, type UserEventResponse, type EventWithUserResponse } from "./supabase"
import { type MembershipLevel, getMembershipAccess } from "./tier-utils"

class EventService {
  static async fetchUserAccessibleEvents(membershipLevel: MembershipLevel, currentUserId?: string): Promise<EventWithUserResponse[]> {
    const allowedMembershipLevels = getMembershipAccess(membershipLevel)

    const eventQuery = supabase
      .from("events")
      .select(`
        *,
        user_events!left(*)
      `)
      .in("tier", allowedMembershipLevels)
      .order("event_date", { ascending: true })

    const { data: eventsList, error: fetchError } = await eventQuery

    if (fetchError) {
      console.error("Could not retrieve events:", fetchError)
      throw new Error("Unable to load events at this time")
    }

    return this.transformEventsWithUserData(eventsList || [], currentUserId, membershipLevel)
  }

  static async fetchAllEventsIncludingRestricted(membershipLevel: MembershipLevel, currentUserId?: string): Promise<EventWithUserResponse[]> {
    const allEventsQuery = supabase
      .from("events")
      .select(`
        *,
        user_events!left(*)
      `)
      .order("event_date", { ascending: true })

    const { data: completeEventsList, error: queryError } = await allEventsQuery

    if (queryError) {
      console.error("Failed to retrieve complete events list:", queryError)
      throw new Error("Could not load events")
    }

    return this.transformEventsWithUserData(completeEventsList || [], currentUserId, membershipLevel)
  }

  static async updateUserEventResponse(userId: string, eventId: string, responseStatus: "attending" | "maybe" | "not_attending") {
    const currentTimestamp = new Date().toISOString()
    
    const { data: updatedResponse, error: updateError } = await supabase
      .from("user_events")
      .upsert(
        {
          user_id: userId,
          event_id: eventId,
          status: responseStatus,
          rsvp_date: currentTimestamp,
        },
        {
          onConflict: "user_id,event_id",
        }
      )
      .select()

    if (updateError) {
      console.error("RSVP update failed:", updateError)
      throw new Error("Could not update your event response")
    }

    return updatedResponse
  }

  static async fetchUserEventResponses(userId: string): Promise<UserEventResponse[]> {
    const { data: userResponses, error: responseError } = await supabase
      .from("user_events")
      .select("*")
      .eq("user_id", userId)

    if (responseError) {
      console.error("Could not fetch user event responses:", responseError)
      throw new Error("Unable to load your event responses")
    }

    return userResponses || []
  }

  static async findEventById(eventId: string): Promise<EventDetails | null> {
    const { data: eventData, error: lookupError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (lookupError) {
      console.error("Event lookup failed:", lookupError)
      return null
    }

    return eventData
  }

  private static transformEventsWithUserData(rawEventData: any[], userId?: string, userMembershipLevel?: MembershipLevel): EventWithUserResponse[] {
    const userAccessLevels = userMembershipLevel ? getMembershipAccess(userMembershipLevel) : []

    return rawEventData.map((eventItem: any) => ({
      ...eventItem,
      user_rsvp: userId ? eventItem.user_events?.find((response: any) => response.user_id === userId) : undefined,
      is_full: eventItem.current_attendees >= eventItem.max_attendees,
      is_accessible: userAccessLevels.includes(eventItem.tier),
    }))
  }
}

export { EventService }