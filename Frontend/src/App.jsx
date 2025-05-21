import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/admin/Admin';
import AdminSignupForm from './components/forms/AdminSignupForm';
import AgentSignUpForm from './components/forms/AgentSignUpForm';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AgentCard from './pages/agents/AgentCard';
import Property from './pages/properties/Property';
import SingleProperty from './pages/properties/SingleProperty';
import SingleAdmin from './pages/admin/SingleAdmin';
import SingleAgent from './pages/agents/SingleAgent';
import EditAdmin from './pages/admin/EditAdmin'
import Dashboard from './pages/dashboard/Dashboard';
import Blog from './pages/blog/Blog';
import SingleBlog from './pages/blog/SingleBlog';
import EditAgent from './pages/agents/EditAgent';
import Contact from './pages/contact/Contact';
import SingleContact from './pages/contact/SingleContact';
 
function LayoutWrapper() {
  const location = useLocation();
 
  const hideSidebar =
    ['/', '/admin-login', '/forgot-password'].includes(location.pathname) ||
    matchPath('/admin-reset/:token', location.pathname);
 
  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar />}
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
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
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
              path="/admin-reset/:token"
              element={
                <PublicRoute>
                  <ResetPassword />
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
              path="/admin/:id"
              element={
                <ProtectedRoute>
                  <SingleAdmin />
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
            <Route
              path="admin/edit/:id"
              element={
                <ProtectedRoute>
                  <EditAdmin/>
                </ProtectedRoute>
              }
            />
            <Route
              path="agent/edit/:id"
              element={
                <ProtectedRoute>
                  <EditAgent/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <AgentCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/create"
              element={
                <ProtectedRoute>
                  <AgentSignUpForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <Property />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <ProtectedRoute>
                  <SingleProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/:id"
              element={
                <ProtectedRoute>
                  <SingleAdmin />
                </ProtectedRoute>
              }
            />
             <Route
              path="/agent/:id"
              element={
                <ProtectedRoute>
                  <SingleAgent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <Blog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <ProtectedRoute>
                  <SingleBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/:id"
              element={
                <ProtectedRoute>
                  <SingleContact/>
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