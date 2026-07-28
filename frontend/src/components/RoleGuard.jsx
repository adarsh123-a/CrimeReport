import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../AuthServices/AuthContext";

const RoleGuard = ({ children, allowedRoles }) => {
  const reduxUser = useSelector((state) => state.auth.user);
  const { user: contextUser } = useAuth();

  const currentUser = reduxUser || contextUser;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = currentUser.role || "CITIZEN";

  if (allowedRoles && !allowedRoles.includes(role)) {
    switch (role) {
      case "SUPER_ADMIN":
        return <Navigate to="/dashboard/super-admin" replace />;
      case "STATION_ADMIN":
        return <Navigate to="/dashboard/station-admin" replace />;
      case "POLICE_OFFICER":
        return <Navigate to="/dashboard/police" replace />;
      default:
        return <Navigate to="/dashboard/citizen" replace />;
    }
  }

  return children;
};

export default RoleGuard;
