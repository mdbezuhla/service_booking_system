import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createServiceSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  categoryId: z.string().cuid(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const createStaffSchema = z.object({
  name: z.string().min(1).max(200),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
});

export const updateStaffSchema = createStaffSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  order: z.number().int().min(0).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const assignServiceToStaffSchema = z.object({
  staffId: z.string().cuid(),
  serviceId: z.string().cuid(),
});

export const createTimeSlotsSchema = z.object({
  staffId: z.string().cuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  slotDuration: z.number().int().positive(),
});

export const createBookingSchema = z.object({
  serviceId: z.string().cuid(),
  staffId: z.string().cuid(),
  slotId: z.string().cuid(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTimeSlotsInput = z.infer<typeof createTimeSlotsSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
