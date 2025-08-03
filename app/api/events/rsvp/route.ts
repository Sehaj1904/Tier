import { currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { EventService } from "@/lib/api-client"

export async function POST(apiRequest: NextRequest) {
  try {
    const authenticatedUser = await currentUser()
    
    if (!authenticatedUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const requestBody = await apiRequest.json()
    const { eventId, status: responseStatus } = requestBody

    if (!eventId || !responseStatus) {
      return NextResponse.json({ error: "Event ID and status are required" }, { status: 400 })
    }

    if (!["attending", "maybe", "not_attending"].includes(responseStatus)) {
      return NextResponse.json({ error: "Invalid response status" }, { status: 400 })
    }

    const updatedEventResponse = await EventService.updateUserEventResponse(
      authenticatedUser.id,
      eventId,
      responseStatus
    )

    return NextResponse.json({ 
      success: true, 
      data: updatedEventResponse 
    })

  } catch (processingError) {
    console.error("Event response processing failed:", processingError)
    return NextResponse.json(
      { error: "Failed to process event response" },
      { status: 500 }
    )
  }
}