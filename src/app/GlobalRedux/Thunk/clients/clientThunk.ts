import { createAsyncThunk } from "@reduxjs/toolkit";

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
    console.log("data", data);
    return data;
  }
);

export const createCLient = createAsyncThunk(
  "client/createClient",
  async (data: any) => {
    console.log("data from thunk", data);
    const getToken = await fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        return data;
      });
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  }
);
