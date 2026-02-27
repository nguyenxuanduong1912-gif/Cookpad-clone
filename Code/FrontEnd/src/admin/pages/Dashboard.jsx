import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { BookOpen, Users, MessageSquare, Clock } from "lucide-react";
import { useEffect } from "react";
import axiosAdmin from "../../api/axiosAdmin";
import { useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [chartData, setChartdata] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosAdmin.get("/dashboard/overview");
        setData(res.data.totals);
        const res2 = await axiosAdmin.get("/dashboard/recipe-stats");
        setChartdata(res2.data.data);
        console.log(res2.data);
      } catch (error) {}
    };

    fetchData();
  }, []);
  const stats = [
    {
      title: "Công thức",
      value: data.recipes && data.recipes,
      icon: <BookOpen />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Người dùng",
      value: data.users && data.users,
      icon: <Users />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Bình luận",
      value: data.comments && data.comments,
      icon: <MessageSquare />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Chờ duyệt",
      value: data.pending && data.pending,
      icon: <Clock />,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Thống kê tổng quan</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      <ChartCard data={chartData} />
    </div>
  );
}
