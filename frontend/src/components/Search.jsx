import { Search, UserCheck, Shield, Calendar, MapPin, Scale, X, Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const statusEnum = [
  "Open",
  "Under Investigation",
  "On Trial",
  "Convicted",
  "Acquitted",
  "Closed",
];

function SearchCrime() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("caseId");

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [lawyerName, setLawyerName] = useState("");
  const [lawyerPhone, setLawyerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await axios.get("/api/cases");
      const cases = response.data || [];

      const filteredData = cases.filter((item) =>
        item[filterType]
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      setData(filteredData);
    } catch (err) {
      console.log("Error fetching cases:", err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchdata();
    }
  };

  const openLawyerDialog = (x) => {
    setSelectedCaseId(x.caseId);
    setSelectedCase(x);
    setLawyerName("");
    setLawyerPhone("");
    setError("");
    document.getElementById("customDialog").classList.remove("hidden");
  };

  const closeLawyerDialog = () => {
    document.getElementById("customDialog").classList.add("hidden");
  };

  const linkLawyer = async () => {
    if (!lawyerName || !lawyerPhone) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const lawyerData = { name: lawyerName, phone: lawyerPhone };
      const key = selectedCase.firebaseKey || selectedCase._id || selectedCase.id;

      await axios.patch(`/api/cases/${key}`, { lawyer: lawyerData });

      setData((prevData) =>
        prevData.map((item) =>
          item.caseId === selectedCaseId
            ? { ...item, lawyer: lawyerData }
            : item
        )
      );

      closeLawyerDialog();
    } catch (err) {
      console.error("Error linking lawyer:", err);
      setError("Failed to link advocate. Please try again.");
    }
    setLoading(false);
  };

  const updateCaseStatus = async (caseId, firebaseKey, newStatus) => {
    try {
      const key = firebaseKey || caseId;
      await axios.patch(`/api/cases/${key}`, { status: newStatus });

      setData((prevData) =>
        prevData.map((item) =>
          item.caseId === caseId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40 mb-2">
              <Search size={14} /> National Crime & Advocate Registry
            </div>
            <h1 className="text-3xl font-extrabold text-white">Search Crime Records & Cases</h1>
            <p className="text-slate-400 text-sm mt-1">Search active cases, track statuses, inspect records, or assign legal aid Advocates.</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Filter size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Search By:</span>
            <select
              className="bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="caseId">Case ID</option>
              <option value="name">Person Name</option>
              <option value="fatherName">Father Name</option>
              <option value="typeOfCrime">Type of Crime</option>
            </select>
          </div>

          <div className="relative w-full flex-1">
            <input
              type="search"
              placeholder={`Type query to search by ${filterType}... (Press Enter)`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
          </div>

          <button
            onClick={fetchdata}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shrink-0 cursor-pointer"
          >
            Execute Search
          </button>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.caseId || item._id}
              className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-blue-950 text-blue-300 font-mono text-xs px-2.5 py-1 rounded-md border border-blue-800/40 font-bold">
                    ID: {item.caseId || "N/A"}
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400 font-semibold">Status:</span>
                    <select
                      value={item.status || "Open"}
                      onChange={(e) =>
                        updateCaseStatus(
                          item.caseId,
                          item.firebaseKey || item._id,
                          e.target.value
                        )
                      }
                      className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      {statusEnum.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{item.name || item.personName || "Name Not Stated"}</h3>
                  {item.fatherName && <p className="text-xs text-slate-400">Father's Name: {item.fatherName}</p>}
                </div>

                <div className="space-y-1 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <div><strong>Crime Type:</strong> <span className="text-blue-400 font-semibold">{item.typeOfCrime || item.incidentType || "General"}</span></div>
                  <div><strong>Date & Time:</strong> {item.date || item.crimeDate} {item.time}</div>
                  <div><strong>Location:</strong> {item.location || item.crimeLocation}</div>
                  {item.gender && <div><strong>Gender:</strong> {item.gender}</div>}
                </div>
              </div>

              {/* Lawyer Assignment Section */}
              <div className="pt-3 border-t border-slate-800">
                {item.lawyer && item.lawyer.name ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                    <Scale size={16} className="shrink-0 text-emerald-400" />
                    <div>
                      <div className="font-bold">{item.lawyer.name}</div>
                      <div className="text-[11px] text-slate-400">Phone: {item.lawyer.phone}</div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700 hover:border-blue-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    onClick={() => openLawyerDialog(item)}
                  >
                    <Scale size={14} /> Link Advocate / Legal Aid
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
            <Search size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No matching crime records found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or clearing filters.</p>
          </div>
        )}

        {/* Modal Dialog */}
        <div
          id="customDialog"
          className="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative space-y-4">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              onClick={closeLawyerDialog}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-blue-400">
              <Scale size={20} />
              <h2 className="text-lg font-bold text-white">Link Advocate / Legal Aid</h2>
            </div>
            <p className="text-xs text-slate-400">Assign a verified Advocate or Legal Aid representative to Case {selectedCaseId}.</p>

            {error && <div className="bg-red-950/60 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl">{error}</div>}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Advocate Full Name</label>
                <input
                  type="text"
                  placeholder="Adv. Rajesh Kumar"
                  value={lawyerName}
                  onChange={(e) => setLawyerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Advocate Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={lawyerPhone}
                  onChange={(e) => setLawyerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl transition cursor-pointer"
                onClick={closeLawyerDialog}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg cursor-pointer"
                onClick={linkLawyer}
                disabled={loading}
              >
                {loading ? "Assigning..." : "Assign Advocate"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SearchCrime;