const CategorySkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-200 animate-pulse h-[100px] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      
      <div className="absolute bottom-3 left-3 h-4 w-24 bg-gray-300 rounded" />
    </div>
  );
};
export default CategorySkeleton