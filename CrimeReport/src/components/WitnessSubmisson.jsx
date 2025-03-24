import React, { useState, useEffect } from "react";
import axios from "axios";

function WitnessSubmission() {
  const [cases, setCases] = useState([]); // Stores case data
  const [search, setSearch] = useState(""); // Case search input
  const [selectedCase, setSelectedCase] = useState(null); // Selected case
  const [filteredCases, setFilteredCases] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    Adhar: "",
    statement: "",
  });

  const fetchCases = async () => {
    try {
      const response = await axios.get(
        `https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/data.json`
      );

      if (response.data) {
        const caseList = Object.entries(response.data).map(([key, value]) => ({
          ...value,
          firebaseKey: key, // Store Firebase's generated key
        }));
        setCases(caseList); // Store cases with keys
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  // Fetch cases when component mounts
  useEffect(() => {
    fetchCases();
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    // Filter cases locally
    if (query) {
      setFilteredCases(
        cases.filter(
          (c) =>
            c.caseId.toLowerCase().includes(query) || // Search by Case ID
            (c.name && c.name.toLowerCase().includes(query)) // Search by Name
        )
      );
    } else {
      setFilteredCases([]);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle case selection
  const handleSelectCase = (caseData) => {
    setSelectedCase(caseData);
    setSearch(""); // Clear search input after selecting a case
  };

  // Submit witness data to Firebase under selected case
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCase) {
      alert("Please select a case first!");
      return;
    }

    try {
      const updatedWitnesses = selectedCase.witnesses
        ? [...selectedCase.witnesses, formData]
        : [formData];

      await axios.patch(
        `https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/data/${selectedCase.firebaseKey}.json`,
        { witnesses: updatedWitnesses }
      );

      alert("Witness information submitted successfully!");

      setFormData({ name: "", phone: "", Adhar: "", statement: "" });
      setSelectedCase((prevCase) => ({
        ...prevCase,
        witnesses: updatedWitnesses,
      }));
    } catch (error) {
      console.error("Error submitting witness:", error);
      alert("Failed to submit witness information.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Witness Submission Form
        </h2>

        {/* Case Search Box */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">
            Search Case by Name
          </label>
          <input
            type="text"
            placeholder="Enter case name"
            value={search}
            onChange={handleSearchChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Case Search Results */}
        {/* Case Search Results */}
        {search &&
          filteredCases.map((c) => (
            <div
              key={c.caseId}
              onClick={() => handleSelectCase(c)}
              className="p-2 border rounded-lg bg-gray-200 cursor-pointer hover:bg-gray-300"
            >
              {c.name} (Case ID: {c.caseId})
            </div>
          ))}

        {/* Selected Case Info */}
        {selectedCase && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <h3 className="font-bold text-lg">{selectedCase.personName}</h3>
            <p>
              <strong>Case ID:</strong> {selectedCase.caseId}
            </p>
            <p>
              <strong>Crime:</strong> {selectedCase.incidentType}
            </p>
            {selectedCase.witnesses &&
              selectedCase.witnesses.length &&
              selectedCase.witnesses.map((w, i) => (
                <p>
                  <strong>Witness {i + 1}:</strong> {w.name} - {w.phone}
                </p>
              ))}
          </div>
        )}

        {/* Witness Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-600 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-600 font-medium">
                Adhar Number
              </label>
              <input
                type="number"
                name="Adhar"
                placeholder="Enter Adhar Number"
                value={formData.Adhar}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Witness Statement
            </label>
            <textarea
              name="statement"
              placeholder="Describe what you witnessed..."
              value={formData.statement}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit Witness Info
          </button>
        </form>
      </div>
    </div>
  );
}

export default WitnessSubmission;
