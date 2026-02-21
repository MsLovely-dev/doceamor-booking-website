import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminStaffPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <AdminDashboard initialSection="staff" />
    </div>
  );
};

export default AdminStaffPage;
