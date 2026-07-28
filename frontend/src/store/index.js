import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import reportReducer from "../features/reports/reportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
  },
});
