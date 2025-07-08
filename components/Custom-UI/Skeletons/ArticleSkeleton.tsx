export function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Article Content Skeleton */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Article Header Skeleton */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>

            <div className="h-16 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-2 mb-8">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Article Body Skeleton */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border">
            <div className="space-y-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ))}
            </div>

            <div className="my-12 h-px bg-gray-200"></div>

            {/* Author Bio Skeleton */}
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
