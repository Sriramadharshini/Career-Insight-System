const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api";

const createHeaders = (token, isJson = true) => {
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (endpoint, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch (_error) {
    throw new Error(
      "Cannot connect to the server. Start the backend and check that the API URL is correct."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const healthApi = {
  check: () => apiRequest("/health")
};

export const authApi = {
  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(payload)
    }),
  adminLogin: (payload) =>
    apiRequest("/auth/admin/login", {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(payload)
    }),
  getMe: (token) =>

    apiRequest("/auth/me", {
      headers: createHeaders(token, false)
    })
};

export const profileApi = {
  save: (token, payload) =>
    apiRequest("/profile", {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify(payload)
    }),
  generateSummary: (token, payload) =>
    apiRequest("/profile/generate-summary", {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify(payload)
    }),
  get: (token) =>
    apiRequest("/profile", {
      headers: createHeaders(token, false)
    })
};

export const resumeApi = {
  upload: async (token, file, targetRole = "") => {
    const formData = new FormData();
    formData.append("resume", file);
    if (targetRole) {
      formData.append("targetRole", targetRole);
    }

    return apiRequest("/resume/upload", {
      method: "POST",
      headers: createHeaders(token, false),
      body: formData
    });
  },
  getLatest: (token) =>
    apiRequest("/resume", {
      headers: createHeaders(token, false)
    }),
  analyzeProfile: (token, profile) =>
    apiRequest("/resume/analyze-profile", {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify({ profile })
    }),
  evaluateInterview: (token, payload) =>
    apiRequest("/resume/evaluate-interview", {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify(payload)
    }),
  evaluateVideoInterview: (token, payload) =>
    apiRequest("/resume/evaluate-video-interview", {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify(payload)
    }),
  getJobRecommendations: (token) =>
    apiRequest("/resume/job-recommendations", {
      headers: createHeaders(token, false)
    })
};
