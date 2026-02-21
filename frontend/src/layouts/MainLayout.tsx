
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  return (
    <div className="min-h-screen bg-white">
      {!isAdminRoute ? <Header /> : null}
      <main className="bg-white">
        <Outlet />
      </main>
      {!isAdminRoute ? <Footer /> : null}
    </div>
  );
};

export default Layout;

