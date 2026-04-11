import {
  ServiceRepository,
  CategoryRepository,
} from "@/repositories/ServiceRepository";
import {
  ServiceDTO,
  ServiceWithStaffDTO,
  CategoryDTO,
  CategoryWithServicesDTO,
  decimalToNumber,
} from "@/types";

export class ServiceService {
  private serviceRepo: ServiceRepository;
  private categoryRepo: CategoryRepository;

  constructor() {
    this.serviceRepo = new ServiceRepository();
    this.categoryRepo = new CategoryRepository();
  }

  async getAllServices(): Promise<ServiceWithStaffDTO[]> {
    const services = await this.serviceRepo.findAll();
    return services.map(this.mapToServiceWithStaff);
  }

  async getServiceById(id: string): Promise<ServiceWithStaffDTO | null> {
    const service = await this.serviceRepo.findById(id);
    if (!service) return null;
    return this.mapToServiceWithStaff(service);
  }

  async getServicesByCategory(slug: string): Promise<ServiceDTO[]> {
    const services = await this.serviceRepo.findByCategorySlug(slug);
    return services.map(this.mapToDTO);
  }

  async createService(data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    categoryId: string;
    imageUrl?: string | null;
  }) {
    return this.serviceRepo.create(data);
  }

  async updateService(
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
    return this.serviceRepo.update(id, data);
  }

  async deleteService(id: string) {
    return this.serviceRepo.delete(id);
  }

  async getAllCategories(): Promise<CategoryWithServicesDTO[]> {
    const categories = await this.categoryRepo.findAll();
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      order: cat.order,
      services: cat.services.map((svc) => ({
        id: svc.id,
        name: svc.name,
        description: svc.description,
        price: decimalToNumber(svc.price),
        duration: svc.duration,
        imageUrl: svc.imageUrl,
        categoryId: svc.categoryId,
      })),
    }));
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    const cat = await this.categoryRepo.findBySlug(slug);
    if (!cat) return null;
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      order: cat.order,
    };
  }

  async createCategory(data: { name: string; slug: string; order?: number }) {
    return this.categoryRepo.create(data);
  }

  async updateCategory(
    id: string,
    data: { name?: string; slug?: string; order?: number }
  ) {
    return this.categoryRepo.update(id, data);
  }

  async deleteCategory(id: string) {
    return this.categoryRepo.delete(id);
  }

  private mapToDTO = (service: Record<string, unknown>): ServiceDTO => {
    const cat = service.category as Record<string, unknown> | undefined;
    return {
      id: service.id as string,
      name: service.name as string,
      description: service.description as string,
      price: decimalToNumber(service.price as never),
      duration: service.duration as number,
      imageUrl: (service.imageUrl as string) || null,
      categoryId: service.categoryId as string,
      categoryName: cat?.name as string | undefined,
    };
  };

  private mapToServiceWithStaff = (
    service: Record<string, unknown>
  ): ServiceWithStaffDTO => {
    const staffLinks =
      (service.staffLinks as Record<string, unknown>[]) || [];
    return {
      ...this.mapToDTO(service),
      staff: staffLinks.map((link) => {
        const s = link.staff as Record<string, unknown>;
        return {
          id: s.id as string,
          name: s.name as string,
          bio: (s.bio as string) || null,
          photoUrl: (s.photoUrl as string) || null,
        };
      }),
    };
  };
}
