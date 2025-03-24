import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthServices/AuthContext";
import React from "react";
import axios from "axios";

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.email && formData.password) {
      try {
        const response = await axios.get(
          "https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/user.json",
          formData
        );
        console.log(response);
        const resArray = Object.values(response.data);
        validateUser(resArray, formData.email, formData.password);
      } catch (error) {
        console.log(error);
      }
    } else {
      setError("Invalid email or password");
    }
  };

  const validateUser = (res, email, pass) => {
    if (res && email && pass) {
      let validated = false;
      res.forEach((element) => {
        if (element.email == email && element.password == pass) {
          validated = true;
        }
      });
      if (validated) {
        alert("Login successful!");
        setFormData({ email: "", password: "" });
        navigate("/Home");
        validated = false;
      } else {
        alert("Login failed, please check email and password");
        validated = false;
      }
    } else {
      alert("All fields requird");
      return;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Not registered?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
