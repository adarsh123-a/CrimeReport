import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import { AuthProvider } from "./AuthServices/AuthContext";
import Register from "./components/Register";
import Login from "./components/Login";
import IncidentReporting from "./components/Incident";
import Navbar from "./components/Navbar";
import WitnessSubmission from "./components/WitnessSubmisson";
import SearchCrime from "./components/Search";
import Home from "./components/Home";
import Chat from "./pages/Chat";

// Role Dashboard Pages & Guard
import CitizenDashboard from "./pages/CitizenDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import StationAdminDashboard from "./pages/StationAdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import RoleGuard from "./components/RoleGuard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/IncidentReporting" element={<IncidentReporting />} />
          <Route path="/witness" element={<WitnessSubmission />} />
          <Route path="/search" element={<SearchCrime />} />
          <Route path="/chat" element={<Chat />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/citizen"
            element={
              <RoleGuard allowedRoles={["CITIZEN", "POLICE_OFFICER", "STATION_ADMIN", "SUPER_ADMIN"]}>
                <CitizenDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/police"
            element={
              <RoleGuard allowedRoles={["POLICE_OFFICER", "STATION_ADMIN", "SUPER_ADMIN"]}>
                <PoliceDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/station-admin"
            element={
              <RoleGuard allowedRoles={["STATION_ADMIN", "SUPER_ADMIN"]}>
                <StationAdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/dashboard/super-admin"
            element={
              <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminDashboard />
              </RoleGuard>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
