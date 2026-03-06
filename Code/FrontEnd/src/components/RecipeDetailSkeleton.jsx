const RecipeDetailSkeleton = () => {
  return (
    <div className="max-w-full mx-auto p-4 md:p-8 animate-pulse bg-white">
      <div className="flex flex-col md:flex-row gap-8">
    
        <div className="w-full md:w-[300px] aspect-square bg-gray-200 rounded-xl relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        <div className="flex-1 space-y-5">
          <div className="h-9 w-full bg-gray-200 rounded-md" />
          
          <div className="h-8 w-48 bg-gray-100 rounded-full border border-gray-200" />

          <div className="h-24 w-full bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
             <div className="h-4 w-40 bg-green-100 rounded" />
             <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-7 w-20 bg-green-50 rounded-full" />
                ))}
             </div>
             <div className="h-7 w-32 bg-red-50 rounded-full" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>

          <div className="flex gap-3 pt-4">
            <div className="h-12 w-48 bg-orange-50 border border-orange-100 rounded-lg" />
            <div className="h-12 w-24 bg-gray-100 rounded-lg" />
            <div className="h-12 w-12 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="mt-16 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-[300px] space-y-6">
          <div className="h-7 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between border-b border-gray-100 pb-2">
                <div className="h-4 w-32 bg-gray-50 rounded" />
                <div className="h-4 w-12 bg-gray-50 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-8">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
          
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 ml-12">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="aspect-video bg-gray-100 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RecipeDetailSkeleton