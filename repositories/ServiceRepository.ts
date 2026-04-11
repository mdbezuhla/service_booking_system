import { prisma } from "@/lib/prisma";

export class ServiceRepository {
  async findAll() {
    return prisma.service.findMany({
      include: {
        category: true,
        staffLinks: {
          include: { staff: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        staffLinks: {
          include: { staff: true },
        },
      },
    });
  }

  async findByCategorySlug(slug: string) {
    return prisma.service.findMany({
      where: { category: { slug } },
      include: {
        category: true,
        staffLinks: {
          include: { staff: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    categoryId: string;
    imageUrl?: string | null;
  }) {
    return prisma.service.create({
      data,
      include: { category: true },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      duration?: number;
      categoryId?: string;
      imageUrl?: string | null;
    }
  ) {
    return prisma.service.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id: string) {
    return prisma.service.delete({ where: { id } });
  }

  async count() {
    return prisma.service.count();
  }
}

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      include: { services: true },
      orderBy: { order: "asc" },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { services: true },
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { services: true },
    });
  }

  async create(data: { name: string; slug: string; order?: number }) {
    return prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; slug?: string; order?: number }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}

export class TimeSlotRepository {
  async findAvailable(staffId: string, date?: string) {
    const where: Record<string, unknown> = {
      staffId,
      isBooked: false,
      startTime: { gte: new Date() },
    };

    if (date) {
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);
      where.startTime = { gte: dayStart, lte: dayEnd };
    }

    return prisma.timeSlot.findMany({
      where,
      orderBy: { startTime: "asc" },
    });
  }

  async findByStaffId(staffId: string) {
    return prisma.timeSlot.findMany({
      where: { staffId },
      orderBy: { startTime: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.timeSlot.findUnique({
      where: { id },
    });
  }

  async createMany(
    slots: { staffId: string; startTime: Date; endTime: Date }[]
  ) {
    return prisma.timeSlot.createMany({ data: slots });
  }

  async delete(id: string) {
    return prisma.timeSlot.delete({ where: { id } });
  }

  async deleteByStaffAndDateRange(staffId: string, from: Date, to: Date) {
    return prisma.timeSlot.deleteMany({
      where: {
        staffId,
        isBooked: false,
        startTime: { gte: from, lte: to },
      },
    });
  }

  async getAvailableDates(staffId: string) {
    const slots = await prisma.timeSlot.findMany({
      where: {
        staffId,
        isBooked: false,
        startTime: { gte: new Date() },
      },
      select: { startTime: true },
      orderBy: { startTime: "asc" },
    });

    const dates = new Set(
      slots.map((s: { startTime: Date }) => s.startTime.toISOString().split("T")[0])
    );
    return Array.from(dates);
  }
}
