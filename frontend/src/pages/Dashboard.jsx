import Dashboardbut from "../component/Dashbordbutt";
import { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import axios from 'axios';
import '../styles/DashboardPage.css'; // We'll create this CSS file

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    templates: 0,
    resumes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
        setStats(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard statistics. Please try again later.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleClick = () => {
    console.log("Button clicked!");
    // Your button click logic here
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-container">
        {loading ? (
          <div className="loading">Loading statistics...</div>
        ) : (
          <>
            <StatCard title="Users" value={stats.users} icon="👥" />
            <StatCard title="Templates" value={stats.templates} icon="📄" />
            <StatCard title="Resumes" value={stats.resumes} icon="📝" />            
          </>
          
        )}
      </div>
      
      <div className="dashboard-button-container">
        <Dashboardbut onClick={handleClick} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  );
};

export default DashboardPage;