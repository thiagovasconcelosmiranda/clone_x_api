import { z } from "zod";

export const searchSchema = z.object({
    q: z.string({message: 'Preencha a busca'}),
    page: z.coerce.number().min(0).optional()
});