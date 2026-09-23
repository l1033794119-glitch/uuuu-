import { z } from "zod";

// 表单校验：姓名、邮箱、电话、地址、邮编
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "name_required")
    .max(60, "name_too_long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "email_invalid")
    .max(120, "email_invalid")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "email_invalid"),
  phone: z
    .string()
    .trim()
    .min(6, "phone_invalid")
    .max(20, "phone_invalid")
    .regex(/^[+\d][\d\s-]{4,19}$/, "phone_invalid"),
  address: z
    .string()
    .trim()
    .min(5, "address_required")
    .max(240, "address_too_long"),
  zipcode: z
    .string()
    .trim()
    .min(3, "zipcode_invalid")
    .max(12, "zipcode_invalid"),
  language: z.enum(["zh", "vi", "en", "ru", "id", "hi", "fil", "uk", "hy", "kk"]).default("zh"),
  agree: z.boolean().refine((v) => v === true, "agree_required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
