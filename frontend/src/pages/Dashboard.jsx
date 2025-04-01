import Dashboardbut from "../component/Dashbordbutt";

const DashboardPage = () => {
  const handleClick = () => {
    // Your click handler logic here
    console.log("Button clicked!");
  };

  return (
    <div className="dashboard-container">
        <div className='dash-butt'>
      <Dashboardbut onClick={handleClick} />
      </div>
    </div>
  );
};

export default DashboardPage;