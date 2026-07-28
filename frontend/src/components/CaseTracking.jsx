import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthServices/AuthContext";

function CaseTracking() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCases = async () => {
    try {
      const response = await axios.get("/api/cases");
      setCases(response.data || []);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  return <></>;
}

export default CaseTracking;
