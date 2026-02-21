
import AdminDashboard from '@/features/admin/components/AdminDashboard';

const Admin = () => {
  return (
    <div className="min-h-screen">
      <AdminDashboard initialSection="bookings" />
    </div>
  );
};

export default Admin;

