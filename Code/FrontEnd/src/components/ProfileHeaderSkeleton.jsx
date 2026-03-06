const ProfileHeaderSkeleton = () => (
  <div className="p-6 flex flex-col items-start animate-pulse">
    <div className="flex items-center gap-8">
        <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mb-4" />
    <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
    </div>
    <div className="flex gap-6">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
  </div>
);
export default ProfileHeaderSkeleton