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
import CareerHubPage from "./pages/CareerHubPage";
import CommunityPage from "./pages/CommunityPage";
import MaintenancePage from "./pages/MaintenancePage";
import { useSettings } from "./context/SettingsContext";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Analytics from "./pages/admin/Analytics";
import AIInsights from "./pages/admin/AIInsights";
import FeedbackSupport from "./pages/admin/FeedbackSupport";
import Settings from "./pages/admin/Settings";
import AdminCommunity from "./pages/admin/Community";

const App = () => {
  const { settings, loading } = useSettings();

  if (loading) {
    return <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div className="loading-spinner"></div></div>;
  }

  const mainRoutes = (
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/resume-upload" element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />
      <Route path="/resume-analysis" element={<ProtectedRoute><ResumeAnalysisPage /></ProtectedRoute>} />
      <Route path="/career-suggestions" element={<ProtectedRoute><CareerSuggestionsPage /></ProtectedRoute>} />
      <Route path="/template-select" element={<ProtectedRoute><TemplateSelectPage /></ProtectedRoute>} />
      <Route path="/resume-view" element={<ProtectedRoute><ResumeViewPage /></ProtectedRoute>} />
      <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrepPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><CareerDashboard /></ProtectedRoute>} />
      <Route path="/job-recommendations" element={<ProtectedRoute><JobRecommendationsPage /></ProtectedRoute>} />
      <Route path="/career-hub" element={<ProtectedRoute><CareerHubPage /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  );

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
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai-insights" element={<AIInsights />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="feedback" element={<FeedbackSupport />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Conditionally render Maintenance or Main App */}
      {settings?.maintenanceMode ? (
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<MaintenancePage />} />
        </Route>
      ) : (
        mainRoutes
      )}
    </Routes>
  );
};

export default App;
