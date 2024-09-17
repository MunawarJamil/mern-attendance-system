import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]); 
  const token = localStorage.getItem("token");

  const markAttendance = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/mark",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Attendance marked successfully");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || "You are already present today");
      setMessage(null);
    }
  };

  const viewAttendance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceData(response.data.data);  
      setError(null);
    } catch (err) {
      setError("Failed to retrieve attendance records");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">User Dashboard</h2>

      <div className="button-group">
        <button className="dashboard-btn" onClick={markAttendance}>
          Mark Attendance
        </button>

        <button className="dashboard-btn" onClick={viewAttendance}>
          View Attendance
        </button>
      </div>

      {/* Success and error messages */}
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      {/* Attendance History Table */}
      {attendanceData.length > 0 && (
        <div className="attendance-table-container">
          <h3>Attendance History</h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance) => (
                <tr key={attendance._id}>
                  <td>{new Date(attendance.date).toLocaleDateString()}</td>
                  <td>{attendance.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
