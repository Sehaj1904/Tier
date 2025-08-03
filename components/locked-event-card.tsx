"use client"

import Image from "next/image"
import type { EventWithUserResponse } from "@/lib/supabase"
import { membershipBadgeStyles, membershipDisplayNames, type MembershipLevel } from "@/lib/tier-utils"
import { generateMembershipEventIcon } from "@/lib/icon-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users, Clock, Lock } from "lucide-react"

interface RestrictedEventCardProps {
  eventData: EventWithUserResponse
}

export default function RestrictedEventCard({ eventData }: RestrictedEventCardProps) {
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

  const attendanceRatio = (eventData.current_attendees / eventData.max_attendees) * 100

  return (
    <Card className="overflow-hidden relative opacity-80 bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-purple-900/20 z-10 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 text-center shadow-xl border border-white/20">
          <Lock className="w-10 h-10 mx-auto mb-3 text-purple-600" />
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Upgrade to {membershipDisplayNames[eventData.tier as MembershipLevel]}
          </p>
          <p className="text-xs text-gray-600">
            to access this event
          </p>
        </div>
      </div>

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
                  className="bg-gradient-to-r from-gray-400 to-gray-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(attendanceRatio, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}