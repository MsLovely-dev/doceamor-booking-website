
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/layouts/MainLayout";
import Home from "@/features/home/pages/HomePage";
import ServicesPage from "@/features/services/pages/ServicesPage";
import BookNow from "@/features/booking/pages/BookNowPage";
import ContactPage from "@/features/contact/pages/ContactPage";
import Admin from "@/features/admin/pages/AdminPage";
import AdminSlotsPage from "@/features/admin/pages/AdminSlotsPage";
import AdminStaffPage from "@/features/admin/pages/AdminStaffPage";
import AdminBookingsPage from "@/features/admin/pages/AdminBookingsPage";
import AdminServicesPage from "@/features/admin/pages/AdminServicesPage";
import NotFound from "@/app/NotFoundPage";
import { BOOKING_ENABLED } from "@/config/features";

const queryClient = new QueryClient();
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBase}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<ServicesPage />} />
            <Route
              path="book-now"
              element={BOOKING_ENABLED ? <BookNow /> : <Navigate to="/services" replace />}
            />
            <Route path="contact" element={<ContactPage />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin/slots" element={<AdminSlotsPage />} />
            <Route path="admin/staff" element={<AdminStaffPage />} />
            <Route path="admin/services" element={<AdminServicesPage />} />
            <Route
              path="admin/bookings"
              element={BOOKING_ENABLED ? <AdminBookingsPage /> : <Navigate to="/admin/services" replace />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

