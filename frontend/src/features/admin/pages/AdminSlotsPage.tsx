import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminSlotsPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <AdminDashboard initialSection="slots" />
    </div>
  );
};

export default AdminSlotsPage;
