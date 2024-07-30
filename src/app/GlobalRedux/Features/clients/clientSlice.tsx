import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Client {
  clients: any[] | "";
  status: "idle" | "loading" | "failed" | "success";
  error: any | null;
}

const initialState: Client = {
  clients: [],
  status: "idle",
  error: null,
};

export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async () => {
    const getToken = await fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    const response = await fetch("/api/clients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken.user.jwt}`,
      },
    });

    const data = await response.json();
    return data;
  }
);

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "success";
        state.clients = action.payload.data;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default clientSlice.reducer;
