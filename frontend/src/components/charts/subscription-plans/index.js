import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import api from "../../../configs/api";
import GradientSpinner from '../../gradient-spinner';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SubscriptionPlansChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats/subscription-plans");
        const stats = response.data.subscription_plans_stats;

        if (!stats || stats.length === 0) {
          setChartData(null);
          return;
        }

        const labels = stats.map((stat) => stat.plan_name);
        const data = stats.map((stat) => stat.user_count);

        setChartData({
          labels,
          datasets: [
            {
              label: "User Count",
              data,
              backgroundColor: "rgba(108, 122, 231, 0.6)",
              borderColor: "rgb(108, 122, 231)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching subscription plans stats:", error);
        setChartData(null);
      }
    };

    fetchStats();
  }, []);

  if (!chartData) return <div className="page loading"><GradientSpinner /></div>;

  return (
    <div className="p-4">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Plan Name",
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

export default SubscriptionPlansChart;
