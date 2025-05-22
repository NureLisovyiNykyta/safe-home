import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";
import api from "../../../configs/api";
import GradientSpinner from "../../gradient-spinner";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const UserStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/stats/users/${days}`);
        const stats = response.data.user_stats;

        const labels = stats.map((stat) => new Date(stat.date));
        const data = stats.map((stat) => stat.user_count);

        setChartData({
          labels,
          datasets: [
            {
              label: "User Count",
              data,
              borderColor: "rgb(108, 122, 231)",
              backgroundColor: "rgba(128, 75, 192, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchStats();
  }, [days]);

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setDays(value);
    }
  };

  if (!chartData) return <div className="page loading"><GradientSpinner /></div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="mr-2">Days:</label>
        <input
          type="range"
          value={days}
          onChange={handleDaysChange}
          min="1"
          max="30"
          className="border rounded px-2 py-1"
        />
        <span className="ml-2">{days}</span>
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: days <= 1 ? "hour" : days <= 30 ? "day" : "month",
                displayFormats: {
                  hour: "HH:00",
                  day: "MMM dd",
                  month: "MMM yyyy",
                },
                auto: true,
              },
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: "User Count",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default UserStatsChart;
