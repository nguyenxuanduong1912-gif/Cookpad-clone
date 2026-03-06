const RecipeRowSkeleton = () => (
  <div className="flex gap-4 p-4 border-b border-gray-100 animate-pulse">
    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gray-200" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-3/4 bg-gray-200 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-200 flex-shrink-0" />
  </div>
);
export default RecipeRowSkeleton