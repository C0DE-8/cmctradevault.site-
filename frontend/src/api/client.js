const BASE = (import.meta.env.VITE_API_URL || "/api/users").replace(/\/$/, "");
export const session = {
  get: () => sessionStorage.getItem("lite-token"),
  set: (token) => sessionStorage.setItem("lite-token", token),
  clear: () => sessionStorage.removeItem("lite-token"),
};
export async function request(path, options = {}, config = {}) {
  const {
    base = BASE,
    storage = session,
    expiredEvent = "session-expired",
  } = config;
  const multipart = options.body instanceof FormData;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        ...(!multipart && options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...(storage.get() ? { Authorization: `Bearer ${storage.get()}` } : {}),
        ...options.headers,
      },
      body: options.body
        ? multipart
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (
      response.status === 401 &&
      storage.get() &&
      ["No token provided", "Invalid or expired token"].includes(data.message)
    ) {
      storage.clear();
      window.dispatchEvent(new Event(expiredEvent));
    }
    if (!response.ok)
      throw new Error(data.message || `Request failed (${response.status})`);
    return data;
  } catch (error) {
    if (error.name === "AbortError")
      throw new Error("The request timed out. Please try again.", {
        cause: error,
      });
    if (error instanceof TypeError)
      throw new Error("Unable to reach the server. Please try again shortly.", {
        cause: error,
      });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
};
