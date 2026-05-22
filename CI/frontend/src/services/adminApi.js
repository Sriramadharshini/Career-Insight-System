import axios from 'axios';

// Ensure the API URL correctly drops the trailing slash if present in env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const apiClient = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('careerInsightToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// --- API Endpoints ---

export const adminApi = {
  // Dashboard & Analytics
  getDashboardStats: () => apiClient.get('/dashboard/stats'),
  getRecentUsers: () => apiClient.get('/dashboard/recent-users'),
  getRecentActivity: () => apiClient.get('/dashboard/recent-activity'),
  getLoggedInUsers: () => apiClient.get('/dashboard/logged-in-users'),
  getUserGrowth: (range) => apiClient.get(`/dashboard/user-growth?range=${range}`),

  getAnalytics: (type, params) => apiClient.get(`/analytics/${type}`, { params }),
  getComprehensiveAnalytics: (period) => apiClient.get(`/analytics/comprehensive?period=${period}`),

  // Users
  getUsers: (params) => apiClient.get('/users', { params }),
  updateUserStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status }),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),

  // Careers
  getCareers: (params) => apiClient.get('/careers', { params }),
  createCareer: (data) => apiClient.post('/careers', data),
  updateCareer: (id, data) => apiClient.put(`/careers/${id}`, data),
  deleteCareer: (id) => apiClient.delete(`/careers/${id}`),

  // Assessments
  getAssessments: (params) => apiClient.get('/assessments', { params }),
  createAssessment: (data) => apiClient.post('/assessments', data),
  updateAssessment: (id, data) => apiClient.put(`/assessments/${id}`, data),
  deleteAssessment: (id) => apiClient.delete(`/assessments/${id}`),

  // Jobs
  getJobs: (params) => apiClient.get('/jobs', { params }),
  createJob: (data) => apiClient.post('/jobs', data),
  updateJob: (id, data) => apiClient.put(`/jobs/${id}`, data),
  updateJobStatus: (id, status) => apiClient.patch(`/jobs/${id}/status`, { status }),
  deleteJob: (id) => apiClient.delete(`/jobs/${id}`),

  // Courses
  getCourses: (params) => apiClient.get('/courses', { params }),
  createCourse: (data) => apiClient.post('/courses', data),
  updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data),
  updateCourseFeatured: (id, featured) => apiClient.patch(`/courses/${id}/featured`, { featured }),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),

  // Notifications
  getNotifications: () => apiClient.get('/notifications'),
  createNotification: (data) => apiClient.post('/notifications', data),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),

  // Skills
  getSkills: (params) => apiClient.get('/skills', { params }),
  createSkill: (data) => apiClient.post('/skills', data),
  updateSkill: (id, data) => apiClient.put(`/skills/${id}`, data),
  updateSkillTrending: (id, trending) => apiClient.patch(`/skills/${id}/trending`, { trending }),
  deleteSkill: (id) => apiClient.delete(`/skills/${id}`),

  // Feedback
  getFeedback: (params) => apiClient.get('/feedback', { params }),
  getFeedbackSummary: () => apiClient.get('/feedback/summary'),
  updateFeedbackStatus: (id, status) => apiClient.put(`/feedback/${id}/status`, { status }),
  deleteFeedback: (id) => apiClient.delete(`/feedback/${id}`),

  // Settings
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (data) => apiClient.put('/settings', data),
};
