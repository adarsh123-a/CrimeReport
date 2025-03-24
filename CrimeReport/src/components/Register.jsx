import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthServices/AuthContext";
import React from "react";
import axios from "axios";

function Register() {
  // const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // register({ email: formData.email, password: formData.password });
    const response = await axios.post(
      "https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/user.json",
      formData
    );
    console.log(response);
    alert("Registration successful! Please login.");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Register
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already registered?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
