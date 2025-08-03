"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { membershipDisplayNames, getMembershipAccess, type MembershipLevel } from "@/lib/tier-utils"
import { Search, X } from "lucide-react"

interface EventFilterProps {
  userMembershipLevel: MembershipLevel
}

export default function EventFilterPanel({ userMembershipLevel }: EventFilterProps) {
  const navigationRouter = useRouter()
  const currentSearchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(currentSearchParams.get("search") || "")

  const availableMembershipLevels = getMembershipAccess(userMembershipLevel)
  const activeMembershipFilter = currentSearchParams.get("tier") || "all"

  const processSearchSubmission = (formEvent: React.FormEvent) => {
    formEvent.preventDefault()
    updateFilterParameters({ search: searchQuery })
  }

  const changeMembershipFilter = (selectedLevel: string) => {
    updateFilterParameters({ tier: selectedLevel })
  }

  const resetAllFilters = () => {
    setSearchQuery("")
    navigationRouter.push("/events")
  }

  const updateFilterParameters = (newFilterOptions: { search?: string; tier?: string }) => {
    const urlParameters = new URLSearchParams(currentSearchParams.toString())

    if (newFilterOptions.search !== undefined) {
      if (newFilterOptions.search) {
        urlParameters.set("search", newFilterOptions.search)
      } else {
        urlParameters.delete("search")
      }
    }

    if (newFilterOptions.tier !== undefined) {
      if (newFilterOptions.tier && newFilterOptions.tier !== "all") {
        urlParameters.set("tier", newFilterOptions.tier)
      } else {
        urlParameters.delete("tier")
      }
    }

    navigationRouter.push(`/events?${urlParameters.toString()}`)
  }

  const hasActiveFilters =
    currentSearchParams.get("search") || (currentSearchParams.get("tier") && currentSearchParams.get("tier") !== "all")

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <form onSubmit={processSearchSubmission} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(inputEvent) => setSearchQuery(inputEvent.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            Search
          </Button>
        </form>

        <div className="flex gap-2 items-center">
          <Select value={activeMembershipFilter} onValueChange={changeMembershipFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {availableMembershipLevels.map((membershipLevel) => (
                <SelectItem key={membershipLevel} value={membershipLevel}>
                  {membershipDisplayNames[membershipLevel]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={resetAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}