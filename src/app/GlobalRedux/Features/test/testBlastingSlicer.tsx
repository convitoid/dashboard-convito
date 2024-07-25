import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TestBlasting {
  data: any[] | "";
  status: "idle" | "loading" | "failed" | "success";
  error: any | null;
}

const initialState: TestBlasting = {
  data: [],
  status: "idle",
  error: null,
};

export const sendMessage = createAsyncThunk(
  "testBlasting/sendMessage",
  async (data: any) => {
    const getToken = await fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    const response = await fetch("/api/test/blasting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify(data),
    });

    const res = await response.json().then((data) => {
      return data;
    });

    return res;
  }
);

export const testBlastingSlice = createSlice({
  name: "testBlasting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload.data;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default testBlastingSlice.reducer;
