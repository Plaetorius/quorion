import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function ProjectLoading() {
  return (
    <div className="container py-8 md:py-12">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Project Image Skeleton */}
          <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden bg-muted">
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>

          {/* Project Overview Skeleton */}
          <div className="glass-card rounded-xl p-6">
            <Skeleton className="h-7 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>

          {/* Project Progress Skeleton */}
          <div className="glass-card rounded-xl p-6">
            <Skeleton className="h-7 w-48 mb-4" />

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-2.5 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-2.5 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 sticky top-24">
            <Skeleton className="h-7 w-40 mb-6" />

            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="mt-6 pt-6 border-t border-border/40">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40">
              <Skeleton className="h-5 w-40 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
