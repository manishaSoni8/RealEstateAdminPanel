import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/admin/Admin';
import AdminSignupForm from './components/forms/AdminSignupForm';
import Login from './pages/admin/Login';

 
function LayoutWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname === '/' || location.pathname === '/admin-login';
 
  return (
    <div className="flex h-screen">
      {!hideLayout && <Sidebar />}
      <div className="flex flex-col flex-1">
        {<Header />}
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/create" element={<AdminSignupForm />} />
          </Routes>
        </main>
        { <Footer />}
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