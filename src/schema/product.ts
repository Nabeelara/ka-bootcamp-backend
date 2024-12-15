import { z } from "zod";

const flavourSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  color: z.string(),
});

// const imageSchema = z.object({
//   id: z.number(),
//   filename: z.string(),
// });

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"), // Validasi nama
  price: z.number(),
  categoryId: z.number(),
  description: z.string().nullable().optional(), // Deskripsi opsional
  company: z.string(),
  rating: z.string().optional().nullable(),
  flavours: z.array(flavourSchema),
  // images: z.array(imageSchema),
});
