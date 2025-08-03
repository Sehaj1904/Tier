declare module '@clerk/nextjs/server' {
  export const clerkMiddleware: any
  export const createRouteMatcher: (patterns: string[]) => (req: any) => boolean
} 