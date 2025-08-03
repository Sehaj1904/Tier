"use client"

import { UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { membershipDisplayNames, membershipBadgeStyles, type MembershipLevel } from "@/lib/tier-utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ApplicationHeaderProps {
  userData: {
    firstName: string | null
    lastName: string | null
    emailAddresses: { emailAddress: string }[]
    id: string
  }
  currentMembershipLevel: MembershipLevel
}

export default function ApplicationHeader({ userData, currentMembershipLevel }: ApplicationHeaderProps) {
  const { user: authenticatedUser } = useUser()
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false)
  const { toast } = useToast()
  const navigationRouter = useRouter()

  const membershipProgression: MembershipLevel[] = ["free", "silver", "gold", "platinum"]
  const currentLevelIndex = membershipProgression.indexOf(currentMembershipLevel)
  const nextAvailableLevel = currentLevelIndex < membershipProgression.length - 1 ? membershipProgression[currentLevelIndex + 1] : null

  const processMembershipUpgrade = async () => {
    if (!nextAvailableLevel || !authenticatedUser) return

    setIsProcessingUpgrade(true)
    try {
      await authenticatedUser.update({
        publicMetadata: {
          tier: nextAvailableLevel
        }
      })

      toast({
        title: "Membership Upgraded!",
        description: `You've been upgraded to ${membershipDisplayNames[nextAvailableLevel]} membership.`,
      })

      navigationRouter.refresh()
    } catch (upgradeError) {
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade membership. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingUpgrade(false)
    }
  }
  
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/events" className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tier Events
              </h1>
            </Link>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${membershipBadgeStyles[currentMembershipLevel]}`}>
              {membershipDisplayNames[currentMembershipLevel]} Member
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {nextAvailableLevel && (
              <Button
                onClick={processMembershipUpgrade}
                disabled={isProcessingUpgrade}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg border-0"
              >
                {isProcessingUpgrade ? "Upgrading..." : `Upgrade to ${membershipDisplayNames[nextAvailableLevel]}`}
              </Button>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-xs text-gray-500">{userData.emailAddresses[0]?.emailAddress}</p>
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}