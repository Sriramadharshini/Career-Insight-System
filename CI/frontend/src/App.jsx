import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPageModern";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import CareerSuggestionsPage from "./pages/CareerSuggestionsPage";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import ResumeViewPage from "./pages/ResumeViewPage";
import CareerDashboard from "./pages/CareerDashboard";
import TemplateSelectPage from "./pages/TemplateSelectPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import JobRecommendationsPage from "./pages/JobRecommendationsPage";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import CareerManagement from "./pages/admin/CareerManagement";
import AssessmentManagement from "./pages/admin/AssessmentManagement";
import JobManagement from "./pages/admin/JobManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import Analytics from "./pages/admin/Analytics";
import SkillsManagement from "./pages/admin/SkillsManagement";
import FeedbackSupport from "./pages/admin/FeedbackSupport";

const App = () => {
  return (
    <Routes>
      {/* Admin Module Routes (Outside Main Layout) */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="careers" element={<CareerManagement />} />
        <Route path="assessments" element={<AssessmentManagement />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="notifications" element={<NotificationManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="skills" element={<SkillsManagement />} />
        <Route path="feedback" element={<FeedbackSupport />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Main App Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <ResumeUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-analysis"
          element={
            <ProtectedRoute>
              <ResumeAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-suggestions"
          element={
            <ProtectedRoute>
              <CareerSuggestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/template-select"
          element={
            <ProtectedRoute>
              <TemplateSelectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-view"
          element={
            <ProtectedRoute>
              <ResumeViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-prep"
          element={
            <ProtectedRoute>
              <InterviewPrepPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CareerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-recommendations"
          element={
            <ProtectedRoute>
              <JobRecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
