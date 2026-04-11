export type Role = "USER" | "ADMIN";
export type AuthProvider = "CREDENTIALS" | "GOOGLE";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface ServiceDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string | null;
  categoryId: string;
  categoryName?: string;
}

export interface StaffDTO {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
}

export interface StaffWithServicesDTO extends StaffDTO {
  services: ServiceDTO[];
}

export interface ServiceWithStaffDTO extends ServiceDTO {
  staff: StaffDTO[];
}

export interface TimeSlotDTO {
  id: string;
  staffId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface BookingDTO {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  slotId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}

export interface BookingDetailDTO extends BookingDTO {
  userEmail: string;
  userName: string;
  staffPhotoUrl: string | null;
  serviceImageUrl: string | null;
  serviceDuration: number;
  stripePaymentId: string | null;
}

export interface CategoryWithServicesDTO extends CategoryDTO {
  services: ServiceDTO[];
}

export interface AdminStatsDTO {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalStaff: number;
  totalServices: number;
  totalUsers: number;
  upcomingBookings: number;
}

export function decimalToNumber(value: unknown): number {
  if (typeof value === "number") return value;
  return Number(String(value));
}
