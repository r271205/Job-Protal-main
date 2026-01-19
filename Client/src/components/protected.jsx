import { Navigate, Outlet } from "react-router-dom";

const ProtectedDashboard = () => {
  const { companyToken } = useContext(AppContext);

  if (!companyToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedDashboard;
