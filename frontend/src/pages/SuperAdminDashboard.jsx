import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldAlert, Users, Database, Activity, Lock, Unlock, Server } from "lucide-react";

function SuperAdminDashboard() {
  const [users, setUsers] = useState([
    { _id: "1", name: "Super Admin", email: "superadmin@crimereport.org", role: "SUPER_ADMIN", isBlocked: false },
    { _id: "2", name: "Station Inspector Sharma", email: "admin@station1.org", role: "STATION_ADMIN", isBlocked: false },
    { _id: "3", name: "Officer Detective Alan Reed", email: "officer@station1.org", role: "POLICE_OFFICER", isBlocked: false },
    { _id: "4", name: "Citizen John Doe", email: "citizen@example.com", role: "CITIZEN", isBlocked: false },
  ]);

  const toggleUserBlock = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
    alert("User status updated!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Super Admin Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-slate-900 border border-rose-800/40 p-6 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="bg-rose-500/20 text-rose-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-rose-500/30">
              Super Admin Core Control
            </span>
            <h1 className="text-3xl font-black mt-2">Platform Administration & Audit</h1>
            <p className="text-rose-200/80 text-sm mt-1">
              Global system configuration, user enforcement, audit logging, and database health.
            </p>
          </div>
          <ShieldAlert size={48} className="text-rose-400 opacity-90" />
        </div>

        {/* Global System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <Users className="text-rose-400" size={28} />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Total System Accounts</p>
              <h3 className="text-2xl font-black">{users.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <Server className="text-blue-400" size={28} />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Database Nodes</p>
              <h3 className="text-2xl font-black text-emerald-400">ONLINE</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <Database className="text-purple-400" size={28} />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Active Collections</p>
              <h3 className="text-2xl font-black">9 Schemas</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <Activity className="text-amber-400" size={28} />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Security Status</p>
              <h3 className="text-2xl font-black text-emerald-400">PROTECTED</h3>
            </div>
          </div>
        </div>

        {/* User Management & Enforcement Table */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Users size={20} className="text-rose-400" /> Account Management & Enforcement
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-800 text-rose-300 border border-rose-900/40">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.isBlocked ? (
                        <span className="text-xs font-bold text-red-400">BLOCKED</span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400">ACTIVE</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleUserBlock(u._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto ${
                          u.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {u.isBlocked ? (
                          <>
                            <Unlock size={14} /> Unblock
                          </>
                        ) : (
                          <>
                            <Lock size={14} /> Block
                          </>
                        )}
                      </button>
                    </td>
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

export default SuperAdminDashboard;
