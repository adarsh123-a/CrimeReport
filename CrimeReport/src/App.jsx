import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import { AuthProvider, useAuth } from "./AuthServices/AuthContext";
import Register from "./components/Register";
import Login from "./components/Login";
import IncidentReporting from "./components/Incident";
import Navbar from "./components/Navbar";
import WitnessSubmission from "./components/WitnessSubmisson";
import HearingRecords from "./components/Hearing Records";
import CaseTracking from "./components/CaseTracking";
import SearchCrime from "./components/Search";
import Home from "./components/Home";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/IncidentReporting" element={<IncidentReporting />} />
          <Route path="/witness" element={<WitnessSubmission />} />
          <Route path="search" element={<SearchCrime />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

// {
//   "genderEnum": ["Male", "Female", "Other"],
//   "statusEnum": ["Under Investigation", "On Trial", "Convicted", "Acquitted", "Closed"],
//   "typeOfCrimeEnum": [
//     "Burglary",
//     "Robbery",
//     "Fraud",
//     "Assault",
//     "Murder",
//     "Cybercrime",
//     "Drug Offense",
//     "Kidnapping",
//     "Human Trafficking",
//     "Terrorism"
//   ],
//   "finalResultEnum": ["Pending Trial", "Guilty", "Not Guilty", "Case Dismissed"],
//   "judgeResultEnum": ["Next hearing scheduled", "Verdict given", "Case postponed", "Case dismissed"],
//   "lawyerLastCaseResultEnum": ["Won", "Lost", "Settled", "Dismissed"],
//   "numberOfHearingEnum": ["1", "2", "3", "4", "5", "More than 5"]
// }
