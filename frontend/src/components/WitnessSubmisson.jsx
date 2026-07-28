import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Search, Lock, ShieldCheck, CheckCircle, FileText, UserCheck } from "lucide-react";

function WitnessSubmission() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    Adhar: "",
    statement: "",
  });

  const fetchCases = async () => {
    try {
      const response = await axios.get("/api/cases");
      setCases(response.data || []);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (query) {
      setFilteredCases(
        cases.filter(
          (c) =>
            (c.caseId && c.caseId.toLowerCase().includes(query)) ||
            (c.name && c.name.toLowerCase().includes(query)) ||
            (c.personName && c.personName.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredCases([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCase = (caseData) => {
    setSelectedCase(caseData);
    setSearch("");
    setFilteredCases([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!selectedCase) {
      alert("Please search and select an active case first!");
      return;
    }

    setLoading(true);
    try {
      const updatedWitnesses = selectedCase.witnesses
        ? [...selectedCase.witnesses, formData]
        : [formData];

      const key = selectedCase.firebaseKey || selectedCase._id || selectedCase.id;

      await axios.patch(`/api/cases/${key}`, { witnesses: updatedWitnesses });

      setSuccessMsg("Witness statement submitted successfully under protection protocol!");

      setFormData({ name: "", phone: "", Adhar: "", statement: "" });
      setSelectedCase((prevCase) => ({
        ...prevCase,
        witnesses: updatedWitnesses,
      }));

      fetchCases();
    } catch (error) {
      console.error("Error submitting witness:", error);
      alert("Failed to submit witness statement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40 mb-2">
              <Eye size={14} /> Encrypted Testimony Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white">Witness Statement Submission</h1>
            <p className="text-slate-400 text-sm mt-1">Submit confidential testimony or evidence for ongoing police investigations.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
            <Lock size={16} className="text-purple-400 shrink-0" />
            <span>256-Bit Protection Protocol</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">

          {/* Step 1: Case Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Search size={14} className="text-blue-400" /> 1. Search Active Case by Name or Case ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type case ID (e.g. CASE-101) or complainant name..."
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
              <Search size={18} className="absolute left-3.5 top-4 text-slate-500" />
            </div>

            {/* Dropdown Results */}
            {search && filteredCases.length > 0 && (
              <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl divide-y divide-slate-800 max-h-60 overflow-y-auto">
                {filteredCases.map((c) => (
                  <div
                    key={c.caseId || c._id}
                    onClick={() => handleSelectCase(c)}
                    className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{c.name || c.personName}</span>
                      <span className="text-slate-400">Incident: {c.incidentType || c.typeOfCrime}</span>
                    </div>
                    <span className="bg-blue-950 text-blue-300 font-mono px-2.5 py-1 rounded border border-blue-800/40">
                      ID: {c.caseId || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Case Card */}
          {selectedCase && (
            <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-slate-950 border border-blue-800/40 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Selected Case Target</span>
                <span className="bg-blue-600/30 text-blue-300 font-mono text-xs px-2 py-0.5 rounded border border-blue-500/40">
                  {selectedCase.caseId}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white">{selectedCase.name || selectedCase.personName}</h3>
              <div className="text-xs text-slate-300">
                <strong>Crime Type:</strong> {selectedCase.incidentType || selectedCase.typeOfCrime}
              </div>
              {selectedCase.witnesses && selectedCase.witnesses.length > 0 && (
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Logged Witnesses:</strong> {selectedCase.witnesses.length} statement(s) attached.
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle size={18} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Witness Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              2. Witness Personal Information & Statement
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Witness Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full legal name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Aadhaar Number (Optional)</label>
                <input
                  type="number"
                  name="Adhar"
                  placeholder="12-digit Aadhaar number"
                  value={formData.Adhar}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Statement *</label>
              <textarea
                name="statement"
                placeholder="Describe what you witnessed, timeline, persons involved, vehicle numbers, etc..."
                value={formData.statement}
                onChange={handleChange}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedCase}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-purple-600/25 disabled:opacity-40 cursor-pointer"
            >
              {loading ? "Submitting Statement..." : "Submit Witness Statement"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default WitnessSubmission;