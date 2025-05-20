import React, { useState, useEffect } from "react";
import { VscRefresh } from "react-icons/vsc";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { IoRemoveCircle } from "react-icons/io5";
import "./index.css";

const mockLogs = [
  { id: 1, user: "fornifox", action: "uploaded a Soundboard sound", timestamp: "Today at 01:33" },
  { id: 2, user: "fornifox", action: "created an invite tSESYGJ6", timestamp: "Yesterday at 23:22" },
  { id: 3, user: "lifeenjoyer", action: "pinned a message by lifeenjoyer in #information", timestamp: "Last Saturday at 22:20" },
  { id: 4, user: "lifeenjoyer", action: "updated the scheduled event NAVI vs Astralis", timestamp: "Last Friday at 14:08" },
  { id: 5, user: "fornifox", action: "uploaded a Soundboard sound", timestamp: "Today at 01:33" },
  { id: 6, user: "fornifox", action: "created an invite tSESYGJ6", timestamp: "Yesterday at 23:22" },
  { id: 7, user: "lifeenjoyer", action: "pinned a message by lifeenjoyer in #information", timestamp: "Last Saturday at 22:20" },
  { id: 8, user: "lifeenjoyer", action: "deleted the scheduled event NAVI vs Astralis", timestamp: "Last Friday at 14:08" },
];

const getIcon = (action) => {
  if (action.includes("created") || action.includes("uploaded")) return <IoMdAddCircle className="add" />;
  if (action.includes("updated")) return <MdOutlinePublishedWithChanges className="edit" />;
  if (action.includes("deleted")) return <IoRemoveCircle className="delete" />;
  return <IoMdAddCircle />;
};

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [userFilter, setUserFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  const logListRef = React.useRef(null);

  const fetchLogs = async () => {
    try {
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
    setLogs((prevLogs) => {
      fetchLogs();
      return prevLogs;
    });
  };

  const uniqueUsers = ["ALL", ...new Set(logs.map((log) => log.user))];
  const uniqueActions = ["ALL", "uploaded", "created", "pinned", "updated"];

  return (
    <div className="page audit-log-container">
      <div className="audit-log-header">
        <div className="filters">
          <div>
            <span>Admin:</span>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          <div>
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
      </div>
      <div className="log-list" ref={logListRef}>
        {filteredLogs.slice(0, filteredLogs.length).map((log) => (
          <div key={log.id} className="log-item">
            <span className="log-icon">{getIcon(log.action)}</span>
            <div className="log-details">
              {/* <span className="log-user"></span> */}
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
