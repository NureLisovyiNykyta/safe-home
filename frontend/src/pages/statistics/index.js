import "./index.css";
import { useState } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuUsers } from "react-icons/lu";
import { PiMoneyWavy } from "react-icons/pi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import UserStatsChart from "../../components/charts/user-count";
import SubscriptionPlansChart from "../../components/charts/plan-chart";

const Statistics = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("user-count");

  const tabs = [
    { id: "user-count", label: t("stats.userCount"), path: "/statistics/user-count", icon: <LuUsers /> },
    { id: "subscription-plans", label: t("stats.subscriptionPlans"), path: "/statistics/subscription-plans", icon: <PiMoneyWavy /> },
    { id: "subscription-plan", label: t("stats.subscriptionPlan"), path: "/statistics/subscription-plan", icon: <FaMoneyCheckAlt /> },
  ];

  useState(() => {
    const currentTab = tabs.find((tab) => location.pathname === tab.path)?.id || "user-count";
    setActiveTab(currentTab);
  }, [location.pathname]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="page">
      <div className="stats-navigation">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`stats-nav-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="stats-nav-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
      <Routes>
        <Route path="/user-count" element={<UserStatsChart />} />
        <Route path="/subscription-plans" element={<SubscriptionPlansChart />} />
        <Route path="/subscription-plan" element={<div>Subscription Plan Placeholder</div>} />
        <Route index element={<UserStatsChart />} />
      </Routes>
    </div>
  );
};

export default Statistics;
