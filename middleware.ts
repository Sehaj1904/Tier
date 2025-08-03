import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const protectedRoutesMatcher = createRouteMatcher(["/events", "/profile", "/api/events"])

export default clerkMiddleware(async (authenticationContext, requestObject) => {
  if (protectedRoutesMatcher(requestObject)) {
    await authenticationContext.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}