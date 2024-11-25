import { z } from "zod";

const colorSchema = z.object({
  color: z.string(),
  quantity: z.number(),
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
  colors: z.array(colorSchema),
  // images: z.array(imageSchema),
});
