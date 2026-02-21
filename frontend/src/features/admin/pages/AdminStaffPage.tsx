import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminStaffPage = () => {
  return (
    <div className="min-h-screen">
      <AdminDashboard initialSection="staff" />
    </div>
  );
};

export default AdminStaffPage;
