import { Card, CardContent } from "@/components/ui/card"

export default function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
              <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
