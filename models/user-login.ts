import { email, z } from 'zod';

export const userLogin = z.object({
    email: z.string().email("Formato invalido de email"),
    password: z.string().min(2," A senha é obrigatória! ")
})

export type userLoginDTO = z.infer<typeof userLogin>