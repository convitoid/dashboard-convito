import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TestBlasting {
  data: any[] | "";
  logs: any[] | "";
  invitation: any[] | "";
  status: "idle" | "loading" | "failed" | "success";
  statusLogs: "idle" | "loading" | "failed" | "success";
  error: any | null;
}

const initialState: TestBlasting = {
  data: [],
  logs: [],
  invitation: [],
  status: "idle",
  statusLogs: "idle",
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

export const fetchLogs = createAsyncThunk(
  "testBlasting/fetchLogs",
  async () => {
    const getToken = await fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    const response = await fetch("/api/test/blasting", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken.user.jwt}`,
      },
    });

    const res = await response.json().then((data) => {
      return data;
    });

    return res;
  }
);

export const fetchInvitation = createAsyncThunk(
  "testBlasting/fetchInvitation",
  async (clientId: string) => {
    const response = await fetch(`/api/test/invitation/${clientId}`);
    const data = await response.json();
    console.log("dari redux", data);
    return data;
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
      })

      .addCase(fetchLogs.pending, (state) => {
        state.statusLogs = "loading";
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.statusLogs = "success";
        state.logs = action.payload.data;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.statusLogs = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchInvitation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvitation.fulfilled, (state, action) => {
        state.status = "success";
        state.invitation = action.payload;
      })
      .addCase(fetchInvitation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default testBlastingSlice.reducer;
