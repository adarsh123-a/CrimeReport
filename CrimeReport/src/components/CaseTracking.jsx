import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig"; // Ensure Firebase Auth is imported

function CaseTracking() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser; // Get current logged-in user

  const fetchCases = async () => {
    try {
      const response = await axios.get(
        "https://crimereport-3f796-default-rtdb.asia-southeast1.firebasedatabase.app/cases.json"
      );
      console.log(response.data);
      setCases(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  return <></>;
}

export default CaseTracking;
