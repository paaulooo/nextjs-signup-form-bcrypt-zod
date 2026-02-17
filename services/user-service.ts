'use server'

import {UserDTO, User} from "@/models/user"
import {db} from "../lib/db"
import { revalidatePath } from "next/cache"

import * as bcrypt from 'bcrypt'
import { email, success } from "zod"


async function hashPassword(password:string) : Promise<string>{
    const cost : number = 10; // Quanto mais alto mais demorado e seguro, mais baixo mais rapido e menos seguro.
    const hashed : string = await bcrypt.hash(password, cost)

    function verifyPassword(password: string, hashed: string){
        bcrypt.compare(password, hashed, (err, result) =>{
            if(err)
            {
                console.error("Error Verifying password: ", err)
            }else[
                console.log('Password Match! ', result)
            ]
        })
    }

    verifyPassword(password, hashed)

    return hashed
}


export async function createUser( data: UserDTO){
    const r = User.safeParse(data);

    if(!r.success){

        return {
            success: false,
            errors: r.error.flatten(),
            
        }
    }

    try{
        //verifica email

        const existingUser = await db.user.findUnique({
            where: {
                email: r.data.email
            }
        })

        if(existingUser){
            return {
                success: false,
                errors: {
                    email: ["Este email ja está cadastrado."]
                }
            }
        }

        //cria user
        const user = await db.user.create({
            data: {
                name: r.data.name,
                email: r.data.email,
                password_hash: await hashPassword(r.data.password)
            }
        })
        console.log("User has been created! ", user.id)
        revalidatePath("/users")

        return {
            success: true,
            message: "User has been created!!!",
        }
    }catch(error){
        console.error("Error creating user: ", error)
        return {
            success: false,
            message: "Failed to create user. Try Again."
        }
    }
    
}