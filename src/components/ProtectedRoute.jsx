import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // Check user login state
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
