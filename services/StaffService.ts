import { StaffRepository } from "@/repositories/StaffRepository";
import { TimeSlotRepository } from "@/repositories/ServiceRepository";
import { StaffDTO, StaffWithServicesDTO, decimalToNumber } from "@/types";

export class StaffService {
  private staffRepo: StaffRepository;
  private slotRepo: TimeSlotRepository;

  constructor() {
    this.staffRepo = new StaffRepository();
    this.slotRepo = new TimeSlotRepository();
  }

  async getAllStaff(): Promise<StaffWithServicesDTO[]> {
    const staffList = await this.staffRepo.findAll();
    return staffList.map(this.mapToStaffWithServices);
  }

  async getStaffById(id: string): Promise<StaffWithServicesDTO | null> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) return null;
    return this.mapToStaffWithServices(staff);
  }

  async getStaffByServiceId(serviceId: string): Promise<StaffDTO[]> {
    const staffList = await this.staffRepo.findByServiceId(serviceId);
    return staffList.map(this.mapToDTO);
  }

  async createStaff(data: {
    name: string;
    bio?: string | null;
    photoUrl?: string | null;
  }) {
    return this.staffRepo.create(data);
  }

  async updateStaff(
    id: string,
    data: { name?: string; bio?: string | null; photoUrl?: string | null }
  ) {
    return this.staffRepo.update(id, data);
  }

  async deleteStaff(id: string) {
    return this.staffRepo.delete(id);
  }

  async assignService(staffId: string, serviceId: string) {
    return this.staffRepo.assignService(staffId, serviceId);
  }

  async unassignService(staffId: string, serviceId: string) {
    return this.staffRepo.unassignService(staffId, serviceId);
  }

  async getAvailableSlots(staffId: string, date?: string) {
    const slots = await this.slotRepo.findAvailable(staffId, date);
    return slots.map((slot) => ({
      id: slot.id,
      staffId: slot.staffId,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
      isBooked: slot.isBooked,
    }));
  }

  async getAvailableDates(staffId: string) {
    return this.slotRepo.getAvailableDates(staffId);
  }

  async generateTimeSlots(data: {
    staffId: string;
    date: string;
    startHour: number;
    endHour: number;
    slotDuration: number;
  }) {
    const slots = [];
    const baseDate = new Date(`${data.date}T00:00:00.000Z`);

    for (let hour = data.startHour; hour < data.endHour; ) {
      const startTime = new Date(baseDate);
      startTime.setUTCHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setUTCMinutes(endTime.getUTCMinutes() + data.slotDuration);

      if (endTime.getUTCHours() > data.endHour || 
          (endTime.getUTCHours() === data.endHour && endTime.getUTCMinutes() > 0)) {
        break;
      }

      slots.push({
        staffId: data.staffId,
        startTime,
        endTime,
      });

      hour = endTime.getUTCHours();
      if (endTime.getUTCMinutes() > 0) {
        const nextStart = new Date(endTime);
        slots[slots.length - 1].endTime = endTime;
        hour = nextStart.getUTCHours() + (nextStart.getUTCMinutes() > 0 ? 1 : 0);
      }
    }

    if (slots.length === 0) return { count: 0 };

    return this.slotRepo.createMany(slots);
  }

  private mapToDTO = (staff: Record<string, unknown>): StaffDTO => ({
    id: staff.id as string,
    name: staff.name as string,
    bio: (staff.bio as string) || null,
    photoUrl: (staff.photoUrl as string) || null,
  });

  private mapToStaffWithServices = (
    staff: Record<string, unknown>
  ): StaffWithServicesDTO => {
    const services = (staff.services as Record<string, unknown>[]) || [];
    return {
      ...this.mapToDTO(staff),
      services: services.map((link) => {
        const svc = link.service as Record<string, unknown>;
        const cat = svc.category as Record<string, unknown> | undefined;
        return {
          id: svc.id as string,
          name: svc.name as string,
          description: svc.description as string,
          price: decimalToNumber(svc.price as never),
          duration: svc.duration as number,
          imageUrl: (svc.imageUrl as string) || null,
          categoryId: svc.categoryId as string,
          categoryName: cat?.name as string | undefined,
        };
      }),
    };
  };
}
