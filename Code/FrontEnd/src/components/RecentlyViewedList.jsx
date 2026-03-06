import RecentlyViewedSkeleton from "./RecentlyViewedSkeleton";

const RecentlyViewedList = () => {
    return (
      <div className="w-full">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse ml-4" />
        <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[180px] flex-shrink-0">
              <RecentlyViewedSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }
export default RecentlyViewedList