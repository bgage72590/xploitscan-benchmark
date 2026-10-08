// Data layer for the admin dashboard (React client). These functions CALL the
// admin API; the routes themselves live in server.js and are checked there.
import { api } from "./client";

export async function fetchUsers(page = 1) {
  const { data } = await api.get("/admin/users", { params: { page } });
  return data;
}

export async function fetchUser(id) {
  const { data } = await api.get(`/admin/users/${id}`);
  return data;
}
