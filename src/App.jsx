import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import MainLayout from "./layouts/MainLayout";
import { CardSkeleton } from "./components/LoadingSkeleton";

// Code splitting: Lazy load route components
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryView = lazy(() => import("./pages/CategoryView"));
const TopicView = lazy(() => import("./pages/TopicView"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const GlobalSearchResultsPage = lazy(() => import("./pages/GlobalSearchResultsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const SearchHistoryPage = lazy(() => import("./pages/SearchHistoryPage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Smart home: dashboard for logged-in users, landing page for guests
const SmartHomePage = () => {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <DemoPage />;
};

const PageLoadingFallback = () => (
  <div className="min-h-[400px] bg-gray-950 p-8">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse mb-4" />
        <div className="h-4 w-96 bg-gray-800 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

const App = () => (
  <AuthProvider>
    <AppProvider>
      <AuthModalProvider>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<SmartHomePage />} />
              <Route path="handbooks" element={<HomePage />} />
              <Route path="category/:categoryId" element={<CategoryView />} />
              <Route path="topic/:categoryId/:topicId" element={<TopicView />} />
              <Route path="quiz/:categoryId/:topicId" element={<QuizPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="bookmarks" element={<BookmarksPage />} />
              <Route path="search-history" element={<SearchHistoryPage />} />
              <Route path="search" element={<GlobalSearchResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthModalProvider>
    </AppProvider>
  </AuthProvider>
);

export default App;
