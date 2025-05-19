import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/admin/Admin';
import AdminSignupForm from './components/forms/AdminSignupForm';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-8 overflow-auto">
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/create" element={<AdminSignupForm />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  )
}