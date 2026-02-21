const bookingEnabledRaw = import.meta.env.VITE_BOOKING_ENABLED;

export const BOOKING_ENABLED = bookingEnabledRaw === "true";
