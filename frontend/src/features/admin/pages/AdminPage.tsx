
import AdminDashboard from '@/features/admin/components/AdminDashboard';
import { BOOKING_ENABLED } from '@/config/features';

const Admin = () => {
  return (
    <div className="min-h-screen">
      <AdminDashboard initialSection={BOOKING_ENABLED ? 'bookings' : 'services'} />
    </div>
  );
};

export default Admin;

