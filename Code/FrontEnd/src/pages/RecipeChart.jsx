import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
function RecipeChart({ data }) {
  // const data = [
  //   { date: "23-07", count: 0 },
  //   { date: "31-07", count: 0 },
  //   { date: "08-08", count: 0 },
  //   { date: "16-08", count: 0 },
  //   { date: "24-08", count: 0 },
  //   { date: "01-09", count: 0 },
  //   { date: "09-09", count: 0 },
  //   { date: "17-09", count: 0 },
  //   { date: "25-09", count: 0 },
  //   { date: "03-10", count: 10 },
  //   { date: "11-10", count: 1 },
  //   { date: "19-10", count: 0 },
  // ];

  return (
    <>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#FFA726" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default RecipeChart;
