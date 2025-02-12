import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Precisa ter 2 ou mais caracteres').optional(),
    bio: z.string().min(2, 'Precisa ter 2 ou mais caracteres').optional(),
    link: z.string().min(2, 'Precisa ter 2 ou mais caracteres).optional')
});