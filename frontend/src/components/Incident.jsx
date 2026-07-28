import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useAuth } from "../AuthServices/AuthContext";
import { FilePlus, ShieldAlert, CheckCircle, Clock, MapPin, User, Calendar, Image as ImageIcon, AlertCircle, LogIn, UserPlus, Lock } from "lucide-react";

function IncidentReport() {
  const navigate = useNavigate();
  const { user: contextUser } = useAuth();
  const reduxUser = useSelector((state) => state.auth?.user);
  const currentUser = reduxUser || contextUser;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    incidentType: "",
    date: "",
    time: "",
    location: "",
    gender: "",
    description: "",
    evidence: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/cases");
      setData(response.data || []);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser?.name && !formData.name) {
      setFormData((prev) => ({ ...prev, name: currentUser.name }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitSuccess(false);

    if (!currentUser) {
      setErrorMsg("Please register or login first before submitting an incident report.");
      navigate("/login?redirect=/IncidentReporting");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/cases", formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSubmitSuccess(true);

      setFormData({
        name: currentUser?.name || "",
        incidentType: "",
        fatherName: "",
        date: "",
        time: "",
        location: "",
        gender: "",
        description: "",
        evidence: "",
      });

      fetchData();
    } catch (error) {
      console.log("Error submitting incident:", error);
      setErrorMsg("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/40 mb-2">
              <FilePlus size={14} /> Official E-FIR Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white">Incident Reporting System</h1>
            <p className="text-slate-400 text-sm mt-1">Submit official complaint records to local police stations & law enforcement.</p>
          </div>
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/50 p-3 rounded-xl">
            <ShieldAlert size={24} className="text-red-400 shrink-0 animate-pulse" />
            <div className="text-xs">
              <div className="font-bold text-red-300">Emergency Situation?</div>
              <div className="text-slate-300">Call Emergency Police Helpline <strong className="text-white">112</strong> immediately</div>
            </div>
          </div>
        </div>

        {/* Mandatory Authentication Alert for unauthenticated visitors */}
        {!currentUser && (
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                <Lock size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-amber-200">Registration & Login Required to File a Complaint</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Before raising an incident report or e-FIR, you must first <strong>Register</strong> or <strong>Login</strong> to your portal account. This ensures your complaint is authentic, securely recorded, and tracked by police station administrators.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/login?redirect=/IncidentReporting"
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                <LogIn size={16} />
                <span>Login First</span>
              </Link>
              <Link
                to="/register?redirect=/IncidentReporting"
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
              >
                <UserPlus size={16} />
                <span>Register Account</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2-Column Form & Guide Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Guide Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-blue-400" />
                Guidelines for Reporting
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                  <span><strong>Accurate Details:</strong> Provide exact date, time, and location to assist police dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                  <span><strong>Evidence URLs:</strong> Attach links to photos, CCTV clips, or digital receipts if available.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                  <span><strong>Confidentiality:</strong> Your submission is logged securely under your logged-in profile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                  <span><strong>Zero FIR Support:</strong> Complaints are routed to station administrators automatically.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/30 p-6 rounded-2xl">
              <h4 className="font-bold text-blue-300 text-sm mb-2">Need Immediate AI Assistance?</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Not sure which IPC or BNS section applies to your incident? Ask Crime Report AI in Hindi or English.
              </p>
              <button
                onClick={() => navigate("/chat")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md cursor-pointer"
              >
                Launch AI Legal Assistant
              </button>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Incident Details Form</span>
              <span className="text-xs font-normal text-slate-400">* Required fields</span>
            </h2>

            {submitSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                <CheckCircle size={18} className="shrink-0" />
                <span>Incident report submitted successfully! Station Admin notified.</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Father's / Guardian Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="e.g. Suresh Sharma"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Type *</label>
                  <input
                    type="text"
                    name="incidentType"
                    placeholder="e.g. Theft, Cyber Fraud, Assault"
                    value={formData.incidentType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Incident *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time of Incident *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location of Incident *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Connaught Place, Block B, New Delhi"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe what happened in detail (sequence of events, suspects description, etc.)..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Evidence URL (Optional)</label>
                <input
                  type="url"
                  name="evidence"
                  placeholder="https://example.com/evidence-image.jpg"
                  value={formData.evidence}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/25 mt-4 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Submitting Report..." : "Submit Incident Report"}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Submitted Reports Grid */}
        <div className="pt-8 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-400" />
            Recent Submitted Incident Reports ({data.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
              <div key={item.id || index} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/40 px-2.5 py-1 rounded-md">
                    {item.incidentType || item.typeOfCrime || "Incident"}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> {item.date || item.crimeDate || "Recent"}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{item.name || item.personName || "Anonymous Reporter"}</h3>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500 shrink-0" /> {item.location || item.crimeLocation || "Location Not Stated"}</div>
                  {item.time && <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-500 shrink-0" /> {item.time}</div>}
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  {item.description || "No detailed description provided."}
                </p>

                {item.evidence && item.evidence.trim() !== "" && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                      <ImageIcon size={12} /> Evidence Preview:
                    </span>
                    <img
                      src={item.evidence}
                      alt="Evidence"
                      className="rounded-lg w-full h-32 object-cover border border-slate-800"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default IncidentReport;