import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { store } from './store';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/Layout/client/Layout';

// Pages
import Home from './pages/client/Home/Home';
import Login from './pages/client/Login/Login';
import Register from './pages/client/Register/Register';
import Courses from './pages/client/Courses/Coures';
import CourseDetail from './pages/client/CourseDetail/CourseDetail';
import Learning from './pages/client/Learning/Learning';
import Dashboard from './pages/client/Dashboard/Dashboard';
import Profile from './pages/client/Profile/Profile';
import Admin from './pages/admin/Admin/Admin';

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
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                    <ProtectedRoute roles={['admin']}>
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