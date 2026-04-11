import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@/types";

export class BookingRepository {
  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        service: true,
        staff: true,
        slot: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
        staff: true,
        slot: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(filters?: {
    status?: BookingStatus;
    staffId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    return prisma.booking.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.staffId && { staffId: filters.staffId }),
        ...(filters?.dateFrom || filters?.dateTo
          ? {
              slot: {
                startTime: {
                  ...(filters?.dateFrom && { gte: filters.dateFrom }),
                  ...(filters?.dateTo && { lte: filters.dateTo }),
                },
              },
            }
          : {}),
      },
      include: {
        user: true,
        service: true,
        staff: true,
        slot: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    userId: string;
    serviceId: string;
    staffId: string;
    slotId: string;
    totalPrice: number;
    stripePaymentId?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const slot = await tx.timeSlot.findUnique({
        where: { id: data.slotId },
      });

      if (!slot || slot.isBooked) {
        throw new Error("SLOT_UNAVAILABLE");
      }

      const booking = await tx.booking.create({
        data: {
          userId: data.userId,
          serviceId: data.serviceId,
          staffId: data.staffId,
          slotId: data.slotId,
          totalPrice: data.totalPrice,
          stripePaymentId: data.stripePaymentId,
          status: "PENDING",
        },
        include: {
          service: true,
          staff: true,
          slot: true,
        },
      });

      return booking;
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        staff: true,
        slot: true,
        user: true,
      },
    });
  }

  async confirmBooking(id: string, stripePaymentId: string) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: {
          status: "CONFIRMED",
          stripePaymentId,
        },
      });

      await tx.timeSlot.update({
        where: { id: booking.slotId },
        data: { isBooked: true },
      });

      return booking;
    });
  }

  async cancelBooking(id: string) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      await tx.timeSlot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      return booking;
    });
  }

  async countByStatus(status?: BookingStatus) {
    return prisma.booking.count({
      where: status ? { status } : undefined,
    });
  }

  async getTotalRevenue() {
    const result = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: "CONFIRMED" },
    });
    return Number(result._sum.totalPrice || 0);
  }

  async countUpcoming() {
    return prisma.booking.count({
      where: {
        status: "CONFIRMED",
        slot: {
          startTime: { gte: new Date() },
        },
      },
    });
  }
}
