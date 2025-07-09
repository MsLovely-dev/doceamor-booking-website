
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import BookingForm from '@/components/BookingForm';
import Contact from '@/components/Contact';
import AdminDashboard from '@/components/AdminDashboard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <BookingForm />
      <Contact />
      <AdminDashboard />
      <Footer />
    </div>
  );
};

export default Index;
