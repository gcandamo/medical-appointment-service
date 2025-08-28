import { z } from 'zod';

export const AppointmentSchema = z.object({
  insuredId: z.string().regex(/^\d{5}$/, 'insuredId debe ser un string de 5 digitos'),
  scheduleId: z.number().int().nonnegative(),
  countryISO: z.enum(['PE', 'CL'])
});

export type AppointmentInput = z.infer<typeof AppointmentSchema>;
