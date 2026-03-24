import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Link } from "react-router-dom";
import { resumeApi } from "../api";
import { useAuth } from "../context/AuthContext";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  GraduationCap,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

const CareerDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeApi
      .getLatest(token)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-xl font-semibold text-gray-500">
          Analyzing Career Profile...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <section className="p-8 max-w-4xl mx-auto text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">Welcome to Career Insights</h2>
        <p className="text-gray-600 mb-8">
          Upload your resume to generate your personalized AI career dashboard.
        </p>
        <Link
          to="/resume-upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Upload Resume Now
        </Link>
      </section>
    );
  }

  const sectionScores = [
    { subject: "Summary", A: (data.sectionScores?.professionalSummary || 0) * (100 / 15), fullMark: 100 },
    { subject: "Skills", A: (data.sectionScores?.skills || 0) * (100 / 20), fullMark: 100 },
    { subject: "Experience", A: (data.sectionScores?.experience || 0) * (100 / 25), fullMark: 100 },
    { subject: "Education", A: (data.sectionScores?.education || 0) * (100 / 15), fullMark: 100 },
    { subject: "Certifications", A: (data.sectionScores?.certifications || 0) * (100 / 15), fullMark: 100 },
    { subject: "Achievements", A: (data.sectionScores?.achievements || 0) * (100 / 10), fullMark: 100 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in pb-20">
      <header className="mb-8 border-b pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Career Dashboard</h1>
          <p className="text-lg text-gray-500 mt-2">
            AI-powered analysis for {data.originalName || "your profile"}
          </p>
        </div>
        <Link to="/interview-prep" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md flex items-center gap-2">
          <span>🎙️</span> Practice Mock Interview
        </Link>
      </header>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition">
          <div className="p-4 bg-blue-50 rounded-full">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ATS Resume Score</p>
            <h3 className="text-3xl font-bold text-gray-900">{data.atsScore}/100</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition">
          <div className="p-4 bg-purple-50 rounded-full">
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Skill Readiness</p>
            <h3 className="text-3xl font-bold text-gray-900">{data.skillReadinessIndex}/100</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition">
          <div className="p-4 bg-green-50 rounded-full">
            <Briefcase className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Roles Matched</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {data.recommendedRoles?.length || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition">
          <div className="p-4 bg-yellow-50 rounded-full">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Timeline Gaps</p>
            <h3 className="text-3xl font-bold text-gray-900">{data.timelineGaps?.length || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Resume Section Breakdown
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sectionScores}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#4b5563", fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-500" /> Timeline & Career Gaps
            </h3>
            {data.timelineGaps && data.timelineGaps.length > 0 ? (
              <div className="space-y-4 relative border-l-2 border-yellow-200 ml-3 pl-6">
                {data.timelineGaps.map((gap, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-8 top-1 w-4 h-4 bg-yellow-400 rounded-full border-4 border-white"></span>
                    <p className="text-gray-700 bg-yellow-50/50 p-3 rounded-md border border-yellow-100">
                      {gap}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-gray-50 p-4 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> No significant career gaps detected. Excellent continuity!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Insights & Recommendations */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" /> Skill Gap Analysis
            </h3>
            <ul className="space-y-3">
              {data.gapAnalysis?.map((gap, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-red-400 mt-1">•</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{gap}</span>
                </li>
              ))}
              {!data.gapAnalysis?.length && (
                <li className="text-gray-500 italic">No critical gaps identified for standard roles.</li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-500" /> Recommended Pathways
            </h3>
            <div className="space-y-4">
              {data.learningPathways?.map((path, i) => (
                <div key={i} className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-900 font-medium">{path}</p>
                </div>
              ))}
              {data.certifications?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                    <Award className="w-4 h-4 mr-1 text-purple-500" /> Suggested Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-md border border-purple-200"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-emerald-500" /> Top Role Matches
            </h3>
            <div className="space-y-3">
              {data.recommendedRoles?.map((role, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition cursor-pointer group"
                >
                  <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition">
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDashboard;
