import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function IncidentReport() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [data, setData] = useState([]);
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

  // Fetch incident reports from Firebase
  const fetchData = async () => {
    if (!auth.currentUser) {
      console.log("User not authenticated");
      return;
    }

    try {
      const database = getDatabase();
      const dataRef = ref(database, 'data');
      
      // Listen for value changes
      onValue(dataRef, (snapshot) => {
        const responseData = snapshot.val();
        if (responseData) {
          // Convert object to array
          const dataArray = Object.keys(responseData).map(key => ({
            id: key,
            ...responseData[key]
          }));
          setData(dataArray);
        } else {
          setData([]);
        }
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads (stores file names)
  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => file.name);
    setFormData((prev) => ({
      ...prev,
      files: uploadedFiles,
    }));
  };

  // Submit form and post data to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!auth.currentUser) {
      alert("Please login to submit a report");
      navigate("/login");
      return;
    }

    try {
      const database = getDatabase();
      const dataRef = ref(database, 'data');
      
      const randomId = "C" + String(Date.now());
      const payload = {
        ...formData,
        caseId: randomId,
        status: "OPEN",
        witnesses: [],
        lawyer: {},
        judge: {},
        policeOfficer: {},
      };
      
      // Push data to Firebase
      await push(dataRef, payload);
      
      console.log("Incident Report Submitted");
      alert("Incident report submitted successfully!");

      // Reset form after submission
      setFormData({
        name: "",
        incidentType: "",
        fatherName: "",
        date: "",
        time: "",
        location: "",
        gender: "",
        description: "",
        evidence: "",
      });
    } catch (error) {
      console.log("Error submitting incident:", error);
      alert("Failed to submit report.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
            Incident Reporting Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-600 font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="enter name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* father Name */}
            <div>
              <label className="block text-gray-600 font-medium">
                Father Name
              </label>
              <input
                type="text"
                name="fatherName"
                placeholder="enter name"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Incident Type  */}
            <div>
              <label className="block text-gray-600 font-medium">
                Incident Type
              </label>
              <input
                type="text"
                name="incidentType"
                placeholder="e.g., Theft, Assault"
                value={formData.incidentType}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-600 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600 font-medium">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-600 font-medium">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* gender */}
            <div>
              <label className="block text-gray-600 font-medium">Gender</label>
              <input
                type="text"
                name="gender"
                placeholder="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-600 font-medium">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the incident..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-600 font-medium">
                Upload Evidence
              </label>
              <input
                name="evidence"
                placeholder="Upload evidence link"
                value={formData.evidence}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>

      {/* Display Submitted Reports */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Incident Reports</h2>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">
                {item.name}- ({item.incidentType})
              </h3>
              <p>
                <strong>Date:</strong> {item.date}
              </p>
              <p>
                <strong>Time:</strong> {item.time}
              </p>
              <p>
                <strong>Location:</strong> {item.location}
              </p>
              <p>
                <strong>Description:</strong> {item.description}
              </p>

              {/* Check if files exist and are an array */}
              {item.evidence && item.evidence.trim() !== "" && (
                <p>
                  <strong>Evidence:</strong>
                  <img
                    src={item.evidence}
                    alt="Evidence"
                    className="mt-2 rounded-lg w-64 h-auto"
                  />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default IncidentReport;