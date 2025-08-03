"use client"

import Image from "next/image"
import { useState } from "react"
import type { EventWithUserResponse } from "@/lib/supabase"
import { membershipBadgeStyles, membershipDisplayNames, type MembershipLevel } from "@/lib/tier-utils"
import { generateMembershipEventIcon } from "@/lib/icon-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, MapPin, Users, Clock } from "lucide-react"

interface EventCardProps {
  eventData: EventWithUserResponse
  currentUserId: string
}

export default function EventCard({ eventData, currentUserId }: EventCardProps) {
  const [isProcessingResponse, setIsProcessingResponse] = useState(false)
  const [userResponseStatus, setUserResponseStatus] = useState(eventData.user_rsvp?.status || null)
  const { toast } = useToast()

  const eventDateTime = new Date(eventData.event_date)
  const displayDate = eventDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const displayTime = eventDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const submitEventResponse = async (responseType: "attending" | "maybe" | "not_attending") => {
    setIsProcessingResponse(true)
    try {
      const apiResponse = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventData.id,
          status: responseType,
        }),
      })

      if (!apiResponse.ok) {
        throw new Error("Response submission failed")
      }

      setUserResponseStatus(responseType)
      toast({
        title: "Response Updated",
        description: `You are now marked as ${responseType.replace("_", " ")} for this event.`,
      })
    } catch (submissionError) {
      toast({
        title: "Error",
        description: "Failed to update response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingResponse(false)
    }
  }

  const attendanceRatio = (eventData.current_attendees / eventData.max_attendees) * 100

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <div className="relative h-48">
        <Image
          src={eventData.image_url || generateMembershipEventIcon(eventData.id, eventData.tier, 300)}
          alt={eventData.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className={membershipBadgeStyles[eventData.tier as MembershipLevel]}>
            {membershipDisplayNames[eventData.tier as MembershipLevel]}
          </Badge>
        </div>
        {eventData.is_full && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive">Full</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{eventData.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{eventData.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">{displayDate}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <p>{displayTime}</p>
          </div>

          {eventData.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <p className="truncate">{eventData.location}</p>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <div className="flex-1">
              <p>
                {eventData.current_attendees} / {eventData.max_attendees} attending
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${Math.min(attendanceRatio, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => submitEventResponse("attending")}
            disabled={isProcessingResponse || eventData.is_full}
            variant={userResponseStatus === "attending" ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${
              userResponseStatus === "attending" 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg" 
                : "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300"
            }`}
          >
            {userResponseStatus === "attending" ? "Attending" : "Attend"}
          </Button>
          <Button
            onClick={() => submitEventResponse("maybe")}
            disabled={isProcessingResponse}
            variant={userResponseStatus === "maybe" ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${
              userResponseStatus === "maybe" 
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg" 
                : "hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:border-yellow-300"
            }`}
          >
            {userResponseStatus === "maybe" ? "Maybe" : "Maybe"}
          </Button>
        </div>

        {userResponseStatus && (
          <Button
            onClick={() => submitEventResponse("not_attending")}
            disabled={isProcessingResponse}
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Cancel RSVP
          </Button>
        )}
      </CardContent>
    </Card>
  )
}