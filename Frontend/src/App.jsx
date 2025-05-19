import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/admin/Admin';
import AdminSignupForm from './components/forms/AdminSignupForm';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute'; // import the new component
import PublicRoute from './components/PublicRoute';

function LayoutWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname === '/' || location.pathname === '/admin-login';

  return (
    <div className="flex min-h-screen">
      {!hideLayout && <Sidebar />}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-grow p-8 overflow-auto">
          <Routes>

            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/admin-login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create"
              element={
                <ProtectedRoute>
                  <AdminSignupForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}
