export default function AdminCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-orange-500 mt-2">{value}</h3>
    </div>
  );
}
