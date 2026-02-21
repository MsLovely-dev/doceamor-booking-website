import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminBookingsPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <AdminDashboard initialSection="bookings" />
    </div>
  );
};

export default AdminBookingsPage;
