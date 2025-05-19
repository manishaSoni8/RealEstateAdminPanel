import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/admin/Admin';
import AdminSignupForm from './components/forms/AdminSignupForm';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
 
function LayoutWrapper() {
  const location = useLocation();
 
  // Hide layout for login, forgot, and reset pages
  const hideLayout =
    location.pathname === '/' ||
    location.pathname === '/admin-login' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/admin-reset/:token' ||  location.pathname === 'http://localhost:5174/admin-reset/${token}';
 
  return (
    <div className="flex min-h-screen">
      {!hideLayout && <Sidebar />}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-grow p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-reset/:token" element={<ResetPassword />} />
            <Route path="/admin-reset/${token}" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/create" element={<AdminSignupForm />} />
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
