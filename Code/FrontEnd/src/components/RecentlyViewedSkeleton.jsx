const RecentlyViewedSkeleton = () => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden w-full animate-pulse">
      <div className="w-full aspect-square bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" /> 
          <div className="h-3 w-20 bg-gray-200 rounded" />    
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
export default RecentlyViewedSkeleton