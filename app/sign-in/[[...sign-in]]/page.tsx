import { SignIn } from "@clerk/nextjs"

export default function UserSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <SignIn />
    </div>
  )
}