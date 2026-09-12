import { request } from "./client";
export const adminSession = {
  get: () => sessionStorage.getItem("valthera-admin-token"),
  set: (token) => sessionStorage.setItem("valthera-admin-token", token),
  clear: () => sessionStorage.removeItem("valthera-admin-token"),
};
const base = (
  import.meta.env.VITE_ADMIN_API_URL ||
  (import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/users\/?$/, "/admin")
    : "/api/admin")
).replace(/\/$/, "");
const config = {
  base,
  storage: adminSession,
  expiredEvent: "admin-session-expired",
};
export const adminApi = {
  get: (path) => request(path, {}, config),
  post: (path, body) => request(path, { method: "POST", body }, config),
  patch: (path, body) => request(path, { method: "PATCH", body }, config),
  put: (path, body) => request(path, { method: "PUT", body }, config),
  delete: (path) => request(path, { method: "DELETE" }, config),
};
