export function EventSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-24 h-6 bg-white/20 rounded-full"></div>
                <div className="w-32 h-6 bg-white/20 rounded-full"></div>
              </div>
              <div className="h-20 bg-white/20 rounded-lg mb-6"></div>
              <div className="flex gap-4">
                <div className="w-40 h-12 bg-white/20 rounded-lg"></div>
                <div className="w-32 h-12 bg-white/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Info Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 -mt-24 relative z-10">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Event Description Skeleton */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    </div>
                  ))}
                </div>

                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mt-8 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
