import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReports } from "../features/reports/reportSlice";
import { Building2, Users, FileStack, AlertOctagon, BarChart3 } from "lucide-react";

function StationAdminDashboard() {
  const dispatch = useDispatch();
  const { reports } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const pendingCases = reports.filter((r) => r.status === "PENDING" || r.status === "OPEN");
  const activeCases = reports.filter((r) => r.status === "INVESTIGATING");
  const resolvedCases = reports.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider">
              Station Admin Operations
            </span>
            <h1 className="text-3xl font-bold mt-2">Station Headquarters Command</h1>
            <p className="text-blue-200 text-sm mt-1">
              Station analytics, officer deployment, and case jurisdiction management.
            </p>
          </div>
          <Building2 size={48} className="text-blue-300 opacity-80" />
        </div>

        {/* Analytics Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileStack size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Reports</p>
              <h3 className="text-2xl font-black text-gray-900">{reports.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertOctagon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Unassigned / Pending</p>
              <h3 className="text-2xl font-black text-gray-900">{pendingCases.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Under Investigation</p>
              <h3 className="text-2xl font-black text-gray-900">{activeCases.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Closed / Resolved</p>
              <h3 className="text-2xl font-black text-gray-900">{resolvedCases.length}</h3>
            </div>
          </div>
        </div>

        {/* Station Reports Overview Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Jurisdiction Crime Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
                <tr>
                  <th className="p-3">Complaint ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-blue-700">#{item.complaintNumber || item.caseId}</td>
                    <td className="p-3">{item.typeOfCrime || item.category}</td>
                    <td className="p-3">{item.location}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-200 text-gray-800">
                        {item.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{item.status}</td>
                    <td className="p-3 text-xs text-gray-400">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationAdminDashboard;
