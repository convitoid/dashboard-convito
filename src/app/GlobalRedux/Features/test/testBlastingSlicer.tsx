import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TestBlasting {
  data: any[] | "";
  logs: any[] | "";
  detailLogs: any[] | "";
  invitation: any | "";
  invitationConfirm: any[] | "";
  answer: any[] | "";
  status: "idle" | "loading" | "failed" | "success";
  statusLogs: "idle" | "loading" | "failed" | "success";
  statusAnswer: "idle" | "loading" | "failed" | "success";
  statusDetailLogs: "idle" | "loading" | "failed" | "success";
  statusInvitationConfirm: "idle" | "loading" | "failed" | "success";
  error: any | null;
}

const initialState: TestBlasting = {
  data: [],
  logs: [],
  detailLogs: [],
  invitation: [],
  invitationConfirm: [],
  answer: [],
  status: "idle",
  statusLogs: "idle",
  statusAnswer: "idle",
  statusDetailLogs: "idle",
  statusInvitationConfirm: "idle",
  error: null,
};

export const sendMessage = createAsyncThunk(
  "testBlasting/sendMessage",
  async (data: any) => {
    console.log(data);
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

    console.log("slicer", res);

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
    return data;
  }
);

export const putAnswerInvitation = createAsyncThunk(
  "testBlasting/putAnswerInvitation",
  async (data: any) => {
    console.log("put answer slice", data);
    const response = await fetch(`/api/test/invitation/${data.clientId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json().then((data) => {
      return data;
    });

    console.log("put answer slice res", res);

    return res;
  }
);

export const getDetailLogs = createAsyncThunk(
  "testBlasting/getDetailLogs",
  async (clientId: string) => {
    const response = await fetch(`/api/test/blasting/${clientId}`);
    const data = await response.json();

    const newJson = [
      {
        ...data,
        questionLog: data.questionLog,
      },
    ];

    return newJson;
  }
);

export const confirmInvitation = createAsyncThunk(
  "testBlasting/confirmInvitation",
  async (data: any) => {
    const response = await fetch(`/api/test/invitation/${data.questionId}`, {
      method: "PUT",
      body: JSON.stringify({
        questionId: data.questionId,
        answer: data.confirm_invitation,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
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
        console.log("action.payload", action.payload);
        state.status = "success";
        // state.data = action.payload;
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
      })

      .addCase(putAnswerInvitation.pending, (state) => {
        state.statusAnswer = "loading";
      })
      .addCase(putAnswerInvitation.fulfilled, (state, action) => {
        state.statusAnswer = "success";
        state.answer = action.payload;
      })
      .addCase(putAnswerInvitation.rejected, (state, action) => {
        state.statusAnswer = "failed";
        state.error = action.error.message;
      })

      .addCase(getDetailLogs.pending, (state) => {
        state.statusDetailLogs = "loading";
      })
      .addCase(getDetailLogs.fulfilled, (state, action) => {
        state.statusDetailLogs = "success";
        state.detailLogs = action.payload;
      })
      .addCase(getDetailLogs.rejected, (state, action) => {
        state.statusDetailLogs = "failed";
        state.error = action.error.message;
      })

      .addCase(confirmInvitation.pending, (state) => {
        state.statusInvitationConfirm = "loading";
      })
      .addCase(confirmInvitation.fulfilled, (state, action) => {
        console.log("action.payload confirmation", action.payload);
        state.statusInvitationConfirm = "success";
        state.invitationConfirm = action.payload;
      })
      .addCase(confirmInvitation.rejected, (state, action) => {
        state.statusInvitationConfirm = "failed";
        state.error = action.error.message;
      });
  },
});

export default testBlastingSlice.reducer;
