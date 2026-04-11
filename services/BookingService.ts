import { BookingRepository } from "@/repositories/BookingRepository";
import { TimeSlotRepository, ServiceRepository } from "@/repositories/ServiceRepository";
import { StaffRepository } from "@/repositories/StaffRepository";
import {
  BookingDTO,
  BookingDetailDTO,
  BookingStatus,
  decimalToNumber,
} from "@/types";

export class BookingService {
  private bookingRepo: BookingRepository;
  private slotRepo: TimeSlotRepository;
  private staffRepo: StaffRepository;

  constructor() {
    this.bookingRepo = new BookingRepository();
    this.slotRepo = new TimeSlotRepository();
    this.staffRepo = new StaffRepository();
  }

  async getBookingById(id: string): Promise<BookingDetailDTO | null> {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) return null;
    return this.mapToDetailDTO(booking);
  }

  async getUserBookings(userId: string): Promise<BookingDTO[]> {
    const bookings = await this.bookingRepo.findByUserId(userId);
    return bookings.map(this.mapToDTO);
  }

  async getAllBookings(filters?: {
    status?: BookingStatus;
    staffId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<BookingDTO[]> {
    const bookings = await this.bookingRepo.findAll({
      status: filters?.status,
      staffId: filters?.staffId,
      dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    });
    return bookings.map(this.mapToDTO);
  }

  async createBooking(data: {
    userId: string;
    serviceId: string;
    staffId: string;
    slotId: string;
    totalPrice: number;
  }): Promise<BookingDTO> {
    const slot = await this.slotRepo.findById(data.slotId);
    if (!slot) throw new Error("SLOT_NOT_FOUND");
    if (slot.isBooked) throw new Error("SLOT_UNAVAILABLE");
    if (slot.staffId !== data.staffId) throw new Error("SLOT_STAFF_MISMATCH");

    const booking = await this.bookingRepo.create(data);
    return this.mapToDTO(booking);
  }

  async confirmBooking(bookingId: string, stripePaymentId: string) {
    return this.bookingRepo.confirmBooking(bookingId, stripePaymentId);
  }

  async cancelBooking(bookingId: string, userId?: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error("BOOKING_NOT_FOUND");
    if (userId && booking.userId !== userId) throw new Error("UNAUTHORIZED");
    if (booking.status === "CANCELLED") throw new Error("ALREADY_CANCELLED");

    return this.bookingRepo.cancelBooking(bookingId);
  }

  async updateStatus(bookingId: string, status: BookingStatus) {
    return this.bookingRepo.updateStatus(bookingId, status);
  }

  async getAlternativeStaff(serviceId: string, excludeStaffId: string) {
    const allStaff = await this.staffRepo.findByServiceId(serviceId);
    const alternatives = [];

    for (const staff of allStaff) {
      if (staff.id === excludeStaffId) continue;
      const dates = await this.slotRepo.getAvailableDates(staff.id);
      if (dates.length > 0) {
        alternatives.push({
          id: staff.id,
          name: staff.name,
          photoUrl: (staff as Record<string, unknown>).photoUrl as string | null,
          availableDates: dates.slice(0, 5),
        });
      }
    }

    return alternatives;
  }

  async getAdminStats() {
    const [
      totalBookings,
      confirmedBookings,
      totalRevenue,
      upcomingBookings,
    ] = await Promise.all([
      this.bookingRepo.countByStatus(),
      this.bookingRepo.countByStatus("CONFIRMED"),
      this.bookingRepo.getTotalRevenue(),
      this.bookingRepo.countUpcoming(),
    ]);

    const staffRepo = new StaffRepository();
    const svcRepo = new ServiceRepository();

    const [totalStaff, totalServices] = await Promise.all([
      staffRepo.count(),
      svcRepo.count(),
    ]);

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue,
      totalStaff,
      totalServices,
      totalUsers: 0,
      upcomingBookings,
    };
  }

  private mapToDTO = (booking: Record<string, unknown>): BookingDTO => {
    const service = booking.service as Record<string, unknown>;
    const staff = booking.staff as Record<string, unknown>;
    const slot = booking.slot as Record<string, unknown>;
    return {
      id: booking.id as string,
      userId: booking.userId as string,
      serviceId: booking.serviceId as string,
      serviceName: service.name as string,
      staffId: booking.staffId as string,
      staffName: staff.name as string,
      slotId: booking.slotId as string,
      startTime: (slot.startTime as Date).toISOString(),
      endTime: (slot.endTime as Date).toISOString(),
      status: booking.status as BookingDTO["status"],
      totalPrice: decimalToNumber(booking.totalPrice as never),
      createdAt: (booking.createdAt as Date).toISOString(),
    };
  };

  private mapToDetailDTO = (
    booking: Record<string, unknown>
  ): BookingDetailDTO => {
    const base = this.mapToDTO(booking);
    const user = booking.user as Record<string, unknown>;
    const staff = booking.staff as Record<string, unknown>;
    const service = booking.service as Record<string, unknown>;
    return {
      ...base,
      userEmail: user.email as string,
      userName: user.name as string,
      staffPhotoUrl: staff.photoUrl as string | null,
      serviceImageUrl: service.imageUrl as string | null,
      serviceDuration: service.duration as number,
      stripePaymentId: booking.stripePaymentId as string | null,
    };
  };
}
