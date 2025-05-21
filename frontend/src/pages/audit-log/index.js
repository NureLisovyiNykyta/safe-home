import { useState, useEffect, useCallback } from "react";
import { VscRefresh } from "react-icons/vsc";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import { MdRemoveCircle } from "react-icons/md";
import api from "../../configs/api";
import GradientSpinner from "../../components/gradient-spinner";
import "./index.css";

const getIcon = (action) => {
  if (action === "create") return <IoMdAddCircle className="add" />;
  if (action === "update") return <MdOutlineUpdate className="update" />;
  if (action === "delete") return <MdRemoveCircle className="delete" />;
  return <IoMdAddCircle />;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [userFilter, setUserFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin-audit-logs");
      const transformedLogs = response.data.admin_audit_logs.map(log => ({
        id: log.log_id,
        user: log.admin_name,
        action: log.action,
        timestamp: formatTimestamp(log.created_at),
        actionDetail: log.action_details.action,
      }));
      setLogs(transformedLogs);
      setFilteredLogs(transformedLogs);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Ошибка загрузки логов");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    let filtered = logs;

    if (userFilter !== "ALL") {
      filtered = filtered.filter((log) => log.user === userFilter);
    }

    if (actionFilter !== "ALL") {
      filtered = filtered.filter((log) => log.action.includes(actionFilter.toLowerCase()));
    }

    setFilteredLogs(filtered);
  }, [logs, userFilter, actionFilter]);

  const handleRefresh = () => {
    fetchLogs();
  };

  const uniqueUsers = ["ALL", ...new Set(logs.map((log) => log.user))];
  const uniqueActions = ["ALL", "create", "update", "delete"];

  if (loading) {
    return <div className="page loading"><GradientSpinner /></div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page audit-log-container">
      <div className="audit-log-header">
        <div className="filter">
          <span>Admin:</span>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="filter">
          <span>Action:</span>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
        <button className="refresh-btn" onClick={handleRefresh}>
          <VscRefresh className="icon" />
          Refresh
        </button>
      </div>
      <div className="log-list">
        {filteredLogs.map((log) => (
          <div key={log.id} className="log-item">
            <div className="log-icon">{getIcon(log.actionDetail)}</div>
            <div className="log-details">
              <div className="log-action">
                <span className="user">{log.user} </span>
                <span>{log.action} </span>
              </div>
              <span className="log-timestamp">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLog;
