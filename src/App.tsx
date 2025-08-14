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
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/checkout/:courseId" element={<Checkout />} />
                <Route path="/learning/:courseId" element={<LearningPlayer />} />
                <Route path="/assignments/:id" element={<AssignmentWorkspace />} />
                <Route path="/dashboard/courses" element={<MyCourses />} />
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
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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