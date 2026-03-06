import CategorySkeleton from "./CategorySkeleton";
const CategoryListSkeleton = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
export default CategoryListSkeleton