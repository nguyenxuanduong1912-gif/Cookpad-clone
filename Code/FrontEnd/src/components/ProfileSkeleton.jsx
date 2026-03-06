import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";
import RecipeRowSkeleton from "./RecipeRowSkeleton";

const ProfileSkeleton = () => {
  return (
    <div className="mx-auto w-[680px] bg-white min-h-screen">
      <ProfileHeaderSkeleton />
      <div className="border-t border-b border-gray-100 py-3 mt-4">
        <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
      </div>
      <div className="mt-2">
        {[...Array(3)].map((_, i) => (
          <RecipeRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
export default ProfileSkeleton