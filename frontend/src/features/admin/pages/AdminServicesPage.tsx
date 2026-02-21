import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminServicesPage = () => {
  return (
    <div className="min-h-screen">
      <AdminDashboard initialSection="services" />
    </div>
  );
};

export default AdminServicesPage;
