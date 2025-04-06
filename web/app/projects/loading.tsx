import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectsLoading() {
  // Create an array of 6 items for the project card skeletons
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="container py-8 md:py-12 opacity-70">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="w-full md:w-2/3">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <div className="w-full md:w-auto">
          <Button variant="default" size="lg" className="whitespace-nowrap opacity-40 pointer-events-none">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.map((index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden flex flex-col">
            <Skeleton className="w-full h-48" />
            <div className="p-5 flex-1 flex flex-col">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-4" />

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
                <Skeleton className="h-9 w-full mt-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

