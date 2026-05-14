import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,

  headers: {
    Authorization:
      process.env.REACT_APP_ADMIN_SECRET,
  },
});