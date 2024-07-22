import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  users: any[] | "";
  status: "idle" | "loading" | "failed" | "success";
  error: any | null;
}

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const getToken = await fetch("/api/auth/session")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  const response = await fetch("/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken.user.jwt}`,
    },
  });

  const data = await response.json();
  return data;
});

export const createUser = createAsyncThunk(
  "user/createUser",
  async (data: any) => {
    console.log(data);
    const getToken = await fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify(data),
    });

    // dispatch fetchUsers
    fetchUsers();
    const res = await response.json();
    return res;
  }
);

const initialState: User = {
  users: [],
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload.data;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
