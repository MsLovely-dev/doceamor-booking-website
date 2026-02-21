import { apiRequest } from "@/lib/api";

export interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: string;
}

export interface Availability {
  id: number;
  staff: number;
  service: number;
  start_time: string;
  end_time: string;
}

export interface CreateBookingPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  service: number;
  staff: number;
  availability: number;
}

export interface CreateBookingResponse {
  public_id: string;
  guest_token: string;
  status: string;
  payment_expires_at: string;
  payment_methods: string[];
}

export interface SubmitPaymentProofPayload {
  customer_email: string;
  guest_token: string;
  payment_method: "gcash" | "bdo";
  payment_reference: string;
  payment_proof_file: File;
  payment_notes?: string;
}

export interface TrackStatusPayload {
  customer_email: string;
  guest_token: string;
}

export interface TrackStatusResponse {
  public_id: string;
  status: string;
  service_name: string;
  staff_name: string;
  start_time: string;
  end_time: string;
  payment_expires_at: string | null;
  payment_submitted_at: string | null;
  payment_verified_at: string | null;
  created_at: string;
}

export async function fetchServices(): Promise<Service[]> {
  return apiRequest<Service[]>("/api/services/");
}

export async function fetchAvailabilityByServiceAndDate(serviceId: number, date: string): Promise<Availability[]> {
  const query = new URLSearchParams({ service: String(serviceId), date }).toString();
  return apiRequest<Availability[]>(`/api/bookings/availability/?${query}`);
}

export async function createBooking(payload: CreateBookingPayload): Promise<CreateBookingResponse> {
  return apiRequest<CreateBookingResponse>("/api/bookings/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function submitPaymentProof(publicId: string, payload: SubmitPaymentProofPayload) {
  const formData = new FormData();
  formData.append("customer_email", payload.customer_email);
  formData.append("guest_token", payload.guest_token);
  formData.append("payment_method", payload.payment_method);
  formData.append("payment_reference", payload.payment_reference);
  formData.append("payment_proof_file", payload.payment_proof_file);
  if (payload.payment_notes) {
    formData.append("payment_notes", payload.payment_notes);
  }

  return apiRequest<{ status: string; message: string }>(`/api/bookings/${publicId}/submit-payment-proof/`, {
    method: "POST",
    body: formData,
  });
}

export async function trackBookingStatus(publicId: string, payload: TrackStatusPayload): Promise<TrackStatusResponse> {
  return apiRequest<TrackStatusResponse>(`/api/bookings/${publicId}/track-status/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

