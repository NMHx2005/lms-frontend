import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';

// Styles
import '@/styles/auth.css';

import { store, AppDispatch } from '@/store/index.ts';
import { getProfile } from '@/store/authSlice';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import Layout from './components/Layout/client/Layout.tsx';
import DashboardLayout from './components/Layout/client/DashboardLayout.tsx';
import TeacherLayout from './components/Layout/client/TeacherLayout.tsx';
import ScrollToTop from './components/common/ScrollToTop.tsx';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
const Home = lazy(() => import('./pages/client/Home/Home.tsx'));
const Login = lazy(() => import('./pages/client/Login/Login.tsx'));
const Register = lazy(() => import('./pages/client/Register/Register.tsx'));
const CourseDetail = lazy(() => import('./pages/client/CourseDetail/CourseDetail.tsx'));
const Learning = lazy(() => import('./pages/client/Learning/Learning.tsx'));
import { UserRole } from './components/common/ProtectedRoute.tsx';
const Dashboard = lazy(() => import('./pages/client/Dashboard/Dashboard.tsx'));
const Profile = lazy(() => import('./pages/client/Profile/Profile.tsx'));
const AdminLayoutLazy = lazy(() => import('./components/Layout/admin/AdminLayout.tsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const CourseModeration = lazy(() => import('./pages/admin/CourseModeration'));
const CourseDirectory = lazy(() => import('./pages/admin/CourseDirectory'));
const RefundCenter = lazy(() => import('./pages/admin/RefundCenter'));
const BillsPayments = lazy(() => import('./pages/admin/BillsPayments'));
const AIModeration = lazy(() => import('./pages/admin/AIModeration'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));
const PermissionsManagement = lazy(() => import('./pages/admin/PermissionsManagement'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const SupportCenter = lazy(() => import('./pages/admin/SupportCenter/SupportCenter.tsx'));
const Announcements = lazy(() => import('./pages/admin/Announcements'));
const PerformanceMonitoring = lazy(() => import('./pages/admin/PerformanceMonitoring'));
const BackupRestore = lazy(() => import('./pages/admin/BackupRestore'));
const Courses = lazy(() => import('./pages/client/Courses/Coures.tsx'));
const ForgotPassword = lazy(() => import('./pages/client/ForgotPassword/ForgotPassword.tsx'));
const Checkout = lazy(() => import('./pages/client/Checkout/Checkout.tsx'));
const AssignmentWorkspace = lazy(() => import('./pages/client/AssignmentWorkspace/AssignmentWorkspace.tsx'));
const MyCourses = lazy(() => import('./pages/client/Dashboard/Courses'));
const Progress = lazy(() => import('./pages/client/Dashboard/Progress/Progress'));
const Bills = lazy(() => import('./pages/client/Dashboard/Bills/Bills'));
const Refunds = lazy(() => import('./pages/client/Dashboard/Refunds/Refunds'));
const Ratings = lazy(() => import('./pages/client/Dashboard/Ratings/Ratings'));
const ProfileDashboard = lazy(() => import('./pages/client/Dashboard/Profile/Profile'));
const Notifications = lazy(() => import('./pages/client/Dashboard/Notifications/Notifications'));

// New Dashboard Pages
const Wishlist = lazy(() => import('./pages/client/Wishlist/Wishlist.tsx'));
const StudyGroups = lazy(() => import('./pages/client/StudyGroups/StudyGroups.tsx'));
const Calendar = lazy(() => import('./pages/client/Calendar/Calendar.tsx'));

// Teacher Pages
const CourseStudio = lazy(() => import('./pages/client/Teacher/CourseStudio/CourseStudio.tsx'));
const Analytics = lazy(() => import('./pages/client/Teacher/Analytics/Analytics.tsx'));
const StudentManagement = lazy(() => import('./pages/client/Teacher/StudentManagement/StudentManagement.tsx'));
const CommunicationCenter = lazy(() => import('./pages/client/Teacher/CommunicationCenter/CommunicationCenter.tsx'));
const CourseReviews = lazy(() => import('./pages/client/Teacher/CourseReviews/CourseReviews.tsx'));
const Earnings = lazy(() => import('./pages/client/Teacher/Earnings/Earnings.tsx'));
const AITools = lazy(() => import('./pages/client/Teacher/AITools/AITools.tsx'));
const CourseEditor = lazy(() => import('./pages/client/Teacher/CourseEditor/CourseEditor.tsx'));
const CourseStructure = lazy(() => import('./pages/client/Teacher/CourseStructure/CourseStructure.tsx'));
const AssignmentsManager = lazy(() => import('./pages/client/Teacher/AssignmentsManager/AssignmentsManager.tsx'));
const SubmissionsGrading = lazy(() => import('./pages/client/Teacher/SubmissionsGrading/SubmissionsGrading.tsx'));
const SearchResults = lazy(() => import('./pages/client/SearchResults/SearchResults.tsx'));
const NotFound = lazy(() => import('./pages/client/NotFound/NotFound.tsx'));

// Additional Client Pages
const Contact = lazy(() => import('./pages/client/Contact/Contact.tsx'));
const About = lazy(() => import('./pages/client/About/About.tsx'));
const InstructorProfile = lazy(() => import('./pages/client/InstructorProfile/InstructorProfile.tsx'));
const CategoryPages = lazy(() => import('./pages/client/CategoryPages/CategoryPages.tsx'));

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const hasBearer = Boolean(localStorage.getItem('accessToken'));
    if (hasBearer) dispatch(getProfile());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <CircularProgress />
              </Box>
            }>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path='/search' element={<SearchResults />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/checkout/:courseId" element={<Checkout />} />
                  <Route path="/assignments/:id" element={<AssignmentWorkspace />} />
                  
                  {/* Additional Client Pages */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/instructor/:id" element={<InstructorProfile />} />
                  <Route path="/category/:slug" element={<CategoryPages />} />
                  
                  {/* Dashboard Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="courses" element={<MyCourses />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="groups" element={<StudyGroups />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="bills" element={<Bills />} />
                    <Route path="refunds" element={<Refunds />} />
                    <Route path="ratings" element={<Ratings />} />
                    <Route path="profile" element={<ProfileDashboard />} />
                    <Route path="notifications" element={<Notifications />} />
                  </Route>
                  
                  {/* Teacher Dashboard Routes */}
                  <Route
                    path="/teacher"
                    element={
                      <ProtectedRoute>
                        <TeacherLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<CourseStudio />} />
                    <Route path="courses" element={<CourseStudio />} />
                    <Route path="courses/new" element={<CourseEditor />} />
                    <Route path="courses/:id/edit" element={<CourseEditor />} />
                    <Route path="courses/:id/structure" element={<CourseStructure />} />
                    <Route path="courses/:id/students" element={<StudentManagement />} />
                    <Route path="courses/:id/reviews" element={<CourseReviews />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="analytics/courses" element={<Analytics />} />
                    <Route path="analytics/students" element={<Analytics />} />
                    <Route path="messages" element={<CommunicationCenter />} />
                    <Route path="lessons/:lessonId/assignments" element={<AssignmentsManager />} />
                    <Route path="assignments/:id/submissions" element={<SubmissionsGrading />} />
                    <Route path="earnings" element={<Earnings />} />
                    <Route path="earnings/transactions" element={<Earnings />} />
                    <Route path="earnings/analytics" element={<Earnings />} />
                    <Route path="ai" element={<AITools />} />
                    <Route path="ai/avatar" element={<AITools />} />
                    <Route path="ai/thumbnail" element={<AITools />} />
                    <Route path="ai/moderation" element={<AITools />} />
                    <Route path="lessons/assignments" element={<AssignmentsManager />} />
                    <Route path="assignments/submissions" element={<SubmissionsGrading />} />
                    <Route path="student-management" element={<StudentManagement />} />
                    <Route path="communication-center" element={<CommunicationCenter />} />
                    <Route path="course-reviews" element={<CourseReviews />} />
                  </Route>
                  
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route
                    path="/learning/:courseId"
                    element={
                      <ProtectedRoute>
                        <Learning />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute roles={[UserRole.Admin]}>
                        <AdminLayoutLazy />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="courses/review" element={<CourseModeration />} />
                    <Route path="courses" element={<CourseDirectory />} />
                    <Route path="refunds" element={<RefundCenter />} />
                    <Route path="bills" element={<BillsPayments />} />
                    <Route path="ai" element={<AIModeration />} />
                    <Route path="reports" element={<AdminAnalytics />} />
                    <Route path="settings" element={<SystemSettings />} />
                    <Route path="permissions" element={<PermissionsManagement />} />
                    <Route path="audit-logs" element={<AuditLogs />} />
                    <Route path="category-management" element={<CategoryManagement />} />
                    <Route path="support-center" element={<SupportCenter />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="performance" element={<PerformanceMonitoring />} />
                    <Route path="backup" element={<BackupRestore />} />
                  </Route>
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </Layout>
            </Suspense>
          </ErrorBoundary>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;