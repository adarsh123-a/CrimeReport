import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReports } from "../features/reports/reportSlice";
import { Link } from "react-router-dom";
import { AlertTriangle, FileText, CheckCircle, Clock, Search, ShieldAlert, PlusCircle, Bot } from "lucide-react";
import axios from "axios";

function CitizenDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reports, loading } = useSelector((state) => state.reports);

  const [trackNumber, setTrackNumber] = useState("");
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackError, setTrackError] = useState("");

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;
    setTrackError("");
    setTrackedResult(null);

    try {
      const res = await axios.get(`/api/cases/track/${trackNumber.trim()}`);
      setTrackedResult(res.data);
    } catch (err) {
      setTrackError("Complaint number not found. Please verify and try again.");
    }
  };

  const userReports = reports.filter(
    (r) => r.citizenId === user?._id || r.name === user?.name || r.name === "Anonymous Citizen"
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Citizen Portal
            </span>
            <h1 className="text-3xl font-extrabold mt-2 text-white">Welcome back, {user?.name || "Citizen"}</h1>
            <p className="text-slate-300 mt-1 text-sm">
              Report incidents, track complaint status in real-time, or chat with AI Legal Assistant.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/IncidentReporting"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg"
            >
              <PlusCircle size={18} /> Submit Incident Report
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-blue-300 font-semibold px-4 py-2.5 rounded-xl border border-blue-500/30 transition"
            >
              <Bot size={18} className="text-blue-400" /> Ask AI
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Reports</p>
              <h3 className="text-2xl font-extrabold text-white">{userReports.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Review</p>
              <h3 className="text-2xl font-extrabold text-white">
                {userReports.filter((r) => r.status === "PENDING" || r.status === "OPEN" || !r.status).length}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Investigating</p>
              <h3 className="text-2xl font-extrabold text-white">
                {userReports.filter((r) => r.status === "INVESTIGATING" || r.status === "Under Investigation").length}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Resolved</p>
              <h3 className="text-2xl font-extrabold text-white">
                {userReports.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED" || r.status === "Closed").length}
              </h3>
            </div>
          </div>
        </div>

        {/* Complaint Tracker Tool */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="text-blue-400" size={20} /> Track Complaint Status
          </h2>
          <p className="text-xs text-slate-400">
            Enter your unique Complaint ID (e.g. CR-2026-1001) to view real-time investigation progress.
          </p>

          <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              placeholder="Enter Complaint Number (e.g. CR-2026-1001)"
              value={trackNumber}
              onChange={(e) => setTrackNumber(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-md cursor-pointer"
            >
              Track Status
            </button>
          </form>

          {trackError && <p className="text-red-400 text-xs font-semibold">{trackError}</p>}

          {trackedResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-blue-800/40 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-400 text-sm">Complaint #{trackedResult.complaintNumber}</span>
                <span className="px-3 py-1 rounded-md font-bold uppercase bg-blue-600 text-white">
                  {trackedResult.status}
                </span>
              </div>
              <p className="text-slate-300"><strong>Category:</strong> {trackedResult.typeOfCrime}</p>
              <p className="text-slate-300"><strong>Location:</strong> {trackedResult.location}</p>
              <p className="text-slate-300"><strong>Date:</strong> {trackedResult.date}</p>
              <p className="text-slate-300"><strong>Description:</strong> {trackedResult.description}</p>
            </div>
          )}
        </div>

        {/* My Reports List */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white">My Submitted Reports ({userReports.length})</h2>
          {userReports.length === 0 ? (
            <p className="text-slate-500 text-xs">You have not submitted any crime reports yet.</p>
          ) : (
            <div className="space-y-3">
              {userReports.map((report) => (
                <div
                  key={report.id || report._id}
                  className="p-4 border border-slate-800 rounded-xl hover:border-slate-700 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-950/60"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">#{report.complaintNumber || report.caseId || "CASE"}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-blue-950 text-blue-300 border border-blue-800/40">
                        {report.typeOfCrime || report.incidentType || "General"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{report.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Submitted on: {report.date} | Location: {report.location}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      report.status === "RESOLVED" || report.status === "Closed"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                        : report.status === "INVESTIGATING" || report.status === "Under Investigation"
                        ? "bg-indigo-950 text-indigo-300 border border-indigo-800/40"
                        : "bg-amber-950 text-amber-300 border border-amber-800/40"
                    }`}
                  >
                    {report.status || "Open"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CitizenDashboard;
