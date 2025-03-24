import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const statusEnum = [
  "Open",
  "Under Investigation",
  "On Trial",
  "Convicted",
  "Acquitted",
  "Closed",
];

function SearchCrime() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("caseId");

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [lawyerName, setLawyerName] = useState("");
  const [lawyerPhone, setLawyerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/data.json`
      );

      if (response.data) {
        const cases = Object.entries(response.data).map(([key, data]) => ({
          ...data,
          firebaseKey: key, // Store Firebase key for updates
        }));

        const filteredData = cases.filter((item) =>
          item[filterType]
            ?.toString()
            .toLowerCase()
            .includes(search.toLowerCase())
        );

        setData(filteredData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchdata();
    }
  };

  const openLawyerDialog = (x) => {
    setSelectedCaseId(x.caseId);
    setSelectedCase(x);
    setLawyerName("");
    setLawyerPhone("");
    setError("");
    document.getElementById("customDialog").classList.remove("hidden");
  };

  const closeLawyerDialog = () => {
    document.getElementById("customDialog").classList.add("hidden");
  };

  const linkLawyer = async () => {
    if (!lawyerName || !lawyerPhone) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const updateData = { lawyer: { name: lawyerName, phone: lawyerPhone } };

      await axios.patch(
        `https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/data/${selectedCase.firebaseKey}.json`,
        updateData
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.caseId === selectedCaseId
            ? { ...item, lawyer: updateData.lawyer }
            : item
        )
      );

      closeLawyerDialog();
    } catch (error) {
      console.error("Error linking lawyer:", error);
      setError("Failed to link lawyer. Please try again.");
    }
    setLoading(false);
  };

  const updateCaseStatus = async (caseId, firebaseKey, newStatus) => {
    try {
      await axios.patch(
        `https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/data/${firebaseKey}.json`,
        { status: newStatus }
      );

      // Update state to reflect changes immediately
      setData((prevData) =>
        prevData.map((item) =>
          item.caseId === caseId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      {/* Search Section */}
      <div className="flex items-center gap-3">
        <select
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="caseId">Case ID</option>
          <option value="name">Person Name</option>
          <option value="fatherName">Father Name</option>
          <option value="typeOfCrime">Type of Crime</option>
        </select>

        <div className="relative">
          <input
            type="search"
            placeholder={`Search by ${filterType}`}
            className="p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Search className="absolute left-3 top-2 text-gray-500" size={20} />
        </div>
      </div>

      {/* Case Cards */}
      {data.length > 0 && (
        <div className="w-full flex flex-col items-center gap-4 mt-4">
          {data.map((item) => (
            <div
              key={item.caseId}
              className="bg-white shadow-md p-4 rounded-lg w-3/4 md:w-1/2 lg:w-1/3"
            >
              <p>
                <strong>Case ID:</strong> {item.caseId}
              </p>
              <h1 className="text-xl font-bold">Criminal Name: {item.name}</h1>
              <p>
                <strong>Father Name:</strong> {item.fatherName}
              </p>
              <p>
                <strong>Crime Date:</strong> {item.date}, {item.time}
              </p>
              <p>
                <strong>Location:</strong> {item.location}
              </p>
              <p>
                <strong>Gender:</strong> {item.gender}
              </p>

              {/* Status Dropdown */}
              <div className="flex items-center gap-2">
                <strong>Status:</strong>
                <select
                  value={item.status}
                  onChange={(e) =>
                    updateCaseStatus(
                      item.caseId,
                      item.firebaseKey,
                      e.target.value
                    )
                  }
                  className="p-1 border rounded-md bg-gray-100"
                >
                  {statusEnum.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p>
                <strong>Type of Crime:</strong> {item.typeOfCrime}
              </p>

              {item.lawyer ? (
                <p className="mt-2 text-green-600">
                  <strong>Lawyer:</strong> {item.lawyer.name} (
                  {item.lawyer.phone})
                </p>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-md"
                  onClick={() => openLawyerDialog(item)}
                >
                  Link Lawyer
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Custom Dialog (Modal) */}
      <div
        id="customDialog"
        className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 text-xl"
            onClick={closeLawyerDialog}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold text-center mb-4">Link Lawyer</h2>
          <input
            type="text"
            placeholder="Lawyer Name"
            value={lawyerName}
            onChange={(e) => setLawyerName(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          />
          <input
            type="tel"
            placeholder="Lawyer Phone"
            value={lawyerPhone}
            onChange={(e) => setLawyerPhone(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex justify-between">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
              onClick={closeLawyerDialog}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={linkLawyer}
              disabled={loading}
            >
              {loading ? "Linking..." : "Link Lawyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCrime;
