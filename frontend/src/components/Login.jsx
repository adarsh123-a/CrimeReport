import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import React from "react";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import logoImg from "../assets/logaster-2019-02-0231-h-crime-report-logo-13.png";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
      
      if (redirect) {
        navigate(redirect);
      } else {
        const role = res?.role || res?.user?.role;
        if (role === "SUPER_ADMIN") navigate("/dashboard/super-admin");
        else if (role === "STATION_ADMIN") navigate("/dashboard/station-admin");
        else if (role === "POLICE_OFFICER") navigate("/dashboard/police");
        else navigate("/dashboard/citizen");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (typeof err === "string") {
        setError(err);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Failed to login. Please check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-600/30 p-2">
            <img src={logoImg} alt="Crime Report Logo" className="h-9 w-auto object-contain invert" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Sign in to your Crime Report portal account</p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500/40 text-red-300 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
              <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
              <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account yet?{" "}
          <Link
            to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
            className="text-blue-400 font-bold hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
