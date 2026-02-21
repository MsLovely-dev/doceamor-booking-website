
import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

