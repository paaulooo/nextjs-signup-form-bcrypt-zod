import {z} from 'zod'

export const User = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "A senha deve ter no minimo 8 caracteres").max(32)
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "A senha deve conter pelo menos um caractere especial"),
    confirm_password: z.string()
})
.refine((data) => data.password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"]
})

export type UserDTO = z.infer<typeof User>