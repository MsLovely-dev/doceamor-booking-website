import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { SERVICE_CATALOG } from "@/features/services/data/catalog";
import {
  Availability,
  createBooking,
  fetchAvailabilityByServiceAndDate,
  fetchServices,
  submitPaymentProof,
  trackBookingStatus,
} from "@/features/booking/api";

interface ServiceOption {
  id: number;
  name: string;
  duration_minutes: number;
  price: string;
}

interface SelectServiceOption {
  key: string;
  label: string;
  value: string;
}

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const tokenize = (value: string) => normalizeName(value).split(" ").filter(Boolean);

const BookingForm = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [tracking, setTracking] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    availabilityId: "",
    notes: "",
  });

  const [bookingSession, setBookingSession] = useState<{
    publicId: string;
    guestToken: string;
    paymentExpiresAt: string;
  } | null>(null);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "gcash" as "gcash" | "bdo",
    paymentReference: "",
    paymentNotes: "",
    paymentProofFile: null as File | null,
  });
  const [trackingData, setTrackingData] = useState({
    publicId: "",
    email: "",
    guestToken: "",
  });
  const [trackingResult, setTrackingResult] = useState<string>("");
  const [servicePrefillApplied, setServicePrefillApplied] = useState(false);

  const catalogServiceMeta = useMemo(() => {
    const map = new Map<string, { category: string; group: string; order: number }>();
    let order = 0;

    for (const section of SERVICE_CATALOG) {
      for (const group of section.groups) {
        for (const row of group.rows) {
          const normalized = normalizeName(row.Service);
          if (!map.has(normalized)) {
            map.set(normalized, {
              category: section.title,
              group: group.title,
              order: order++,
            });
          }
        }
      }
    }

    return map;
  }, []);

  const sortedServices = useMemo(() => {
    const withOrder = services.map((service) => {
      const normalized = normalizeName(service.name);
      const exactMeta = catalogServiceMeta.get(normalized);

      if (exactMeta) {
        return { service, order: exactMeta.order };
      }

      const partialMeta = Array.from(catalogServiceMeta.entries()).find(
        ([catalogName]) => catalogName.includes(normalized) || normalized.includes(catalogName)
      )?.[1];

      return { service, order: partialMeta?.order ?? Number.MAX_SAFE_INTEGER };
    });

    return withOrder
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.service.name.localeCompare(b.service.name);
      })
      .map((item) => item.service);
  }, [catalogServiceMeta, services]);

  const serviceOptions = useMemo<SelectServiceOption[]>(() => {
    return sortedServices.map<SelectServiceOption>((service) => ({
      key: `backend-${service.id}`,
      label: `${service.name} - ${service.duration_minutes} min - PHP ${service.price}`,
      value: String(service.id),
    }));
  }, [sortedServices]);

  const findBestServiceMatch = (requestedService: string, options: ServiceOption[]) => {
    const normalizedRequested = normalizeName(requestedService);
    const requestedTokens = tokenize(requestedService);

    const exact = options.find((service) => normalizeName(service.name) === normalizedRequested);
    if (exact) return exact;

    const partial = options.find((service) => {
      const normalizedService = normalizeName(service.name);
      return normalizedService.includes(normalizedRequested) || normalizedRequested.includes(normalizedService);
    });
    if (partial) return partial;

    let best: { service: ServiceOption; score: number } | null = null;
    for (const service of options) {
      const serviceTokens = tokenize(service.name);
      const overlap = requestedTokens.filter((token) => serviceTokens.includes(token)).length;
      const score = overlap / Math.max(requestedTokens.length, serviceTokens.length, 1);
      if (!best || score > best.score) {
        best = { service, score };
      }
    }

    if (best && best.score >= 0.5) {
      return best.service;
    }

    return null;
  };

  useEffect(() => {
    const run = async () => {
      setServicesLoading(true);
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        toast({ title: "Service load failed", description: (error as Error).message, variant: "destructive" });
      } finally {
        setServicesLoading(false);
      }
    };
    void run();
  }, [toast]);

  useEffect(() => {
    if (servicePrefillApplied || services.length === 0) return;

    const requestedService = searchParams.get("service");
    if (!requestedService) {
      setServicePrefillApplied(true);
      return;
    }

    const matchedService = findBestServiceMatch(requestedService, services);

    if (matchedService) {
      setFormData((prev) => ({
        ...prev,
        serviceId: String(matchedService.id),
        availabilityId: "",
      }));
      toast({
        title: "Service selected",
        description: `${matchedService.name} is preselected from Services Catalog.`,
      });
    } else {
      toast({
        title: "Service not found",
        description: "Selected service from catalog is not yet configured for booking.",
        variant: "destructive",
      });
    }

    setServicePrefillApplied(true);
  }, [searchParams, servicePrefillApplied, services, toast]);

  useEffect(() => {
    if (!formData.serviceId) return;

    const exists = services.some((service) => String(service.id) === formData.serviceId);
    if (!exists) {
      setFormData((prev) => ({ ...prev, serviceId: "", availabilityId: "" }));
    }
  }, [formData.serviceId, services]);

  const selectedServiceIsBookable = useMemo(
    () => services.some((service) => String(service.id) === formData.serviceId),
    [formData.serviceId, services],
  );

  useEffect(() => {
    const run = async () => {
      if (!formData.serviceId || !selectedServiceIsBookable || !formData.date) {
        setAvailability([]);
        setFormData((prev) => ({ ...prev, availabilityId: "" }));
        return;
      }
      setSlotsLoading(true);
      try {
        const data = await fetchAvailabilityByServiceAndDate(Number(formData.serviceId), formData.date);
        setAvailability(data);
      } catch (error) {
        toast({ title: "Slot load failed", description: (error as Error).message, variant: "destructive" });
      } finally {
        setSlotsLoading(false);
      }
    };
    void run();
  }, [formData.serviceId, formData.date, selectedServiceIsBookable, toast]);

  const selectedAvailability = useMemo(
    () => availability.find((slot) => String(slot.id) === formData.availabilityId),
    [availability, formData.availabilityId],
  );

  const availabilityOptions = useMemo(() => {
    const sorted = [...availability].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    return sorted.map((slot) => ({
      id: String(slot.id),
      label: `${new Date(slot.start_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(slot.end_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    }));
  }, [availability]);

  const slotPlaceholder = useMemo(() => {
    if (!formData.serviceId) return "Select service first";
    if (!selectedServiceIsBookable) return "Service not available for booking";
    if (!formData.date) return "Select date first";
    if (slotsLoading) return "Loading slots...";
    if (availability.length === 0) return "No slots available";
    return "Select slot";
  }, [availability.length, formData.date, formData.serviceId, selectedServiceIsBookable, slotsLoading]);

  useEffect(() => {
    if (!formData.availabilityId) return;
    const exists = availability.some((slot) => String(slot.id) === formData.availabilityId);
    if (!exists) {
      setFormData((prev) => ({ ...prev, availabilityId: "" }));
    }
  }, [availability, formData.availabilityId]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "serviceId" || field === "date") {
      setFormData((prev) => ({ ...prev, availabilityId: "" }));
    }
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAvailability) return;

    setSubmitting(true);
    try {
      const response = await createBooking({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        notes: formData.notes,
        service: Number(formData.serviceId),
        staff: selectedAvailability.staff,
        availability: selectedAvailability.id,
      });
      setBookingSession({
        publicId: response.public_id,
        guestToken: response.guest_token,
        paymentExpiresAt: response.payment_expires_at,
      });
      setTrackingData({
        publicId: response.public_id,
        email: formData.email,
        guestToken: response.guest_token,
      });
      toast({
        title: "Booking created",
        description: "Complete payment and submit proof before expiry to confirm your reservation.",
      });
    } catch (error) {
      toast({ title: "Booking failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const submitProof = async () => {
    if (!bookingSession || !paymentData.paymentProofFile) return;
    setProofSubmitting(true);
    try {
      await submitPaymentProof(bookingSession.publicId, {
        customer_email: formData.email,
        guest_token: bookingSession.guestToken,
        payment_method: paymentData.paymentMethod,
        payment_reference: paymentData.paymentReference,
        payment_proof_file: paymentData.paymentProofFile,
        payment_notes: paymentData.paymentNotes,
      });
      toast({ title: "Payment proof submitted", description: "Your booking is now waiting for admin verification." });
    } catch (error) {
      toast({ title: "Proof submission failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setProofSubmitting(false);
    }
  };

  const submitTracking = async () => {
    setTracking(true);
    try {
      const result = await trackBookingStatus(trackingData.publicId, {
        customer_email: trackingData.email,
        guest_token: trackingData.guestToken,
      });
      setTrackingResult(`Status: ${result.status.replace("_", " ")} | Slot: ${new Date(result.start_time).toLocaleString()}`);
    } catch (error) {
      toast({ title: "Tracking failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setTracking(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="spa-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Book Your Visit</CardTitle>
              <CardDescription>Live booking connected to your backend availability.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4" />Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4" />Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Select Service</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => handleChange("serviceId", value)}>
                    <SelectTrigger><SelectValue placeholder={servicesLoading ? "Loading services..." : "Choose service"} /></SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.key} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!servicesLoading && sortedServices.length === 0 ? (
                    <p className="text-xs text-[#9a9a9a]">
                      No services available yet. Please add services from admin.
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="w-4 h-4" />Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Clock className="w-4 h-4" />Available Slot</Label>
                    <Select
                      value={formData.availabilityId}
                      onValueChange={(value) => handleChange("availabilityId", value)}
                      disabled={!formData.serviceId || !selectedServiceIsBookable || !formData.date || slotsLoading}
                    >
                      <SelectTrigger><SelectValue placeholder={slotPlaceholder} /></SelectTrigger>
                      <SelectContent>
                        {availabilityOptions.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.label}
                          </SelectItem>
                        ))}
                        {!slotsLoading && availability.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-[#8a8a8a]">
                            {!formData.serviceId
                              ? "Choose a service to view slots."
                              : !selectedServiceIsBookable
                                ? "Selected service is not yet available for booking."
                                : !formData.date
                                  ? "Choose a date to view slots."
                                  : "No open slots for this date. Try another date."}
                          </div>
                        ) : null}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#9a9a9a]">
                      Slots come from admin-created availability and show only future, unbooked schedules for the selected service/date.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} className="min-h-[90px]" />
                </div>

                <Button type="submit" className="w-full spa-button" disabled={submitting || !selectedAvailability}>
                  {submitting ? "Creating Booking..." : "Create Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {bookingSession && (
            <Card className="spa-card border-[#D2D2D2]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#F1B2B5]" />Payment Submission</CardTitle>
                <CardDescription>
                  Booking Ref: {bookingSession.publicId}
                  <br />
                  Payment expires: {new Date(bookingSession.paymentExpiresAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={paymentData.paymentMethod}
                      onValueChange={(value: "gcash" | "bdo") => setPaymentData((prev) => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gcash">GCash</SelectItem>
                        <SelectItem value="bdo">BDO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Reference</Label>
                    <Input
                      value={paymentData.paymentReference}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, paymentReference: e.target.value }))}
                      placeholder="Transaction/reference number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Upload Proof (jpg/png/pdf)</Label>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        paymentProofFile: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea value={paymentData.paymentNotes} onChange={(e) => setPaymentData((prev) => ({ ...prev, paymentNotes: e.target.value }))} />
                </div>
                <Button
                  className="w-full spa-button"
                  onClick={submitProof}
                  disabled={proofSubmitting || !paymentData.paymentReference || !paymentData.paymentProofFile}
                >
                  {proofSubmitting ? "Submitting..." : "Submit Payment Proof"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="spa-card">
            <CardHeader>
              <CardTitle className="text-xl">Track Booking Status</CardTitle>
              <CardDescription>Check your booking using `public_id + guest_token + email`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Booking Ref (public_id)" value={trackingData.publicId} onChange={(e) => setTrackingData((prev) => ({ ...prev, publicId: e.target.value }))} />
                <Input placeholder="Email" value={trackingData.email} onChange={(e) => setTrackingData((prev) => ({ ...prev, email: e.target.value }))} />
                <Input placeholder="Guest token" value={trackingData.guestToken} onChange={(e) => setTrackingData((prev) => ({ ...prev, guestToken: e.target.value }))} />
              </div>
              <Button onClick={submitTracking} disabled={tracking || !trackingData.publicId || !trackingData.email || !trackingData.guestToken}>
                {tracking ? "Checking..." : "Track Status"}
              </Button>
              {trackingResult ? <p className="text-sm text-gray-700">{trackingResult}</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;



