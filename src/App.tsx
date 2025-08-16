import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Styles
import '@/styles/auth.css';

import { store } from '@/store/index.ts';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import Layout from './components/Layout/client/Layout.tsx';
import DashboardLayout from './components/Layout/client/DashboardLayout.tsx';
import TeacherLayout from './components/Layout/client/TeacherLayout.tsx';
import ScrollToTop from './components/common/ScrollToTop.tsx';

// Pages
import Home from './pages/client/Home/Home.tsx';
import Login from './pages/client/Login/Login.tsx';
import Register from './pages/client/Register/Register.tsx';
import CourseDetail from './pages/client/CourseDetail/CourseDetail.tsx';
import Learning from './pages/client/Learning/Learning.tsx';
import { UserRole } from './components/common/ProtectedRoute.tsx';
import Dashboard from './pages/client/Dashboard/Dashboard.tsx';
import Profile from './pages/client/Profile/Profile.tsx';
import Admin from './pages/admin/Admin/Admin.tsx';
import Courses from './pages/client/Courses/Coures.tsx';
import ForgotPassword from './pages/client/ForgotPassword/ForgotPassword.tsx';
import Checkout from './pages/client/Checkout/Checkout.tsx';
import LearningPlayer from './pages/client/LearningPlayer/LearningPlayer.tsx';
import AssignmentWorkspace from './pages/client/AssignmentWorkspace/AssignmentWorkspace.tsx';
import MyCourses from './pages/client/Dashboard/Courses';
import Progress from './pages/client/Dashboard/Progress/Progress';
import Bills from './pages/client/Dashboard/Bills/Bills';
import Refunds from './pages/client/Dashboard/Refunds/Refunds';
import Ratings from './pages/client/Dashboard/Ratings/Ratings';
import ProfileDashboard from './pages/client/Dashboard/Profile/Profile';
import Notifications from './pages/client/Dashboard/Notifications/Notifications';

// New Dashboard Pages
import Wishlist from './pages/client/Wishlist/Wishlist.tsx';
import StudyGroups from './pages/client/StudyGroups/StudyGroups.tsx';
import Calendar from './pages/client/Calendar/Calendar.tsx';

// Teacher Pages
import CourseStudio from './pages/client/Teacher/CourseStudio/CourseStudio.tsx';
import Analytics from './pages/client/Teacher/Analytics/Analytics.tsx';
import StudentManagement from './pages/client/Teacher/StudentManagement/StudentManagement.tsx';
import CommunicationCenter from './pages/client/Teacher/CommunicationCenter/CommunicationCenter.tsx';
import CourseReviews from './pages/client/Teacher/CourseReviews/CourseReviews.tsx';
import Earnings from './pages/client/Teacher/Earnings/Earnings.tsx';
import AITools from './pages/client/Teacher/AITools/AITools.tsx';
import CourseEditor from './pages/client/Teacher/CourseEditor/CourseEditor.tsx';
import CourseStructure from './pages/client/Teacher/CourseStructure/CourseStructure.tsx';
import AssignmentsManager from './pages/client/Teacher/AssignmentsManager/AssignmentsManager.tsx';
import SubmissionsGrading from './pages/client/Teacher/SubmissionsGrading/SubmissionsGrading.tsx';
import SearchResults from './pages/client/SearchResults/SearchResults.tsx';
import NotFound from './pages/client/NotFound/NotFound.tsx';

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

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/search' element={<SearchResults />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/checkout/:courseId" element={<Checkout />} />
                <Route path="/learning/:courseId" element={<LearningPlayer />} />
                <Route path="/assignments/:id" element={<AssignmentWorkspace />} />
                
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
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={[UserRole.Admin]}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;