import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Volunteer from './pages/Volunteer';
import Donate from './pages/Donate';
import DonateSuccess from './pages/DonateSuccess';
import Events from './pages/Events';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Shop from './pages/Shop';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/success" element={<DonateSuccess />} />
        <Route path="/events" element={<Events />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}
