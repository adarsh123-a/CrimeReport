import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/cases", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

export const createReport = createAsyncThunk(
  "reports/createReport",
  async (reportData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.post("/api/cases", reportData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit report"
      );
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  "reports/updateReportStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`/api/cases/${id}`, statusData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update report status"
      );
    }
  }
);

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    loading: false,
    error: null,
    activeFilters: {
      search: "",
      status: "",
      priority: "",
      category: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.activeFilters = {
        search: "",
        status: "",
        priority: "",
        category: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload);
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        const index = state.reports.findIndex(
          (r) => r.id === action.payload.id || r._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      });
  },
});

export const { setFilters, resetFilters } = reportSlice.actions;
export default reportSlice.reducer;
