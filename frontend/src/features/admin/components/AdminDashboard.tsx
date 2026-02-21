
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, AlertCircle, Scissors, Users, LayoutGrid, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AdminBooking,
  Availability,
  Service,
  Staff,
  createAvailability,
  createService,
  createStaff,
  fetchAdminBookings,
  fetchAvailabilityAdmin,
  fetchServicesAdmin,
  fetchStaff,
  verifyAdminBookingPayment,
  updateService,
} from '@/features/booking/api';

interface AdminDashboardProps {
  initialSection?: 'slots' | 'staff' | 'bookings' | 'services';
}

const AdminDashboard = ({ initialSection = 'slots' }: AdminDashboardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? 'http://localhost:8000');
  const existingToken = typeof window !== 'undefined' ? localStorage.getItem('adminBasicAuthToken') : null;
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filter, setFilter] = useState<'all' | AdminBooking['status']>('all');
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(Boolean(existingToken));
  const [authChecking, setAuthChecking] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingActionPublicId, setBookingActionPublicId] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slotCreating, setSlotCreating] = useState(false);
  const [slotsLoadingList, setSlotsLoadingList] = useState(false);
  const [availabilityRows, setAvailabilityRows] = useState<Availability[]>([]);
  const [showCreateSlotForm, setShowCreateSlotForm] = useState(false);
  const [showCreateStaffForm, setShowCreateStaffForm] = useState(false);
  const [showCreateServiceForm, setShowCreateServiceForm] = useState(false);
  const [staffCreating, setStaffCreating] = useState(false);
  const [slotForm, setSlotForm] = useState({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
  });
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [serviceCreating, setServiceCreating] = useState(false);
  const [savingServiceId, setSavingServiceId] = useState<number | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    durationMinutes: '',
    price: '',
    isActive: true,
  });
  const [serviceEdits, setServiceEdits] = useState<Record<number, {
    name: string;
    description: string;
    duration_minutes: string;
    price: string;
    is_active: boolean;
  }>>({});
  const [activeAdminSection, setActiveAdminSection] = useState<'slots' | 'staff' | 'bookings' | 'services'>(initialSection);

  const toDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    setActiveAdminSection(initialSection);
    const sectionId =
      initialSection === 'slots'
        ? 'admin-slots'
        : initialSection === 'staff'
          ? 'admin-staff'
          : initialSection === 'services'
            ? 'admin-services'
            : 'admin-bookings';
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [initialSection]);

  const refreshBookings = async () => {
    setBookingsLoading(true);
    try {
      const bookingData = await fetchAdminBookings();
      setBookings(bookingData);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadAdminData = async () => {
    const [serviceData, staffData, availabilityData, bookingData] = await Promise.all([
      fetchServicesAdmin(),
      fetchStaff(),
      fetchAvailabilityAdmin(),
      fetchAdminBookings(),
    ]);
    setServices(serviceData);
    setStaff(staffData);
    setAvailabilityRows(availabilityData);
    setBookings(bookingData);
  };

  const refreshAvailabilityRows = async () => {
    setSlotsLoadingList(true);
    try {
      const rows = await fetchAvailabilityAdmin();
      setAvailabilityRows(rows);
    } finally {
      setSlotsLoadingList(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem('adminBasicAuthToken');
      if (!token) {
        setIsAdminAuthorized(false);
        return;
      }
      try {
        await loadAdminData();
        setIsAdminAuthorized(true);
      } catch {
        localStorage.removeItem('adminBasicAuthToken');
        setIsAdminAuthorized(false);
      }
    };

    void run();
  }, []);

  useEffect(() => {
    const mapped: Record<number, {
      name: string;
      description: string;
      duration_minutes: string;
      price: string;
      is_active: boolean;
    }> = {};
    for (const service of services) {
      mapped[service.id] = {
        name: service.name,
        description: service.description ?? '',
        duration_minutes: String(service.duration_minutes),
        price: String(service.price),
        is_active: Boolean(service.is_active ?? true),
      };
    }
    setServiceEdits(mapped);
  }, [services]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!slotForm.serviceId || !slotForm.startTime) return;
    const selectedService = services.find((service) => String(service.id) === slotForm.serviceId);
    if (!selectedService) return;

    const start = new Date(slotForm.startTime);
    if (Number.isNaN(start.getTime())) return;

    const computedEnd = new Date(start.getTime() + selectedService.duration_minutes * 60 * 1000);
    const computedEndValue = toDateTimeLocal(computedEnd);
    const currentEnd = slotForm.endTime ? new Date(slotForm.endTime) : null;

    if (!slotForm.endTime || !currentEnd || Number.isNaN(currentEnd.getTime()) || currentEnd <= start) {
      setSlotForm((prev) => ({ ...prev, endTime: computedEndValue }));
    }
  }, [slotForm.serviceId, slotForm.startTime, services]);

  const reviewPaymentProof = async (booking: AdminBooking, approved: boolean) => {
    setBookingActionPublicId(booking.public_id);
    try {
      const adminNote = approved ? '' : window.prompt('Rejection reason (optional):') ?? '';
      await verifyAdminBookingPayment(booking.public_id, {
        approved,
        admin_note: adminNote,
      });
      await refreshBookings();
      toast({
        title: approved ? 'Payment approved' : 'Payment rejected',
        description: `Booking ${booking.public_id} was updated.`,
      });
    } catch (error) {
      toast({
        title: 'Payment review failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setBookingActionPublicId(null);
    }
  };

  const isAwaitingExpired = (booking: AdminBooking) => {
    if (booking.status !== 'awaiting_payment' || !booking.payment_expires_at) return false;
    return new Date(booking.payment_expires_at).getTime() <= nowMs;
  };

  const visibleBookings = useMemo(
    () => bookings.filter((booking) => !isAwaitingExpired(booking)),
    [bookings, nowMs],
  );

  const filteredBookings = visibleBookings.filter((booking) =>
    filter === 'all' || booking.status === filter
  );

  const formatRemaining = (iso: string | null) => {
    if (!iso) return '';
    const diff = new Date(iso).getTime() - nowMs;
    if (diff <= 0) return 'Expired';
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getStatusBadge = (status: AdminBooking['status']) => {
    switch (status) {
      case 'awaiting_payment':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Awaiting Payment</Badge>;
      case 'payment_submitted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Payment Submitted</Badge>;
      case 'confirmed':
        return <Badge className="bg-[#F5C5C5] text-[#BEBEBE] border-[#D2D2D2]">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-[#D2D2D2] text-[#6a6a6a] border-[#BEBEBE]">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: AdminBooking['status']) => {
    switch (status) {
      case 'awaiting_payment':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'payment_submitted':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-[#F1B2B5]" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-[#BEBEBE]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const resolveMediaUrl = (fileUrl: string | null) => {
    if (!fileUrl) return '';
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
    return `${apiBaseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
  };

  const serviceNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const service of services) map.set(service.id, service.name);
    return map;
  }, [services]);

  const availabilityById = useMemo(() => {
    const map = new Map<number, Availability>();
    for (const row of availabilityRows) map.set(row.id, row);
    return map;
  }, [availabilityRows]);

  const stats = {
    total: visibleBookings.length,
    awaiting_payment: visibleBookings.filter(b => b.status === 'awaiting_payment').length,
    payment_submitted: visibleBookings.filter(b => b.status === 'payment_submitted').length,
    confirmed: visibleBookings.filter(b => b.status === 'confirmed').length,
    completed: visibleBookings.filter(b => b.status === 'completed').length,
    cancelled: visibleBookings.filter(b => b.status === 'cancelled').length,
  };

  const createSlot = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!slotForm.serviceId || !slotForm.staffId || !slotForm.startTime || !slotForm.endTime) {
      toast({ title: 'Missing fields', description: 'Complete all slot fields before creating.', variant: 'destructive' });
      return;
    }

    if (new Date(slotForm.endTime) <= new Date(slotForm.startTime)) {
      toast({ title: 'Invalid range', description: 'End time must be after start time.', variant: 'destructive' });
      return;
    }

    setSlotCreating(true);
    try {
      await createAvailability({
        staff: Number(slotForm.staffId),
        service: Number(slotForm.serviceId),
        start_time: slotForm.startTime,
        end_time: slotForm.endTime,
      });
      setSlotForm((prev) => ({ ...prev, startTime: '', endTime: '' }));
      setShowCreateSlotForm(false);
      await refreshAvailabilityRows();
      toast({ title: 'Slot created', description: 'Availability slot saved successfully.' });
    } catch (error) {
      toast({ title: 'Create slot failed', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setSlotCreating(false);
    }
  };

  const addStaffMember = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!staffForm.fullName || !staffForm.email) {
      toast({ title: 'Missing fields', description: 'Staff name and email are required.', variant: 'destructive' });
      return;
    }

    setStaffCreating(true);
    try {
      const created = await createStaff({
        full_name: staffForm.fullName,
        email: staffForm.email,
        phone: staffForm.phone,
        is_active: true,
      });
      setStaff((prev) => [...prev, created].sort((a, b) => a.full_name.localeCompare(b.full_name)));
      setStaffForm({ fullName: '', email: '', phone: '' });
      setShowCreateStaffForm(false);
      toast({ title: 'Staff added', description: `${created.full_name} is now available for slot assignment.` });
    } catch (error) {
      toast({ title: 'Add staff failed', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setStaffCreating(false);
    }
  };

  const createNewService = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!serviceForm.name || !serviceForm.durationMinutes || !serviceForm.price) {
      toast({ title: 'Missing fields', description: 'Name, duration, and price are required.', variant: 'destructive' });
      return;
    }

    setServiceCreating(true);
    try {
      const created = await createService({
        name: serviceForm.name,
        description: serviceForm.description,
        duration_minutes: Number(serviceForm.durationMinutes),
        price: serviceForm.price,
        is_active: serviceForm.isActive,
      });
      setServices((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setServiceForm({
        name: '',
        description: '',
        durationMinutes: '',
        price: '',
        isActive: true,
      });
      setShowCreateServiceForm(false);
      toast({ title: 'Service created', description: `${created.name} was added.` });
    } catch (error) {
      toast({ title: 'Create service failed', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setServiceCreating(false);
    }
  };

  const saveService = async (serviceId: number) => {
    const edit = serviceEdits[serviceId];
    if (!edit) return;
    if (!edit.name || !edit.duration_minutes || !edit.price) {
      toast({ title: 'Missing fields', description: 'Name, duration, and price are required.', variant: 'destructive' });
      return;
    }

    setSavingServiceId(serviceId);
    try {
      const updated = await updateService(serviceId, {
        name: edit.name,
        description: edit.description,
        duration_minutes: Number(edit.duration_minutes),
        price: edit.price,
        is_active: edit.is_active,
      });
      setServices((prev) => prev.map((service) => (service.id === serviceId ? updated : service)));
      setEditingServiceId(null);
      toast({ title: 'Service updated', description: `${updated.name} changes saved.` });
    } catch (error) {
      toast({ title: 'Update failed', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setSavingServiceId(null);
    }
  };

  const submitAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!authForm.username || !authForm.password) {
      toast({ title: 'Missing credentials', description: 'Enter username and password.', variant: 'destructive' });
      return;
    }

    setAuthSubmitting(true);
    try {
      const token = btoa(`${authForm.username}:${authForm.password}`);
      localStorage.setItem('adminBasicAuthToken', token);
      await loadAdminData();
      setIsAdminAuthorized(true);
      setAuthForm({ username: '', password: '' });
      toast({ title: 'Admin login successful', description: 'You now have access to admin actions.' });
    } catch (error) {
      localStorage.removeItem('adminBasicAuthToken');
      setIsAdminAuthorized(false);
      toast({
        title: 'Admin login failed',
        description: (error as Error).message || 'Invalid admin credentials or missing admin role.',
        variant: 'destructive',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminBasicAuthToken');
    setIsAdminAuthorized(false);
    setServices([]);
    setStaff([]);
    toast({ title: 'Logged out', description: 'Admin credentials removed from this browser session.' });
  };

  const adminMenuItems: Array<{
    key: 'slots' | 'staff' | 'services' | 'bookings';
    label: string;
    path: string;
    icon: typeof LayoutGrid;
  }> = [
    { key: 'slots', label: 'Slot Setup', path: '/admin/slots', icon: LayoutGrid },
    { key: 'staff', label: 'Staff', path: '/admin/staff', icon: Users },
    { key: 'services', label: 'Services', path: '/admin/services', icon: Scissors },
    { key: 'bookings', label: 'Bookings', path: '/admin/bookings', icon: Calendar },
  ];

  const sectionHeading = {
    slots: { title: 'Slot Setup', subtitle: 'Create and manage available schedules for booking.' },
    staff: { title: 'Staff', subtitle: 'Manage team members available for appointment slots.' },
    services: { title: 'Services', subtitle: 'Create, edit, and activate services used in booking.' },
    bookings: { title: 'Bookings', subtitle: 'Track and manage all booking requests and statuses.' },
  }[activeAdminSection];

  const navigateSection = (section: 'slots' | 'staff' | 'services' | 'bookings') => {
    setActiveAdminSection(section);
    const target = adminMenuItems.find((item) => item.key === section);
    if (target) {
      navigate(target.path);
    }
  };

  if (authChecking) {
    return (
      <section id="admin" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="spa-card max-w-md mx-auto">
            <CardContent className="py-10 text-center text-gray-600">Checking admin session...</CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!isAdminAuthorized) {
    return (
      <section id="admin" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="spa-card max-w-lg mx-auto border-[#F5C5C5]">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Admin Login</CardTitle>
              <CardDescription>Sign in with an account that has the `admin` role.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={authForm.username}
                    onChange={(event) => setAuthForm((prev) => ({ ...prev, username: event.target.value }))}
                    placeholder="admin username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={authForm.password}
                    onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="admin password"
                  />
                </div>
                <Button type="submit" className="spa-button w-full" disabled={authSubmitting}>
                  {authSubmitting ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-[#F5C5C5] lg:bg-white">
          <div className="h-[86px] border-b border-[#F5C5C5] px-5 flex flex-col justify-center">
            <p className="text-2xl font-semibold leading-none text-[#8c5f6f]">Doce-Amore</p>
            <p className="text-sm text-[#a67f8e] mt-2">Admin Panel</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const active = activeAdminSection === item.key;
              return (
                <Button
                  key={item.key}
                  type="button"
                  variant="ghost"
                  onClick={() => navigateSection(item.key)}
                  className={`w-full justify-start gap-2 rounded-lg ${
                    active ? 'bg-[#F1B2B5] text-white hover:bg-[#e8a0a5]' : 'text-[#7a5967] hover:bg-[#fde7ea]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[#F5C5C5]">
            <Button type="button" variant="ghost" onClick={logoutAdmin} className="w-full justify-start gap-2 text-[#7a5967] hover:bg-[#fde7ea]">
              <LogOut className="h-4 w-4" />
              Logout Admin
            </Button>
          </div>
        </aside>

        <div className="flex-1 lg:ml-64">
          <div className="sticky top-0 z-20 h-[86px] border-b border-[#F5C5C5] bg-white/90 backdrop-blur">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-[#7a5967]">{sectionHeading.title}</p>
                <p className="text-sm text-[#9a7b88]">{sectionHeading.subtitle}</p>
              </div>
              <div />
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
            <div className="lg:hidden mb-4 space-y-3 rounded-xl border border-[#F5C5C5] bg-white p-3">
              <div className="flex flex-wrap gap-2">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeAdminSection === item.key;
                  return (
                    <Button
                      key={item.key}
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateSection(item.key)}
                      className={`gap-1.5 ${active ? 'bg-[#F1B2B5] text-white hover:bg-[#e8a0a5]' : 'text-[#7a5967] hover:bg-[#fde7ea]'}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              <Button type="button" variant="outline" onClick={logoutAdmin} className="w-full border-[#F5C5C5] text-[#7a5967] hover:bg-[#FFF7F8]">
                Logout Admin
              </Button>
            </div>

            <div>

        {activeAdminSection === 'slots' ? (
        <Card id="admin-slots" className="spa-card mb-8 border-[#F5C5C5]">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl text-gray-800">Availability Slots</CardTitle>
              <CardDescription>
                Slots created here appear in Book Now when service/date matches and slot is still available.
              </CardDescription>
            </div>
            <Button
              type="button"
              className="spa-button"
              onClick={() => setShowCreateSlotForm(true)}
            >
              Create Slot
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-lg border border-[#F5C5C5]">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-[#FFF7F8] text-[#7a5967]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Service</th>
                    <th className="px-4 py-3 text-left font-medium">Staff</th>
                    <th className="px-4 py-3 text-left font-medium">Start</th>
                    <th className="px-4 py-3 text-left font-medium">End</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilityRows
                    .slice()
                    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
                    .map((slot) => (
                      <tr key={slot.id} className="border-t border-[#F3DDE0]">
                        <td className="px-4 py-3 text-[#5f4e55]">
                          {services.find((service) => service.id === slot.service)?.name ?? `Service #${slot.service}`}
                        </td>
                        <td className="px-4 py-3 text-[#5f4e55]">
                          {staff.find((member) => member.id === slot.staff)?.full_name ?? `Staff #${slot.staff}`}
                        </td>
                        <td className="px-4 py-3 text-[#5f4e55]">{new Date(slot.start_time).toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#5f4e55]">{new Date(slot.end_time).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Badge className={slot.is_booked ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-green-100 text-green-700 border-green-200'}>
                            {slot.is_booked ? 'Booked' : 'Open'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {slotsLoadingList ? <p className="px-4 py-3 text-sm text-[#8a8a8a]">Loading slots...</p> : null}
              {!slotsLoadingList && availabilityRows.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[#8a8a8a]">No slots available yet.</p>
              ) : null}
            </div>

            <Dialog open={showCreateSlotForm} onOpenChange={setShowCreateSlotForm}>
              <DialogContent className="max-w-3xl border-[#F5C5C5]">
                <DialogHeader>
                  <DialogTitle className="text-[#7a5967]">Create Slot</DialogTitle>
                  <DialogDescription>
                    Add a new availability slot for selected service and staff.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createSlot} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Select value={slotForm.serviceId} onValueChange={(value) => setSlotForm((prev) => ({ ...prev, serviceId: value }))}>
                        <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={String(service.id)}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Staff</Label>
                      {staff.some((member) => member.is_active) ? (
                        <Select value={slotForm.staffId} onValueChange={(value) => setSlotForm((prev) => ({ ...prev, staffId: value }))}>
                          <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                          <SelectContent>
                            {staff.filter((member) => member.is_active).map((member) => (
                              <SelectItem key={member.id} value={String(member.id)}>
                                {member.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type="number"
                          value={slotForm.staffId}
                          onChange={(event) => setSlotForm((prev) => ({ ...prev, staffId: event.target.value }))}
                          placeholder="Enter staff ID"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="datetime-local"
                        value={slotForm.startTime}
                        onChange={(event) => setSlotForm((prev) => ({ ...prev, startTime: event.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="datetime-local"
                        value={slotForm.endTime}
                        onChange={(event) => setSlotForm((prev) => ({ ...prev, endTime: event.target.value }))}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#8a8a8a]">
                    End time is auto-filled based on selected service duration. You can still adjust it.
                  </p>

                  <Button type="submit" className="spa-button w-full md:w-auto" disabled={slotCreating}>
                    {slotCreating ? 'Creating slot...' : 'Create Slot'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        ) : null}

        {activeAdminSection === 'staff' ? (
        <Card id="admin-staff" className="spa-card mb-8 border-[#D2D2D2]">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl text-gray-800">Staff</CardTitle>
              <CardDescription>
                Manage staff members used for booking and slot assignment.
              </CardDescription>
            </div>
            <Button type="button" className="spa-button" onClick={() => setShowCreateStaffForm(true)}>
              Add Staff
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-[#F5C5C5]">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-[#FFF7F8] text-[#7a5967]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staff
                    .slice()
                    .sort((a, b) => a.full_name.localeCompare(b.full_name))
                    .map((member) => (
                      <tr key={member.id} className="border-t border-[#F3DDE0]">
                        <td className="px-4 py-3 text-[#5f4e55]">{member.full_name}</td>
                        <td className="px-4 py-3 text-[#5f4e55]">{member.email}</td>
                        <td className="px-4 py-3 text-[#5f4e55]">{member.phone || '-'}</td>
                        <td className="px-4 py-3">
                          <Badge className={member.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {staff.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[#8a8a8a]">No staff available yet.</p>
              ) : null}
            </div>

            <Dialog open={showCreateStaffForm} onOpenChange={setShowCreateStaffForm}>
              <DialogContent className="max-w-2xl border-[#F5C5C5]">
                <DialogHeader>
                  <DialogTitle className="text-[#7a5967]">Add Staff</DialogTitle>
                  <DialogDescription>
                    Create staff members before assigning availability slots.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addStaffMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={staffForm.fullName}
                        onChange={(event) => setStaffForm((prev) => ({ ...prev, fullName: event.target.value }))}
                        placeholder="Staff full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={staffForm.email}
                        onChange={(event) => setStaffForm((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="staff@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={staffForm.phone}
                        onChange={(event) => setStaffForm((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="Optional phone"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="spa-button w-full md:w-auto" disabled={staffCreating}>
                    {staffCreating ? 'Adding staff...' : 'Add Staff'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        ) : null}

        {activeAdminSection === 'services' ? (
        <Card id="admin-services" className="spa-card mb-8 border-[#F5C5C5]">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl text-gray-800">Manage Services</CardTitle>
              <CardDescription>
                Create, edit, and activate/deactivate services used in booking.
              </CardDescription>
            </div>
            <Button type="button" className="spa-button" onClick={() => setShowCreateServiceForm(true)}>
              Create Service
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-lg border border-[#F5C5C5]">
              <table className="w-full min-w-[1000px] text-sm">
                <thead className="bg-[#FFF7F8] text-[#7a5967]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Duration</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
              {services.length === 0 ? (
                <tr className="border-t border-[#F3DDE0]">
                  <td className="px-4 py-3 text-sm text-[#8a8a8a]" colSpan={6}>No services available.</td>
                </tr>
              ) : (
                services.map((service) => {
                  const edit = serviceEdits[service.id];
                  if (!edit) return null;
                  const isEditing = editingServiceId === service.id;
                  return (
                    <tr key={service.id} className="border-t border-[#F3DDE0] align-top">
                      <td className="px-4 py-3">
                        <Input
                          value={edit.name}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setServiceEdits((prev) => ({
                              ...prev,
                              [service.id]: { ...prev[service.id], name: e.target.value },
                            }))
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={1}
                          value={edit.duration_minutes}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setServiceEdits((prev) => ({
                              ...prev,
                              [service.id]: { ...prev[service.id], duration_minutes: e.target.value },
                            }))
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={edit.price}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setServiceEdits((prev) => ({
                              ...prev,
                              [service.id]: { ...prev[service.id], price: e.target.value },
                            }))
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <Select
                            value={edit.is_active ? 'active' : 'inactive'}
                            onValueChange={(value) =>
                              setServiceEdits((prev) => ({
                                ...prev,
                                [service.id]: { ...prev[service.id], is_active: value === 'active' },
                              }))
                            }
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={edit.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                            {edit.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Textarea
                          value={edit.description}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setServiceEdits((prev) => ({
                              ...prev,
                              [service.id]: { ...prev[service.id], description: e.target.value },
                            }))
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditingServiceId(null)}
                            className="border-[#D2D2D2] text-[#6a6a6a] hover:bg-[#EBECF0]"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="spa-button"
                            onClick={() => saveService(service.id)}
                            disabled={savingServiceId === service.id}
                          >
                            {savingServiceId === service.id ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditingServiceId(service.id)}
                            className="border-[#D2D2D2] text-[#6a6a6a] hover:bg-[#EBECF0]"
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
                </tbody>
              </table>
            </div>

            <Dialog open={showCreateServiceForm} onOpenChange={setShowCreateServiceForm}>
              <DialogContent className="max-w-3xl border-[#F5C5C5]">
                <DialogHeader>
                  <DialogTitle className="text-[#7a5967]">Create Service</DialogTitle>
                  <DialogDescription>
                    Add a new service that can be used in booking.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createNewService} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={serviceForm.name} onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input type="number" min={1} value={serviceForm.durationMinutes} onChange={(e) => setServiceForm((prev) => ({ ...prev, durationMinutes: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input value={serviceForm.price} onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="e.g. 450.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={serviceForm.isActive ? 'active' : 'inactive'}
                        onValueChange={(value) => setServiceForm((prev) => ({ ...prev, isActive: value === 'active' }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={serviceForm.description} onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </div>
                  <Button type="submit" className="spa-button w-full md:w-auto" disabled={serviceCreating}>
                    {serviceCreating ? 'Creating service...' : 'Create Service'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        ) : null}

        {activeAdminSection === 'bookings' ? (
        <>
        {/* Statistics Cards */}
        <div id="admin-bookings" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="spa-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-[#F1B2B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="spa-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Payment</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.awaiting_payment}</div>
            </CardContent>
          </Card>

          <Card className="spa-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">For Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.payment_submitted}</div>
            </CardContent>
          </Card>

          <Card className="spa-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-[#BEBEBE]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#BEBEBE]">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {([
            { value: 'all', label: 'All' },
            { value: 'awaiting_payment', label: 'Awaiting Payment' },
            { value: 'payment_submitted', label: 'For Review' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ] as const).map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? "default" : "outline"}
              onClick={() => setFilter(value)}
              className={filter === value ? "spa-button" : "border-[#D2D2D2] text-[#BEBEBE] hover:bg-[#EBECF0]"}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookingsLoading ? (
            <Card className="spa-card">
              <CardContent className="text-center py-12 text-gray-600">
                Loading bookings...
              </CardContent>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card className="spa-card">
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter.replace('_', ' ')} bookings found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const slot = availabilityById.get(booking.availability);
              const serviceName = serviceNameById.get(booking.service) ?? `Service #${booking.service}`;
              const proofUrl = resolveMediaUrl(booking.payment_proof_file);

              return (
                <Card key={booking.id} className="spa-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(booking.status)}
                        <div>
                          <CardTitle className="text-lg">{booking.customer_name}</CardTitle>
                          <CardDescription>
                            Ref: {booking.public_id}
                            <br />
                            Booked on {new Date(booking.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-[#F1B2B5]" />
                          <span>{booking.customer_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-[#F1B2B5]" />
                          <span>{booking.customer_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#F1B2B5]" />
                          <span>{slot ? new Date(slot.start_time).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[#F1B2B5]" />
                          <span>
                            {slot
                              ? `${new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                              : '-'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Service</h4>
                          <p className="text-sm text-gray-600">{serviceName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Method</h4>
                          <p className="text-sm text-gray-600">{booking.payment_method ? booking.payment_method.toUpperCase() : 'Not yet submitted'}</p>
                        </div>
                        {booking.status === 'awaiting_payment' && booking.payment_expires_at ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Awaiting Payment Until</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.payment_expires_at).toLocaleString()} ({formatRemaining(booking.payment_expires_at)})
                            </p>
                          </div>
                        ) : null}
                        {booking.payment_reference ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Reference</h4>
                            <p className="text-sm text-gray-600">{booking.payment_reference}</p>
                          </div>
                        ) : null}
                        {proofUrl ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Proof</h4>
                            <a
                              href={proofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-[#7a5967] underline underline-offset-2"
                            >
                              View uploaded proof
                            </a>
                          </div>
                        ) : null}
                        {booking.payment_notes ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Notes</h4>
                            <p className="text-sm text-gray-600">{booking.payment_notes}</p>
                          </div>
                        ) : null}
                        {booking.payment_rejection_reason ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Rejection Reason</h4>
                            <p className="text-sm text-gray-600">{booking.payment_rejection_reason}</p>
                          </div>
                        ) : null}
                        {booking.cancel_reason ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Cancel Reason</h4>
                            <p className="text-sm text-gray-600">{booking.cancel_reason}</p>
                          </div>
                        ) : null}
                        {booking.notes ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Booking Notes</h4>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {booking.status === 'payment_submitted' ? (
                      <div className="flex gap-3 mt-6 pt-4 border-t">
                        <Button
                          onClick={() => reviewPaymentProof(booking, true)}
                          className="spa-button flex-1"
                          disabled={bookingActionPublicId === booking.public_id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {bookingActionPublicId === booking.public_id ? 'Updating...' : 'Approve Payment'}
                        </Button>
                        <Button
                          onClick={() => reviewPaymentProof(booking, false)}
                          variant="outline"
                          className="flex-1 border-[#D2D2D2] text-[#6a6a6a] hover:bg-[#EBECF0]"
                          disabled={bookingActionPublicId === booking.public_id}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {bookingActionPublicId === booking.public_id ? 'Updating...' : 'Reject Payment'}
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        </>
        ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;


