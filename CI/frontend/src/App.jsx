import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
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

const App = () => {
  return (
    <Routes>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
