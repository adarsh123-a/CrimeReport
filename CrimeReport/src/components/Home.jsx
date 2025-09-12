import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <header
        className="h-[50vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?city,police')",
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold">Report Crime. Stay Safe.</h1>
          <p className="text-lg mt-2">Your report could save lives.</p>
          <button className="pt-2"><Link
            to="/IncidentReporting"
            className=" p-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Report Now
          </Link></button>
        </div>
      </header>

      {/* Features Section */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">📢 Report a Crime</h2>
          <p className="text-gray-400">Easily report incidents anonymously.</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">📊 Crime Statistics</h2>
          <p className="text-gray-400">View real-time crime trends.</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">🚨 Emergency Contacts</h2>
          <p className="text-gray-400">Access helplines and authorities.</p>
        </div>
      </section>

      {/* Recent Crime Reports */}
      <section className="p-6">
        <h2 className="text-2xl font-bold text-center">🔍 Recent Reports</h2>
        <ul className="mt-4 space-y-2">
          <li className="bg-gray-800 p-3 rounded-lg">
            Burglary reported in XYZ area – 10 mins ago
          </li>
          <li className="bg-gray-800 p-3 rounded-lg">
            Suspicious activity near ABC Park – 30 mins ago
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4 mt-6">
        <p>© 2025 Crime Report System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
