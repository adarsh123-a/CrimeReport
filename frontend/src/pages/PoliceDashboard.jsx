import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReports, updateReportStatus } from "../features/reports/reportSlice";
import { ShieldCheck, Filter, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

function PoliceDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reports, loading } = useSelector((state) => state.reports);

  const [selectedCase, setSelectedCase] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    await dispatch(
      updateReportStatus({
        id: selectedCase.id || selectedCase._id,
        statusData: {
          status: newStatus || selectedCase.status,
          priority: newPriority || selectedCase.priority,
          investigationNote: noteText,
        },
      })
    );

    alert("Case investigation status updated successfully!");
    setNoteText("");
    setSelectedCase(null);
    dispatch(fetchReports());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Police Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider">
              Police Officer Investigation Terminal
            </span>
            <h1 className="text-3xl font-bold mt-2">Officer {user?.name || "Station Officer"}</h1>
            <p className="text-slate-300 text-sm mt-1">
              Review assigned cases, update status logs, and file FIR records.
            </p>
          </div>
          <ShieldCheck size={48} className="text-emerald-400 opacity-80" />
        </div>

        {/* Reports Grid & Investigation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cases List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
              <span>Assigned Complaints ({reports.length})</span>
            </h2>

            <div className="space-y-3">
              {reports.map((item) => (
                <div
                  key={item.id || item._id}
                  onClick={() => {
                    setSelectedCase(item);
                    setNewStatus(item.status);
                    setNewPriority(item.priority || "MEDIUM");
                  }}
                  className={`p-5 rounded-xl border transition cursor-pointer ${
                    selectedCase?.id === item.id || selectedCase?._id === item._id
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-blue-800">#{item.complaintNumber || item.caseId}</span>
                      <h3 className="font-semibold text-gray-900 mt-0.5">{item.typeOfCrime || item.category}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        item.priority === "CRITICAL"
                          ? "bg-red-100 text-red-700"
                          : item.priority === "HIGH"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.priority || "MEDIUM"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>

                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span>Date: {item.date} | Location: {item.location}</span>
                    <span className="font-semibold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Investigation Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
              Investigation Control
            </h2>

            {selectedCase ? (
              <form onSubmit={handleStatusChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Selected Case ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCase.complaintNumber || selectedCase.caseId}
                    className="w-full p-2.5 bg-gray-100 border rounded-lg text-gray-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Update Investigation Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Update Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Add Official Investigation Note
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter case observations, witness statements, or FIR update..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
                >
                  Save Investigation Entry
                </button>
              </form>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">
                Click on any case card on the left to review details and update investigation status.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliceDashboard;
