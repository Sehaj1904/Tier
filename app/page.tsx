import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { membershipBadgeStyles, membershipDisplayNames, membershipBenefits, type MembershipLevel } from "@/lib/tier-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default async function WelcomePage() {
  const authenticatedUser = await currentUser()

  if (authenticatedUser) {
    redirect("/events")
  }

  const availableMembershipLevels: MembershipLevel[] = ["free", "silver", "gold", "platinum"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Tier Events
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover exclusive events tailored to your membership tier. Join our community and unlock access to premium
            experiences, networking opportunities, and industry insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignInButton mode="modal">
              <Button size="lg" className="px-8 py-3 text-lg">
                Sign In to Your Account
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                Create Free Account
              </Button>
            </SignUpButton>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Membership Tiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {availableMembershipLevels.map((membershipLevel) => (
                  <div
                    key={membershipLevel}
                    className="p-6 rounded-lg border-2 border-gray-200 bg-white/50 hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${membershipBadgeStyles[membershipLevel]}`}>
                        {membershipDisplayNames[membershipLevel]}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {membershipBenefits[membershipLevel]}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8">
              Join thousands of professionals who are already experiencing exclusive events.
            </p>
            <SignUpButton mode="modal">
              <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start with Free Membership
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </div>
  )
}