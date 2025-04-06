import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-quorion-base/30 via-quorion-surface/30 to-quorion-violet/10"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />

          <Skeleton className="h-20 w-3/4 md:w-1/2 mx-auto mb-6" />

          <Skeleton className="h-12 w-full md:w-3/4 lg:w-1/2 mx-auto mb-8" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 mx-auto sm:mx-0" />
            <Skeleton className="h-12 w-40 mx-auto sm:mx-0" />
          </div>

          {/* Trust indicators skeleton */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-6 w-6 rounded-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section Skeleton */}
      <section className="py-20 container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Skeleton className="h-10 w-64 mb-3" />
            <Skeleton className="h-6 w-full md:w-96 max-w-2xl" />
          </div>
          <Skeleton className="h-12 w-40 mt-4 md:mt-0" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section Skeleton */}
      <section className="py-20 bg-muted/5">
        <div className="container">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-full md:w-1/2 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl">
                <div className="mx-auto mb-6">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                </div>
                <Skeleton className="h-7 w-40 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-20 bg-accent/5">
        <div className="container">
          <Skeleton className="h-10 w-64 mx-auto mb-16" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-8 rounded-xl">
                <Skeleton className="h-10 w-24 mx-auto mb-3" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="py-20 container">
        <Skeleton className="h-10 w-64 mx-auto mb-16" />

        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Skeleton className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 container text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-xl">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full md:w-3/4 mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 mx-auto sm:mx-0" />
            <Skeleton className="h-12 w-40 mx-auto sm:mx-0" />
          </div>
        </div>
      </section>
    </div>
  )
}

