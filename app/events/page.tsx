import { currentUser } from "@clerk/nextjs/server"
import { EventService } from "@/lib/api-client"
import type { MembershipLevel } from "@/lib/tier-utils"
import EventCard from "@/components/event-card"
import RestrictedEventCard from "@/components/locked-event-card"
import ApplicationHeader from "@/components/header"
import EventFilterPanel from "@/components/events-filter"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import EventsSkeleton from "@/components/events-skeleton"

interface EventsPageConfiguration {
  searchParams: {
    tier?: string
    search?: string
  }
}

export default async function EventsDiscoveryPage({ searchParams }: EventsPageConfiguration) {
  const authenticatedUser = await currentUser()

  if (!authenticatedUser) {
    redirect("/")
  }

  const userMembershipLevel = (authenticatedUser.publicMetadata?.tier as MembershipLevel) || "free"

  const userProfileData = {
    firstName: authenticatedUser.firstName,
    lastName: authenticatedUser.lastName,
    emailAddresses: authenticatedUser.emailAddresses?.map(email => ({ emailAddress: email.emailAddress })) || [],
    id: authenticatedUser.id
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ApplicationHeader userData={userProfileData} currentMembershipLevel={userMembershipLevel} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Your Events
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover events available for your <span className="font-semibold text-purple-700">{userMembershipLevel}</span> membership and unlock amazing experiences
          </p>
        </div>

        <EventFilterPanel userMembershipLevel={userMembershipLevel} />

        <Suspense fallback={<EventsSkeleton />}>
          <EventsDisplayGrid userMembershipLevel={userMembershipLevel} userId={authenticatedUser.id} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function EventsDisplayGrid({
  userMembershipLevel,
  userId,
  searchParams,
}: {
  userMembershipLevel: MembershipLevel
  userId: string
  searchParams: { tier?: string; search?: string }
}) {
  try {
    const allEventsList = await EventService.fetchAllEventsIncludingRestricted(userMembershipLevel, userId)

    let filteredEventsList = allEventsList

    if (searchParams.tier && searchParams.tier !== "all") {
      filteredEventsList = allEventsList.filter((eventItem) => eventItem.tier === searchParams.tier)
    }

    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase()
      filteredEventsList = filteredEventsList.filter(
        (eventItem) =>
          eventItem.title.toLowerCase().includes(searchTerm) || eventItem.description.toLowerCase().includes(searchTerm),
      )
    }

    if (filteredEventsList.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-1 12a2 2 0 002 2h8a2 2 0 002-2L13 7M9 7h6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">
            {searchParams.search || searchParams.tier !== "all"
              ? "Try adjusting your filters or search terms."
              : "Check back later for new events in your tier."}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEventsList.map((eventItem) => (
          eventItem.is_accessible ? (
            <EventCard key={eventItem.id} eventData={eventItem} currentUserId={userId} />
          ) : (
            <RestrictedEventCard key={eventItem.id} eventData={eventItem} />
          )
        ))}
      </div>
    )
  } catch (loadingError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading events</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }
}