export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse"></div>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>

            {/* Features Skeleton */}
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Trust Badges Skeleton */}
            <div className="flex items-center gap-6 pt-4 border-t">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications Skeleton */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
