import { prisma } from "@/lib/prisma";

export class StaffRepository {
  async findAll() {
    return prisma.staff.findMany({
      include: {
        services: {
          include: { service: { include: { category: true } } },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.staff.findUnique({
      where: { id },
      include: {
        services: {
          include: { service: { include: { category: true } } },
        },
        slots: {
          where: {
            isBooked: false,
            startTime: { gte: new Date() },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });
  }

  async findByServiceId(serviceId: string) {
    return prisma.staff.findMany({
      where: {
        services: {
          some: { serviceId },
        },
      },
      include: {
        services: {
          include: { service: true },
        },
      },
    });
  }

  async create(data: { name: string; bio?: string | null; photoUrl?: string | null }) {
    return prisma.staff.create({ data });
  }

  async update(id: string, data: { name?: string; bio?: string | null; photoUrl?: string | null }) {
    return prisma.staff.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.staff.delete({ where: { id } });
  }

  async assignService(staffId: string, serviceId: string) {
    return prisma.staffService.create({
      data: { staffId, serviceId },
    });
  }

  async unassignService(staffId: string, serviceId: string) {
    return prisma.staffService.delete({
      where: {
        staffId_serviceId: { staffId, serviceId },
      },
    });
  }

  async count() {
    return prisma.staff.count();
  }
}
