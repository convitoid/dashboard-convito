import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Auth {
  auth: any[] | "";
  status: "idle" | "loading" | "failed" | "success";
  error: any | null;
}

const initialState: Auth = {
  auth: [],
  status: "idle",
  error: null,
};

export const authLogin = createAsyncThunk(
  "auth/authLogin",
  async (data: any) => {
    console.log("masuk ke slicer", data);
    return data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        state.status = "success";
        state.auth = action.payload.data;
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
