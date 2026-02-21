import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminBookingsPage = () => {
  return (
    <div className="min-h-screen">
      <AdminDashboard initialSection="bookings" />
    </div>
  );
};

export default AdminBookingsPage;
