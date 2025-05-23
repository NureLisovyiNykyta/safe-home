import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";
import api from "../../../configs/api";
import GradientSpinner from "../../gradient-spinner";
import { useTranslation } from "react-i18next";
import './index.css';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const UserStatsChart = () => {
  const { t } = useTranslation();
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
              label: t("charts.userCount"),
              data,
              borderColor: "rgb(108, 122, 231)",
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
  }, [days, t]);

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setDays(value);
    }
  };

  if (!chartData) return <div className="page loading"><GradientSpinner /></div>;

  return (
    <div className="user-count-chart">
      <Line
        className="chart"
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
                text: t("charts.dateAxis"),
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: t("charts.userCountAxis"),
              },
            },
          },
        }}
      />
      <div className="action-panel">
        <label>{t("charts.daysLabel")}</label>
        <input
          type="range"
          value={days}
          onChange={handleDaysChange}
          min="1"
          max="30"
        />
        <span>{days}</span>
      </div>
    </div>
  );
};

export default UserStatsChart;
