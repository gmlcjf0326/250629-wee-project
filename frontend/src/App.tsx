import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/Home/HomePage';
import AboutIntro from './pages/About/AboutIntro';
import AboutHistory from './pages/About/AboutHistory';
import AboutOrganization from './pages/About/AboutOrganization';
import AboutCI from './pages/About/AboutCI';
import AboutSystem from './pages/About/AboutSystem';
import InstitutionGuide from './pages/Institution/InstitutionGuide';
import InstitutionMap from './pages/Institution/InstitutionMap';
import ResourcesManual from './pages/Resources/ResourcesManual';
import ResourcesProgram from './pages/Resources/ResourcesProgram';
import ResourcesCases from './pages/Resources/ResourcesCases';
import NewsletterPage from './pages/Newsletter/NewsletterPage';
import NotFound from './pages/NotFound';
import PagePlaceholder from './components/common/PagePlaceholder';
import AnnouncementPage from './pages/Notice/AnnouncementPage';
import { NoticeDetailPage } from './pages/Notice/NoticeDetailPage';
import { SurveyListPage } from './pages/Survey/SurveyListPage';
import { SurveyDetailPage } from './pages/Survey/SurveyDetailPage';
import { SurveyStatsPage } from './pages/Survey/SurveyStatsPage';
import { SurveyResultsPage } from './pages/Survey/SurveyResultsPage';
import { CommunityListPage } from './pages/Community/CommunityListPage';
import { CommunityWritePage } from './pages/Community/CommunityWritePage';
import { CommunityDetailPage } from './pages/Community/CommunityDetailPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { EPKILoginPage } from './pages/Auth/EPKILoginPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import ContactPage from './pages/Contact/ContactPage';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Auth components
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin components
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import NoticesAdmin from './pages/Admin/NoticesAdmin';
import NoticeForm from './pages/Admin/NoticeForm';
import ScrapedContent from './pages/Admin/ScrapedContent';
import SurveyAdmin from './pages/Admin/SurveyAdmin';
import ResourcesAdmin from './pages/Admin/ResourcesAdmin';
import ContactAdmin from './pages/Admin/ContactAdmin';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* About Routes */}
            <Route path="about">
              <Route index element={<Navigate to="/about/intro" replace />} />
              <Route path="intro" element={<AboutIntro />} />
              <Route path="system" element={<AboutSystem />} />
              <Route path="history" element={<AboutHistory />} />
              <Route path="organization" element={<AboutOrganization />} />
              <Route path="ci" element={<AboutCI />} />
            </Route>
            
            {/* Institution Routes */}
            <Route path="institution">
              <Route index element={<Navigate to="/institution/guide" replace />} />
              <Route path="guide" element={<InstitutionGuide />} />
              <Route path="map" element={<InstitutionMap />} />
            </Route>
            
            {/* Resources Routes */}
            <Route path="resources">
              <Route index element={<Navigate to="/resources/manual" replace />} />
              <Route path="manual" element={<ResourcesManual />} />
              <Route path="program" element={<ResourcesProgram />} />
              <Route path="cases" element={<ResourcesCases />} />
            </Route>
            
            {/* Newsletter */}
            <Route path="newsletter" element={<NewsletterPage />} />
            
            {/* Community */}
            <Route path="community">
              <Route index element={<CommunityListPage />} />
              <Route path=":id" element={<CommunityDetailPage />} />
              <Route 
                path="write" 
                element={
                  <ProtectedRoute>
                    <CommunityWritePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path=":id/edit" 
                element={
                  <ProtectedRoute>
                    <CommunityWritePage />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Notice Routes */}
            <Route path="notice">
              <Route index element={<Navigate to="/notice/announcement" replace />} />
              <Route path="announcement" element={<AnnouncementPage />} />
              <Route path="announcement/:id" element={<NoticeDetailPage />} />
              <Route path="survey" element={<SurveyListPage />} />
            </Route>
            
            {/* Survey Routes */}
            <Route path="survey">
              <Route index element={<SurveyListPage />} />
              <Route path=":id" element={<SurveyDetailPage />} />
              <Route path=":id/results" element={<SurveyResultsPage />} />
            </Route>
            
            {/* Dashboard - Protected */}
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Profile - Protected */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Contact */}
            <Route path="contact" element={<ContactPage />} />
            
            {/* Unauthorized */}
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Auth Routes - Outside of Layout */}
          <Route path="login" element={<LoginPage />} />
          <Route path="login/epki" element={<EPKILoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="notices" element={<NoticesAdmin />} />
            <Route path="notices/new" element={<NoticeForm />} />
            <Route path="notices/:id/edit" element={<NoticeForm />} />
            <Route path="scraped-content" element={<ScrapedContent />} />
            <Route path="surveys" element={<SurveyAdmin />} />
            <Route path="resources" element={<ResourcesAdmin />} />
            <Route path="contacts" element={<ContactAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App
