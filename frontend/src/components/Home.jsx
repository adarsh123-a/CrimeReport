import React from "react";
import { Link } from "react-router-dom";
import { Shield, FilePlus, Eye, Search, Bot, PhoneCall, CheckCircle, AlertTriangle, ArrowRight, Lock, Award, Users } from "lucide-react";

function Home() {
  return (
    <div className="bg-[#090d16] text-white min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      {/* Emergency Alert Bar */}
      <div className="bg-gradient-to-r from-red-900/40 via-amber-900/30 to-red-900/40 border-b border-red-500/20 py-2.5 px-4 text-center text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-200 font-medium flex-wrap">
          <span className="flex items-center gap-1 bg-red-600/30 border border-red-500/40 text-red-300 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <AlertTriangle size={12} className="animate-pulse" /> Emergency Hotline
          </span>
          <span>National Police Support: <strong className="text-white font-bold">112</strong></span>
          <span className="hidden sm:inline">|</span>
          <span>Cyber Crime Fraud Helpline: <strong className="text-white font-bold">1930</strong></span>
          <span className="hidden sm:inline">|</span>
          <span>Women Helpline: <strong className="text-white font-bold">1091</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60">
        {/* Glow Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
            <Shield size={16} className="text-blue-400" />
            <span>Next-Gen Enterprise Crime Reporting & AI Legal Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Report Crime Fast. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Empower Justice. Save Lives.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed font-normal">
            File instant e-FIRs, submit confidential witness statements, track active case statuses in real-time, and get AI legal assistance in Hindi & English.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/IncidentReporting"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
            >
              <FilePlus size={20} />
              <span>Report an Incident</span>
            </Link>

            <Link
              to="/chat"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-blue-300 font-semibold px-8 py-4 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer text-base"
            >
              <Bot size={20} className="text-blue-400" />
              <span>Ask Crime Report AI</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Encrypted Reporting</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">24 / 7</div>
              <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">AI Legal Guidance</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">IPC & BNS</div>
              <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Legal Mapping</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Real-Time</div>
              <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Case Tracking</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Portals Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Enterprise Portals</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Comprehensive Crime Management System</h3>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">Designed for citizens, law enforcement officers, Advocates, and judicial authorities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Incident Reporting */}
          <Link
            to="/IncidentReporting"
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <FilePlus size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Incident Reporting</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Lodge formal complaints or e-FIR reports with details, timestamps, locations, and digital evidence links.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-blue-400 gap-1 group-hover:gap-2 transition-all">
              <span>File Report Now</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: AI Legal Assistant */}
          <Link
            to="/chat"
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Bot size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">AI Legal Assistant</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ask Crime Report in Hindi or English about IPC/BNS dhara, punishments, cyber fraud helpline, and rights.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-indigo-400 gap-1 group-hover:gap-2 transition-all">
              <span>Ask Crime Report</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Witness Submission */}
          <Link
            to="/witness"
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <Eye size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Witness Submission</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Submit confidential witness statements, testimony, or evidence for ongoing police investigations securely.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-purple-400 gap-1 group-hover:gap-2 transition-all">
              <span>Submit Witness Statement</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: Search & Legal Aid */}
          <Link
            to="/search"
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <Search size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Search & Legal Aid</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Search crime records, track complaint numbers, inspect investigation statuses, or hire verified Advocates.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:gap-2 transition-all">
              <span>Search Database</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </section>

      {/* Security & Confidentiality Highlight */}
      <section className="py-16 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">100% Anonymous & Secure</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your identity is protected under high-grade encryption when filing witness reports or anonymous complaints.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30 shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Verified Police & Station Admins</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Complaints are assigned directly to verified police station administrators for immediate action.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
              <PhoneCall size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Instant Emergency Assistance</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Direct integration with National Emergency Police Helpline 112 and Cyber Fraud Hotline 1930.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0f19] text-slate-400 text-sm py-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-blue-500" />
            <span className="font-extrabold text-white tracking-tight">Crime Report Enterprise</span>
          </div>
          <p>© 2026 Crime Report Enterprise System. All Rights Reserved.</p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Emergency Contact 112</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
