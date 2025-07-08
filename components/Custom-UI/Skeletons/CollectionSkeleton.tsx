export function CollectionSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="w-24 h-6 bg-white/20 rounded-full mb-4"></div>
              <div className="h-16 bg-white/20 rounded-lg mb-6"></div>
              <div className="w-40 h-12 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Collection Info Skeleton */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>

        {/* Collection Details Skeleton */}
        <div className="py-16">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 rounded animate-pulse mb-4 mx-auto w-96"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
