import AdminDashboard from '@/features/admin/components/AdminDashboard';

const AdminServicesPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <AdminDashboard initialSection="services" />
    </div>
  );
};

export default AdminServicesPage;
