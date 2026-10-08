import axios from "axios";

// The Next.js web dashboard's API client. In a browser the TLS stack belongs
// to the browser, so there is nothing for the app to configure here.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
