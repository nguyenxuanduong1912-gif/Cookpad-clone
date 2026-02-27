export default function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
